"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { site } from "@/data/site";
import { logoGold } from "@/data/images";

/** Export size in pixels for both PNG and SVG (well above the 1000 px minimum). */
const EXPORT_SIZE = 1200;
/** Quiet zone in modules; the QR spec asks for 4. */
const MARGIN = 4;
/** Logo footprint as a fraction of the QR side. Level H tolerates 30 percent damage. */
const LOGO_RATIO = 0.22;

const CHARCOAL = "#1a1a1a";
const MARBLE = "#fbfaf7";

type Code = {
  id: string;
  label: string;
  caption: string;
  path: string;
  file: string;
};

const CODES: Code[] = [
  { id: "website", label: "Website", caption: "Scan to explore La Bonne Crêpe", path: "", file: "la-bonne-crepe-qr-website" },
  { id: "menu", label: "Menu", caption: "Scan to view our menu", path: "/#menu", file: "la-bonne-crepe-qr-menu" },
];

/**
 * Loads the gold badge and returns it as a PNG data URI. Embedding a data URI
 * rather than a path keeps the exported SVG self-contained and lets the canvas
 * export read pixels without tainting.
 */
function useLogoDataUrl(): string | null {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    const img = new window.Image();
    img.onload = () => {
      if (cancelled) return;
      const side = 512;
      const c = document.createElement("canvas");
      c.width = side;
      c.height = side;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      // Badge on a marble disc so it sits cleanly inside the excavated modules.
      ctx.fillStyle = MARBLE;
      ctx.beginPath();
      ctx.arc(side / 2, side / 2, side / 2, 0, Math.PI * 2);
      ctx.fill();
      const inset = side * 0.06;
      ctx.drawImage(img, inset, inset, side - inset * 2, side - inset * 2);
      setDataUrl(c.toDataURL("image/png"));
    };
    img.src = logoGold.src;
    return () => {
      cancelled = true;
    };
  }, []);
  return dataUrl;
}

function download(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function QrCard({ code, baseUrl, logo }: { code: Code; baseUrl: string; logo: string | null }) {
  const value = `${baseUrl}${code.path}`;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const imageSettings = logo
    ? {
        src: logo,
        width: Math.round(EXPORT_SIZE * LOGO_RATIO),
        height: Math.round(EXPORT_SIZE * LOGO_RATIO),
        excavate: true,
      }
    : undefined;
  const previewImage = logo
    ? { src: logo, width: Math.round(320 * LOGO_RATIO), height: Math.round(320 * LOGO_RATIO), excavate: true }
    : undefined;

  const savePng = () => {
    const c = canvasRef.current;
    if (!c) return;
    download(c.toDataURL("image/png"), `${code.file}.png`);
  };

  const saveSvg = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    clone.setAttribute("width", String(EXPORT_SIZE));
    clone.setAttribute("height", String(EXPORT_SIZE));
    const markup = `<?xml version="1.0" encoding="UTF-8"?>\n${clone.outerHTML}`;
    const url = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml;charset=utf-8" }));
    download(url, `${code.file}.svg`);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <article className="flex flex-col items-center rounded-xl border border-gold/25 bg-cream p-8 text-center shadow-[0_18px_50px_rgba(26,26,26,0.08)] md:p-10">
      <p className="text-[0.68rem] font-semibold tracking-[0.28em] text-gold-deep uppercase">{site.name}</p>
      <h2 className="font-display mt-2 text-3xl font-medium tracking-tight text-charcoal">{code.label}</h2>
      <div aria-hidden="true" className="mt-3 h-px w-14 bg-gradient-to-r from-gold-deep to-gold-light" />

      {/* On-screen preview */}
      <div className="mt-8 rounded-lg bg-marble p-4 ring-1 ring-gold/20">
        <QRCodeSVG
          value={value}
          size={320}
          level="H"
          marginSize={MARGIN}
          bgColor={MARBLE}
          fgColor={CHARCOAL}
          imageSettings={previewImage}
          title={`QR code: ${code.caption}`}
          className="h-auto w-full max-w-[320px]"
        />
      </div>

      <p className="font-display mt-6 text-lg text-charcoal italic">{code.caption}</p>
      <p className="mt-2 max-w-full truncate text-xs text-ink/50" title={value}>
        {value}
      </p>

      <div className="print:hidden mt-7 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={savePng}
          disabled={!logo}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold tracking-wide text-charcoal uppercase shadow-[0_1px_12px_rgba(201,163,78,0.35)] transition-colors duration-300 hover:bg-gold-light disabled:opacity-50"
        >
          <DownloadIcon />
          PNG
        </button>
        <button
          type="button"
          onClick={saveSvg}
          disabled={!logo}
          className="inline-flex items-center gap-2 rounded-full border border-gold-deep/50 px-6 py-2.5 text-sm font-semibold tracking-wide text-gold-deep uppercase transition-colors duration-300 hover:border-gold-deep hover:bg-gold-deep/5 disabled:opacity-50"
        >
          <DownloadIcon />
          SVG
        </button>
      </div>
      <p className="print:hidden mt-3 text-[0.7rem] text-ink/45">
        {EXPORT_SIZE} × {EXPORT_SIZE} px, error correction level H
      </p>

      {/* Hidden full-resolution renders used for the downloads */}
      <div aria-hidden="true" className="pointer-events-none fixed -left-[9999px] top-0 opacity-0">
        <QRCodeCanvas
          ref={canvasRef}
          value={value}
          size={EXPORT_SIZE}
          level="H"
          marginSize={MARGIN}
          bgColor={MARBLE}
          fgColor={CHARCOAL}
          imageSettings={imageSettings}
        />
        <QRCodeSVG
          ref={svgRef}
          value={value}
          size={EXPORT_SIZE}
          level="H"
          marginSize={MARGIN}
          bgColor={MARBLE}
          fgColor={CHARCOAL}
          imageSettings={imageSettings}
        />
      </div>
    </article>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2v8m0 0l-3-3m3 3l3-3M3 13h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function QrCards({ baseUrl }: { baseUrl: string }) {
  const logo = useLogoDataUrl();

  if (!baseUrl) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-gold-deep/40 bg-cream px-6 py-8 text-center">
        <p className="font-display text-2xl text-charcoal">No site URL configured</p>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          Set <code className="rounded bg-marble-grey px-1.5 py-0.5 text-[0.85em]">NEXT_PUBLIC_SITE_URL</code> in
          the environment (locally in .env.local, and in the Vercel project settings), rebuild,
          and the QR codes will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-10">
      {CODES.map((code) => (
        <QrCard key={code.id} code={code} baseUrl={baseUrl} logo={logo} />
      ))}
    </div>
  );
}
