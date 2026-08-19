"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A drifting field of warm gold bokeh over the hero photograph.
 * Custom point shader: soft discs, gentle twinkle, slow upward drift,
 * cursor parallax. Kept deliberately small (one draw call).
 */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aScale;
  attribute float aSpeed;
  attribute float aPhase;
  varying float vTwinkle;
  varying float vDepth;

  void main() {
    vec3 pos = position;
    // Slow upward drift with a soft sideways sway, wrapping vertically.
    pos.y = mod(pos.y + uTime * aSpeed * 0.14, 9.0) - 4.5;
    pos.x += sin(uTime * 0.18 + aPhase) * 0.35;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    vTwinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aSpeed) + aPhase * 6.283);
    vDepth = clamp((-mvPosition.z - 2.0) / 8.0, 0.0, 1.0);
    gl_PointSize = aScale * uPixelRatio * (140.0 / -mvPosition.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vTwinkle;
  varying float vDepth;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    // Soft bokeh disc: bright core, feathered edge.
    float alpha = smoothstep(0.5, 0.08, d) * vTwinkle;
    vec3 color = mix(uColorA, uColorB, vDepth);
    gl_FragColor = vec4(color, alpha * 0.55);
  }
`;

function Particles({ count }: { count: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const points = useRef<THREE.Points>(null);
  const { gl } = useThree();

  const { positions, scales, speeds, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    const rand = mulberry32(20260813);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 14;
      positions[i * 3 + 1] = (rand() - 0.5) * 9;
      positions[i * 3 + 2] = (rand() - 0.5) * 7;
      // A few large soft bokeh discs, many small sparks.
      scales[i] = rand() < 0.12 ? 2.2 + rand() * 2.6 : 0.5 + rand() * 1.1;
      speeds[i] = 0.4 + rand() * 0.9;
      phases[i] = rand();
    }
    return { positions, scales, speeds, phases };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.5) },
      uColorA: { value: new THREE.Color("#e4cd8e") },
      uColorB: { value: new THREE.Color("#c9a34e") },
    }),
    [gl]
  );

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (points.current) {
      // Cursor parallax, eased so it feels weighty rather than twitchy.
      const targetX = state.pointer.x * 0.35;
      const targetY = state.pointer.y * 0.2;
      points.current.rotation.y += (targetX * 0.3 - points.current.rotation.y) * 0.04;
      points.current.rotation.x += (-targetY * 0.2 - points.current.rotation.x) * 0.04;
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
      <Particles count={isMobile ? 450 : 1100} />
    </Canvas>
  );
}
