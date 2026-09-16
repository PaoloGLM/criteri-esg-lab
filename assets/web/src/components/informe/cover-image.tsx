"use client";

import { useState } from "react";

type Props = { slug: string; title: string; className?: string };

/**
 * Portada d'informe: imatge real de la pàgina 1 del PDF (/covers/<slug>.jpg)
 * quan existeix; si el fitxer no hi és o no carrega, fallback automàtic a
 * portada generada estil Criteri (regla acordada amb Paolo).
 */
export function CoverImage({ slug, title, className = "" }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`aspect-[3/4] w-full overflow-hidden border ${className}`}
        style={{ borderColor: "rgba(38,49,43,0.15)", background: "#E7E2D3", padding: 12, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
      >
        <p className="font-mono text-[7px] uppercase tracking-[0.14em]" style={{ color: "rgba(36,56,45,0.7)" }}>Criteri ESG · Biblioteca</p>
        <p className="font-serif text-[13px] font-semibold leading-[1.25]" style={{ color: "#24382D" }}>{title}</p>
        <div>
          <div style={{ height: 3, width: 28, background: "#C88A4F", marginBottom: 8 }} />
          <p className="font-mono text-[7px] uppercase tracking-[0.1em]" style={{ color: "rgba(36,56,45,0.7)" }}>Informe processat · 2026</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`aspect-[3/4] w-full overflow-hidden border ${className}`}
      style={{ borderColor: "rgba(0,0,0,0.12)", boxShadow: "2px 3px 10px rgba(38,49,43,0.12)" }}
    >
      <img
        src={`/covers/${encodeURIComponent(slug)}.jpg`}
        alt={`Portada: ${title}`}
        className="h-full w-full object-cover object-top"
        onError={() => setFailed(true)}
        loading="lazy"
      />
    </div>
  );
}
