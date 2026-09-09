"use client";

import { useEffect, useState } from "react";
import { Block, IMAGE_WIDTHS, sanitizeHtml } from "@/lib/blocks";
import { usePageBlocks } from "@/lib/pages-source";
import { useLanguage } from "@/components/language-provider";
import { VisualBlocksRuntime } from "@/components/cms/visual-runtime";
import { TextsRuntime } from "@/components/cms/editable-texts";

/**
 * blocks-view.tsx — Renderitzador de blocs CMS (fase 3).
 *
 * Cada tipus de bloc → un component visual coherent amb el disseny del web
 * (paleta salvia/ink, serif per a destacats). Equivalent al render dels
 * "block types" de Gutenberg, però amb dades estructurades.
 */

export function TextBlock({ data }: { data: Record<string, unknown> }) {
  const html = sanitizeHtml(typeof data.html === "string" ? data.html : "");
  const align = data.align === "center" ? "center" : "left";
  return (
    <div
      className="sec-body cms-rich"
      style={{ textAlign: align, color: "var(--ink)" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function ImageBlock({ data }: { data: Record<string, unknown> }) {
  const url = typeof data.url === "string" ? data.url : "";
  const alt = typeof data.alt === "string" ? data.alt : "";
  const caption = typeof data.caption === "string" ? data.caption : "";
  const widthPct = typeof data.widthPct === "number" && data.widthPct >= 10 && data.widthPct <= 100 ? data.widthPct : 100;
  const align = data.align === "left" || data.align === "right" ? data.align : "center";
  const focalX = typeof data.focalX === "number" ? data.focalX : 50;
  const focalY = typeof data.focalY === "number" ? data.focalY : 50;
  if (!url) return null;
  const margin = align === "left" ? { marginRight: "auto" } : align === "right" ? { marginLeft: "auto" } : { marginLeft: "auto", marginRight: "auto" };
  return (
    <figure className="cms-image" style={{ maxWidth: `${widthPct}%`, ...margin }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- imatges del CMS (URL arbitrària, no optimitzables per next/image sense domini) */}
      <img
        src={url}
        alt={alt}
        loading="lazy"
        style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", objectPosition: `${focalX}% ${focalY}%`, borderRadius: "var(--radius, 10px)", border: "1px solid var(--rule, #e5e3dd)" }}
      />
      {caption ? (
        <figcaption className="mt-2 text-sm" style={{ color: "var(--ink-muted, #6b7280)" }}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}

export function CtaBlock({ data, onOpenPreus }: { data: Record<string, unknown>; onOpenPreus?: () => void }) {
  const label = typeof data.label === "string" ? data.label : "";
  const href = typeof data.href === "string" ? data.href : "#";
  const style = data.style === "outline" ? "outline" : "solid";
  const note = typeof data.note === "string" ? data.note : "";
  const isInternal = href.startsWith("/");
  const solid = {
    background: "var(--salvia, #7a9471)",
    color: "#fff",
    border: "1px solid var(--ink-deep, #26312b)",
  };
  const outline = {
    background: "transparent",
    color: "var(--ink-deep, #26312b)",
    border: "1px solid var(--ink-deep, #26312b)",
  };
  const cls = "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition hover:opacity-90";
  return (
    <div style={{ textAlign: "center" }}>
      {isInternal ? (
        <a href={href} className={cls} style={style === "solid" ? solid : outline}>{label}</a>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style === "solid" ? solid : outline}>{label}</a>
      )}
      {note ? <p className="mt-3 text-sm" style={{ color: "var(--ink-muted, #6b7280)" }}>{note}</p> : null}
    </div>
  );
}

export function BlocksView({ blocks }: { blocks: Block[] }) {
  if (!blocks.length) return null;
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-6">
      {blocks.map((b) =>
        b.type === "text" ? <TextBlock key={b.id} data={b.data} /> :
        b.type === "image" ? <ImageBlock key={b.id} data={b.data} /> :
        <CtaBlock key={b.id} data={b.data} />
      )}
    </div>
  );
}

/**
 * FreeBlocks — slot "contingut lliure" d'una pàgina estàtica.
 * Renderitza els blocs guardats a la BD (CA/ES) o res si no n'hi ha.
 * Col·locar al final del <main> de la pàgina: no toca el disseny existent.
 */
export function FreeBlocks({ slug }: { slug: string }) {
  const { lang } = useLanguage();
  const { ca, es, loading } = usePageBlocks(slug);
  // Mode editor: /admin/visual carrega aquesta pàgina en un iframe amb ?edit=1.
  // Es detecta en un efecte (mai durant el render) per evitar hydration mismatch
  // amb el HTML prerenderitzat del servidor (React 19 rebentaria tota la pàgina).
  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    if (window.location.search.includes("edit=1")) setEditMode(true);
  }, []);
  if (editMode) {
    return (
      <section className="px-2 py-20" style={{ background: "var(--bg)" }}>
        <VisualBlocksRuntime />
        {/* Edició in-place dels texts estàtics de la pàgina (Statement/Hero/seccions) */}
        <TextsRuntime />
      </section>
    );
  }
  if (loading) return null;
  const list = (lang === "es" ? es : ca) ?? ca ?? [];
  if (!list.length) return null;
  return (
    <section className="border-t border-rule px-2 py-20 lg:py-24" style={{ background: "var(--bg)" }}>
      <BlocksView blocks={list} />
    </section>
  );
}
