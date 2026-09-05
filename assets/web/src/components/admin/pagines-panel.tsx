"use client";

import { useEffect, useState } from "react";
import { SectionEditor } from "./section-editor";
import { adminApi } from "@/lib/admin-api";

/**
 * Pestanya "Pàgines" del panell /admin (Fase 3 CMS).
 * Edició de seccions de pàgines estàtiques amb WYSIWYG.
 * - Secció buida = la web mostra el contingut estàtic de sempre (fallback).
 * - Secció amb contingut = substitueix el text d'aquella secció a la web.
 * - Dues llengües (CA/ES) amb pestanyes.
 */

type PageSlug = "qui-som" | "que-fem";
type Lang = "ca" | "es";

/** Seccions editables per pàgina (ha de coincidir amb el que llegeix cada pàgina) */
const PAGE_SECTIONS: Record<PageSlug, { id: string; label: string }[]> = {
  "qui-som": [
    { id: "hero", label: "Hero (títol + subtítol)" },
    { id: "manifest", label: "Manifest" },
    { id: "com-treballem", label: "Com treballem (IA)" },
    { id: "valors", label: "Criteris ètics (No som neutres)" },
    { id: "equip", label: "Equip" },
    { id: "preguntes", label: "Preguntes Premium" },
    { id: "compromis", label: "Compromís" },
    { id: "join", label: "Vols formar-ne part?" },
  ],
  "que-fem": [
    { id: "hero", label: "Hero" },
    { id: "serveis", label: "Serveis" },
    { id: "metodologia", label: "Metodologia" },
    { id: "cta", label: "Crida a l'acció" },
  ],
};

const PAGE_LABELS: Record<PageSlug, string> = {
  "qui-som": "Qui som (/qui-som)",
  "que-fem": "Què fem (/que-fem)",
};

interface PagesResponse {
  page: {
    slug: string;
    status: string | null;
    content_ca: { sections?: Record<string, string> } | null;
    content_es: { sections?: Record<string, string> } | null;
    updated_at: string | null;
  };
}

export function PaginesPanel({
  ok,
  showErr,
}: {
  ok: (msg: string) => void;
  showErr: (e: unknown) => void;
}) {
  const [page, setPage] = useState<PageSlug>("qui-som");
  const [lang, setLang] = useState<Lang>("ca");
  const [sections, setSections] = useState<Record<Lang, Record<string, string>>>({
    ca: {},
    es: {},
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // Carrega el contingut actual de la pàgina
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setDirty(false);
    (async () => {
      try {
        const res = await adminApi.pages.get(page);
        if (!alive) return;
        setSections({
          ca: { ...(res.page.content_ca?.sections ?? {}) },
          es: { ...(res.page.content_es?.sections ?? {}) },
        });
      } catch (e) {
        if (alive) showErr(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const setSection = (id: string, html: string) => {
    setSections((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [id]: html },
    }));
    setDirty(true);
  };

  const clearSection = (id: string) => {
    setSections((prev) => {
      const next = { ...prev[lang] };
      delete next[id];
      return { ...prev, [lang]: next };
    });
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await adminApi.pages.put(page, {
        content_ca: { sections: sections.ca },
        content_es: { sections: sections.es },
        status: "published",
      });
      setDirty(false);
      ok("Pàgina guardada — els canvis ja són visibles a la web");
    } catch (e) {
      showErr(e);
    } finally {
      setSaving(false);
    }
  };

  const editedCount =
    Object.keys(sections.ca).length + Object.keys(sections.es).length;

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-xl font-semibold text-primary">Edició de pàgines</h2>
        <div className="flex items-center gap-2">
          {(Object.keys(PAGE_LABELS) as PageSlug[]).map((s) => (
            <button
              key={s}
              onClick={() => setPage(s)}
              className="rounded px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] font-semibold"
              style={{
                background: page === s ? "#5E8772" : "transparent",
                color: page === s ? "#fff" : "#4A5F53",
                border: "1px solid #5E8772",
              }}
            >
              {PAGE_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "#8AA093" }}>
        {editedCount > 0
          ? `${editedCount} secció(ns) editada(s) · guardades a la BD`
          : "Cap secció editada — la web mostra el contingut estàtic"}
        {loading && " · carregant…"}
      </p>

      {/* Idioma */}
      <div className="mb-4 flex gap-2">
        {(["ca", "es"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className="rounded px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] font-semibold"
            style={{
              background: lang === l ? "#26312B" : "transparent",
              color: lang === l ? "#F2F5F1" : "#4A5F53",
              border: "1px solid #26312B",
            }}
          >
            {l === "ca" ? "Català" : "Castellà"}
          </button>
        ))}
      </div>

      {/* Seccions */}
      <div className="space-y-3">
        {PAGE_SECTIONS[page].map((s) => {
          const current = sections[lang][s.id] ?? "";
          const isOpen = openSections[s.id] ?? false;
          const hasContent = current.trim().length > 0;
          return (
            <div key={s.id} className="rounded-md border" style={{ borderColor: "#D8E2DA" }}>
              <div
                className="flex cursor-pointer items-center justify-between px-4 py-3"
                onClick={() => setOpenSections((p) => ({ ...p, [s.id]: !isOpen }))}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#5E8772" }}>
                    {s.id}
                  </span>
                  <span className="font-serif text-[15px] font-medium text-primary">{s.label}</span>
                  {hasContent && (
                    <span className="rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider" style={{ background: "#5E8772", color: "#fff" }}>
                      editada
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs" style={{ color: "#8AA093" }}>
                  {isOpen ? "▲" : "▼"}
                </span>
              </div>

              {isOpen && (
                <div className="border-t px-4 pb-4 pt-3" style={{ borderColor: "#D8E2DA" }}>
                  {!hasContent && (
                    <p className="mb-2 text-[12px] italic" style={{ color: "#8AA093" }}>
                      Buit → la web mostra el text actual. Escriu aquí per substituir-lo.
                    </p>
                  )}
                  <SectionEditor
                    value={current}
                    onChange={(html) => setSection(s.id, html)}
                    placeholder={`Contingut de "${s.label}"…`}
                  />
                  {hasContent && (
                    <button
                      onClick={() => clearSection(s.id)}
                      className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em]"
                      style={{ color: "#A0522D" }}
                    >
                      ← Tornar al contingut estàtic
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={() => void save()}
          disabled={saving || loading || !dirty}
          className="rounded px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] font-semibold disabled:opacity-40"
          style={{ background: "#5E8772", color: "#fff" }}
        >
          {saving ? "Guardant…" : "Guardar canvis"}
        </button>
        {dirty && (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "#A0522D" }}>
            Canvis sense guardar
          </span>
        )}
      </div>
    </section>
  );
}
