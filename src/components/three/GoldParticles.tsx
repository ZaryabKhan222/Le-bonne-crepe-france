"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A faint field of warm gold bokeh over the hero video.
 *
 * Deliberately restrained: a few hundred points, most of them tiny, drifting
 * slowly upward at low opacity. Visibility is weighted in screen space so the
 * shimmer gathers toward the edges and the lower third of the frame and thins
 * out behind the headline, keeping the text readable. One draw call.
 */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec4 uTextZone; // ndc xmin, xmax, ymin, ymax kept clear of particles
  attribute float aScale;
  attribute float aSpeed;
  attribute float aPhase;
  varying float vTwinkle;
  varying float vDepth;
  varying float vMask;
  varying float vSize;

  void main() {
    vec3 pos = position;
    // Slow upward drift with a soft sideways sway, wrapping vertically.
    pos.y = mod(pos.y + uTime * aSpeed * 0.045, 9.0) - 4.5;
    pos.x += sin(uTime * 0.09 + aPhase * 6.283) * 0.22;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Screen-space weighting: brighter toward the left/right edges and the
    // lower third, nearly invisible inside the headline zone.
    vec2 ndc = gl_Position.xy / gl_Position.w;
    float edge = smoothstep(0.15, 0.95, abs(ndc.x));
    float low = smoothstep(0.35, -0.55, ndc.y);
    float weight = 0.18 + 0.82 * max(edge, low * 0.85);

    float inX = smoothstep(uTextZone.x - 0.25, uTextZone.x, ndc.x) * (1.0 - smoothstep(uTextZone.y, uTextZone.y + 0.25, ndc.x));
    float inY = smoothstep(uTextZone.z - 0.25, uTextZone.z, ndc.y) * (1.0 - smoothstep(uTextZone.w, uTextZone.w + 0.25, ndc.y));
    float inText = inX * inY;
    vMask = weight * (1.0 - 0.9 * inText);

    vTwinkle = 0.6 + 0.4 * sin(uTime * (0.35 + aSpeed * 0.5) + aPhase * 6.283);
    vDepth = clamp((-mvPosition.z - 2.0) / 8.0, 0.0, 1.0);
    vSize = aScale;
    gl_PointSize = aScale * uPixelRatio * (150.0 / -mvPosition.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vTwinkle;
  varying float vDepth;
  varying float vMask;
  varying float vSize;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    // Soft-focus disc: no hard rim, a gentle gaussian-like falloff so the
    // points read as out-of-focus light rather than dots.
    float soft = smoothstep(0.5, 0.0, d);
    soft *= soft;
    // Larger discs are the most out of focus, so they are the faintest.
    float sizeFade = mix(1.0, 0.35, smoothstep(1.2, 4.0, vSize));
    float alpha = soft * vTwinkle * vMask * sizeFade * 0.34;
    vec3 color = mix(uColorA, uColorB, vDepth);
    gl_FragColor = vec4(color, alpha);
  }
`;

function Particles({ count, textZone }: { count: number; textZone: [number, number, number, number] }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const points = useRef<THREE.Points>(null);
  const { gl } = useThree();

  const { positions, scales, speeds, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    const rand = mulberry32(20260919);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 14;
      positions[i * 3 + 1] = (rand() - 0.5) * 9;
      positions[i * 3 + 2] = (rand() - 0.5) * 7;
      // Mostly tiny sparks, a handful of mid points, very few large soft discs.
      const r = rand();
      scales[i] = r < 0.78 ? 0.3 + rand() * 0.5 : r < 0.94 ? 0.9 + rand() * 0.9 : 2.4 + rand() * 2.2;
      speeds[i] = 0.35 + rand() * 0.7;
      phases[i] = rand();
    }
    return { positions, scales, speeds, phases };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.5) },
      uTextZone: { value: new THREE.Vector4(...textZone) },
      uColorA: { value: new THREE.Color("#e9d7a3") },
      uColorB: { value: new THREE.Color("#c9a34e") },
    }),
    [gl, textZone]
  );

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (points.current) {
      // Cursor parallax, eased and small so it feels weighty rather than twitchy.
      const targetX = state.pointer.x * 0.2;
      const targetY = state.pointer.y * 0.12;
      points.current.rotation.y += (targetX * 0.3 - points.current.rotation.y) * 0.03;
      points.current.rotation.x += (-targetY * 0.2 - points.current.rotation.x) * 0.03;
    }
  });

  return (
    <points ref={points} position={[0, 0, 0]} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Deterministic PRNG so the field looks identical on every visit. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Normalized device coordinates of the headline block, kept mostly clear.
 * Desktop: text sits in the lower-left of the hero. Mobile: full width,
 * lower half.
 */
const TEXT_ZONE_DESKTOP: [number, number, number, number] = [-1, 0.15, -0.75, 0.35];
const TEXT_ZONE_MOBILE: [number, number, number, number] = [-1, 1, -0.85, 0.3];

export default function GoldParticles({
  active,
  isMobile,
}: {
  active: boolean;
  isMobile: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 55 }}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      <Particles
        count={isMobile ? 150 : 380}
        textZone={isMobile ? TEXT_ZONE_MOBILE : TEXT_ZONE_DESKTOP}
      />
    </Canvas>
  );
}
