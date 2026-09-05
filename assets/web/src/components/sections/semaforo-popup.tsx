"use client";

import { useEffect } from "react";
import { useLanguage } from "@/components/language-provider";

/**
 * POPUP METODOLOGIA SEMÀFOR (genèric, aprovat per Paolo)
 *
 * Mostra la metodologia del semàfor Criteri ESG amb:
 *  - Eyebrow + títol amb èmfasi
 *  - Introducció
 *  - 5 dimensions (Scope 3 / Plazos / Fuentes / Granularidad / Verificación)
 *    amb nom + pregunta + EXPLICACIÓ GENÈRICA
 *  - Taula de 4 grades (A/B/C/D) en banda dark
 *  - Footer amb èmfasi
 *
 * Es tanca amb:
 *  - Botó X (cantonada superior dreta)
 *  - Click a l'overlay (fora del contingut)
 *  - Tecla ESC
 */
interface SemaforoPopupProps {
  open: boolean;
  onClose: () => void;
}

export function SemaforoPopup({ open, onClose }: SemaforoPopupProps) {
  const { t } = useLanguage();

  // Tancament amb tecla ESC
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    // Bloqueja scroll del body quan el popup és obert
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const dims = [
    {
      num: "1",
      name: t("v2.popup.dim.1.name"),
      question: t("v2.popup.dim.1.question"),
      explanation: t("v2.popup.dim.1.exp"),
    },
    {
      num: "2",
      name: t("v2.popup.dim.2.name"),
      question: t("v2.popup.dim.2.question"),
      explanation: t("v2.popup.dim.2.exp"),
    },
    {
      num: "3",
      name: t("v2.popup.dim.3.name"),
      question: t("v2.popup.dim.3.question"),
      explanation: t("v2.popup.dim.3.exp"),
    },
    {
      num: "4",
      name: t("v2.popup.dim.4.name"),
      question: t("v2.popup.dim.4.question"),
      explanation: t("v2.popup.dim.4.exp"),
    },
    {
      num: "5",
      name: t("v2.popup.dim.5.name"),
      question: t("v2.popup.dim.5.question"),
      explanation: t("v2.popup.dim.5.exp"),
    },
  ] as const;

  const grades = [
    {
      letter: "A",
      letterClass: "a",
      label: t("v2.popup.grade.a.label"),
      desc: t("v2.popup.grade.a.desc"),
    },
    {
      letter: "B",
      letterClass: "b",
      label: t("v2.popup.grade.b.label"),
      desc: t("v2.popup.grade.b.desc"),
    },
    {
      letter: "C",
      letterClass: "c",
      label: t("v2.popup.grade.c.label"),
      desc: t("v2.popup.grade.c.desc"),
    },
    {
      letter: "D",
      letterClass: "d",
      label: t("v2.popup.grade.d.label"),
      desc: t("v2.popup.grade.d.desc"),
    },
  ] as const;

  const gradeColor = (g: string) => {
    // A = verd, B/C = taronja, D = vermell
    if (g === "a") return "#5C8A5C";
    if (g === "b" || g === "c") return "#C9A961";
    return "#A0522D";
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10"
      style={{ background: "rgba(44, 24, 16, 0.85)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t("v2.popup.eyebrow")}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-[720px] overflow-y-auto"
        style={{
          background: "#F2F5F1",
          color: "#26312B",
          borderTop: "4px solid #5E8772",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-3 cursor-pointer border-0 bg-transparent text-[32px] leading-none transition-colors"
          style={{ color: "#4A5F53" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#5E8772")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#4A5F53")}
        >
          ×
        </button>

        <div className="p-8 sm:p-12">
          {/* Eyebrow */}
          <div
            className="mb-3 font-mono text-[10px] font-semibold uppercase"
            style={{ color: "#3F6653", letterSpacing: "0.22em" }}
          >
            {t("v2.popup.eyebrow")}
          </div>

          {/* Title */}
          <h2
            className="mb-4 font-serif font-medium"
            style={{
              color: "#26312B",
              fontSize: "clamp(1.75rem, 3vw, 2rem)",
              letterSpacing: "-0.018em",
              lineHeight: 1.1,
            }}
          >
            {t("v2.popup.title.pre")}{" "}
            <em className="italic font-normal" style={{ color: "#141B18" }}>
              {t("v2.popup.title.em")}
            </em>
          </h2>

          {/* Intro */}
          <p
            className="mb-7 border-b pb-6 font-serif italic"
            style={{
              color: "#141B18",
              fontSize: "1rem",
              lineHeight: 1.55,
              borderColor: "#D8E2DA",
            }}
          >
            {t("v2.popup.intro")}
          </p>

          {/* 5 Dimensions */}
          <div className="mb-7 flex flex-col gap-4">
            {dims.map((dim) => (
              <div
                key={dim.num}
                className="border-b pb-4 last:border-b-0 last:pb-0"
                style={{ borderColor: "rgba(201, 184, 154, 0.5)" }}
              >
                <div
                  className="mb-2 flex items-baseline justify-between gap-4"
                >
                  <span
                    className="font-serif font-medium"
                    style={{
                      color: "#26312B",
                      fontSize: "1.125rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {dim.name}
                  </span>
                  <span
                    className="text-right font-mono text-[10px] font-semibold uppercase"
                    style={{
                      color: "#3F6653",
                      letterSpacing: "0.14em",
                    }}
                  >
                    {dim.question}
                  </span>
                </div>
                <p
                  className="font-sans"
                  style={{
                    color: "#141B18",
                    fontSize: "0.8125rem",
                    lineHeight: 1.5,
                  }}
                >
                  {dim.explanation}
                </p>
              </div>
            ))}
          </div>

          {/* 4 Grades (dark band) */}
          <div
            className="mb-6 grid grid-cols-2 gap-3 p-5 sm:grid-cols-4"
            style={{ background: "#26312B", color: "#F2F5F1" }}
          >
            {grades.map((g) => (
              <div
                key={g.letter}
                className="flex flex-col items-center gap-1 text-center"
              >
                <span
                  className="font-serif font-medium"
                  style={{
                    color: gradeColor(g.letterClass),
                    fontSize: "2.25rem",
                    letterSpacing: "-0.025em",
                    lineHeight: 1,
                  }}
                >
                  {g.letter}
                </span>
                <span
                  className="font-mono text-[9.5px] font-semibold uppercase"
                  style={{
                    color: "#F2F5F1",
                    letterSpacing: "0.16em",
                  }}
                >
                  {g.label}
                </span>
                <span
                  className="font-sans"
                  style={{
                    color: "rgba(245, 239, 230, 0.6)",
                    fontSize: "10px",
                    lineHeight: 1.3,
                  }}
                >
                  {g.desc}
                </span>
              </div>
            ))}
          </div>

          {/* Footer — frase contínua, sense trencament entre pre/em */}
          <p
            className="border-t pt-5 font-serif italic"
            style={{
              color: "#141B18",
              fontSize: "0.875rem",
              lineHeight: 1.55,
              borderColor: "#D8E2DA",
              // Evita que una sola paraula quedi aïllada a la línia següent
              hyphens: "auto",
              textWrap: "pretty" as React.CSSProperties["textWrap"],
            }}
          >
            <span style={{ marginRight: "0.25em" }}>{t("v2.popup.footer.pre").trim()}</span>
            <em
              className="not-italic font-medium"
              style={{ color: "#5E8772", whiteSpace: "nowrap" }}
            >
              {t("v2.popup.footer.em")}.
            </em>
          </p>
        </div>
      </div>
    </div>
  );
}
