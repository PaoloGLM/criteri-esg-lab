"use client";

import { useLanguage } from "@/components/language-provider";
import type { TranslationKey } from "@/lib/i18n";

interface MidSectionsProps {
  onOpenRegister?: () => void;
  onOpenReport?: () => void;
}

/**
 * MID SECTIONS — Variant 2 (Manifest Editorial)
 *
 * Dues seccions en cream (#F2F5F1), text #26312B:
 *
 * 1. MANIFEST — Eyebrow + títol gran amb èmfasi en cursiva + paràgraf cos
 * 2. 3 TESES — Secció amb 3 columnes (Sintetitzar / Creuar / Recomanar)
 *    cada una amb número gran (01/02/03 en Fraunces coure), verb, descripció
 *
 * Regles de disseny:
 * - Cada secció té border-top 3px solid #26312B
 * - Eyebrow en JetBrains Mono uppercase 0.22em letter-spacing color #3F6653
 *   amb barres coure a banda i banda (estil "— EYEBROW —")
 * - Títol Fraunces 38-56px amb èmfasi en cursiva
 * - Cap icona a les tesis — només números grossos
 */
export function MidSections({ onOpenRegister, onOpenReport }: MidSectionsProps = {}) {
  const { t } = useLanguage();
  void onOpenRegister;
  void onOpenReport;

  const theses: {
    num: string;
    verbKey: TranslationKey;
    descKey: TranslationKey;
  }[] = [
    { num: "01", verbKey: "v2.theses.1.verb", descKey: "v2.theses.1.desc" },
    { num: "02", verbKey: "v2.theses.2.verb", descKey: "v2.theses.2.desc" },
    { num: "03", verbKey: "v2.theses.3.verb", descKey: "v2.theses.3.desc" },
  ];

  return (
    <>
      {/* ===== MANIFEST (cream) ===== */}
      <section
        className="flex flex-col items-center gap-10 px-6 py-24 text-center sm:px-8 sm:py-28 lg:py-32"
        style={{
          background: "#F2F5F1",
          color: "#26312B",
          borderTop: "3px solid #26312B",
        }}
      >
        {/* Eyebrow amb barres */}
        <div
          className="flex items-center gap-3 font-mono text-[11px] font-semibold uppercase"
          style={{ color: "#3F6653", letterSpacing: "0.22em" }}
        >
          <span style={{ width: "24px", height: "2px", background: "#5E8772" }} />
          {t("v2.manifest.eyebrow")}
          <span style={{ width: "24px", height: "2px", background: "#5E8772" }} />
        </div>

        {/* Title amb èmfasi */}
        <h2
          className="font-serif font-normal"
          style={{
            color: "#26312B",
            letterSpacing: "-0.02em",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            lineHeight: 1.15,
            maxWidth: "1000px",
          }}
        >
          {t("v2.manifest.title.pre")}
          <em
            className="italic font-medium"
            style={{ color: "#141B18" }}
          >
            {t("v2.manifest.title.em")}
          </em>
          {t("v2.manifest.title.post")}
        </h2>

        {/* Body */}
        <p
          className="font-serif italic font-normal"
          style={{
            color: "#141B18",
            fontSize: "clamp(1.0625rem, 1.4vw, 1.1875rem)",
            lineHeight: 1.6,
            maxWidth: "720px",
          }}
        >
          {t("v2.manifest.body")}
        </p>
      </section>

      {/* ===== 3 TESES (cream) ===== */}
      <section
        className="px-6 py-24 sm:px-8 sm:py-28"
        style={{
          background: "#F2F5F1",
          color: "#26312B",
          borderTop: "3px solid #26312B",
        }}
      >
        <div className="mx-auto max-w-6xl">
          {/* Eyebrow */}
          <div
            className="mb-4 flex items-center gap-3 font-mono text-[11px] font-semibold uppercase"
            style={{ color: "#3F6653", letterSpacing: "0.22em" }}
          >
            <span style={{ width: "24px", height: "2px", background: "#5E8772" }} />
            {t("v2.theses.eyebrow")}
          </div>

          {/* Title */}
          <h2
            className="mb-14 font-serif font-medium"
            style={{
              color: "#26312B",
              letterSpacing: "-0.018em",
              fontSize: "clamp(2rem, 3vw, 2.5rem)",
              lineHeight: 1.1,
              maxWidth: "800px",
            }}
          >
            {t("v2.theses.title.pre")}
            <em className="italic font-normal" style={{ color: "#141B18" }}>
              {t("v2.theses.title.em")}
            </em>
          </h2>

          {/* Grid 3 columnes amb separadors verticals */}
          <div className="grid gap-8 md:grid-cols-3 md:gap-0">
            {theses.map((thesis, i) => (
              <div
                key={thesis.num}
                className="flex flex-col gap-5 md:px-10"
                style={{
                  borderRight:
                    i < theses.length - 1
                      ? "1px solid rgba(44, 24, 16, 0.15)"
                      : "none",
                }}
              >
                <div
                  className="font-serif font-light"
                  style={{
                    color: "#5E8772",
                    letterSpacing: "-0.04em",
                    fontSize: "clamp(4rem, 7vw, 6rem)",
                    lineHeight: 0.9,
                  }}
                >
                  {thesis.num}
                </div>
                <div
                  className="font-serif font-medium"
                  style={{
                    color: "#26312B",
                    letterSpacing: "-0.015em",
                    fontSize: "clamp(1.5rem, 2.4vw, 2rem)",
                  }}
                >
                  {t(thesis.verbKey)}
                </div>
                <p
                  className="font-sans"
                  style={{
                    color: "#141B18",
                    fontSize: "0.875rem",
                    lineHeight: 1.55,
                  }}
                >
                  {t(thesis.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
