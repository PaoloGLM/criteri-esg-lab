"use client";

import { useLanguage } from "@/components/language-provider";

interface FinalCtaProps {
  onOpenRegister: () => void;
  onOpenPreus?: () => void;
}

/**
 * FINAL — Variant 2 (Manifest Editorial)
 *
 * Dues seccions:
 * 1. CITA ÈTICA (cream) — eyebrow + cita gran en cursiva + atribució
 * 2. CTA FINAL (dark) — eyebrow + títol amb èmfasi + botó + nota
 *
 * El botó del CTA Final crida onOpenRegister (com abans).
 *
 * NOTA: la variant anterior tenia lgica condicional per a usuaris
 * premium/free. En la variant 2, aquesta secció és més editorial
 * (no pas un panell de gestió de newsletter). Mantenim el CTA simple
 * per a tothom: si és premium, el botó "Acceso abierto en septiembre"
 * és informatiu; si és free, obre preus; si és anònim, obre registre.
 */
export function FinalCta({ onOpenRegister, onOpenPreus }: FinalCtaProps) {
  const { t } = useLanguage();
  void onOpenPreus;

  const handleClick = () => {
    onOpenRegister();
  };

  return (
    <>
      {/* ===== CITA ÈTICA (cream) ===== */}
      <section
        className="flex flex-col items-center gap-8 px-6 py-28 text-center sm:px-8 sm:py-32 lg:py-36"
        style={{
          background: "#F2F5F1",
          color: "#26312B",
          borderTop: "3px solid #26312B",
        }}
      >
        {/* Eyebrow amb barres a banda i banda */}
        <div
          className="flex items-center gap-3 font-mono text-[11px] font-semibold uppercase"
          style={{ color: "#3F6653", letterSpacing: "0.22em" }}
        >
          <span style={{ width: "24px", height: "2px", background: "#5E8772" }} />
          {t("v2.cita.eyebrow")}
          <span style={{ width: "24px", height: "2px", background: "#5E8772" }} />
        </div>

        {/* Cita gran amb èmfasi en cursiva */}
        <p
          className="font-serif font-normal"
          style={{
            color: "#26312B",
            letterSpacing: "-0.018em",
            fontSize: "clamp(2rem, 3.6vw, 3rem)",
            lineHeight: 1.2,
            maxWidth: "1000px",
          }}
        >
          {t("v2.cita.text.pre")}
          <em className="italic font-medium" style={{ color: "#141B18" }}>
            {t("v2.cita.text.em")}
          </em>
          {t("v2.cita.text.post")}
        </p>

        {/* Atribució */}
        <p
          className="font-serif italic"
          style={{
            color: "#4A5F53",
            fontSize: "1rem",
            marginTop: "0.5rem",
          }}
        >
          {t("v2.cita.attribution")}
        </p>
      </section>

      {/* ===== CTA FINAL (dark) ===== */}
      <section
        className="flex flex-col items-center gap-8 px-6 py-28 text-center sm:px-8 sm:py-32 lg:py-36"
        style={{ background: "#26312B", color: "#F2F5F1" }}
      >
        {/* Eyebrow */}
        <div
          className="font-mono text-[11px] font-semibold uppercase"
          style={{ color: "#AAC9B6", letterSpacing: "0.3em" }}
        >
          {t("v2.ctafinal.eyebrow")}
        </div>

        {/* Títol amb èmfasi */}
        <h2
          className="font-serif font-normal"
          style={{
            color: "#F2F5F1",
            letterSpacing: "-0.025em",
            fontSize: "clamp(2.25rem, 4.6vw, 4rem)",
            lineHeight: 1.1,
            maxWidth: "1000px",
          }}
        >
          {t("v2.ctafinal.title.pre")}
          <em className="italic font-medium" style={{ color: "#AAC9B6" }}>
            {t("v2.ctafinal.title.em")}
          </em>
          {t("v2.ctafinal.title.post")}
        </h2>

        {/* Botó */}
        <button
          onClick={handleClick}
          className="mt-4 inline-flex items-center justify-center px-11 py-5 font-sans font-semibold transition-opacity hover:opacity-90"
          style={{
            background: "#5E8772",
            color: "#FFFFFF",
            fontSize: "0.9375rem",
            letterSpacing: "0.02em",
          }}
        >
          {t("v2.ctafinal.button")}
        </button>

        {/* Nota */}
        <p
          className="font-serif italic"
          style={{
            color: "rgba(245, 239, 230, 0.5)",
            fontSize: "0.9375rem",
            marginTop: "0.5rem",
          }}
        >
          {t("v2.ctafinal.note")}
        </p>
      </section>
    </>
  );
}
