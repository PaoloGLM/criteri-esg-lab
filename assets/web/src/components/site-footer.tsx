"use client";

import { useLanguage } from "@/components/language-provider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="mb-2 font-serif text-2xl font-semibold">
              Criteri<span className="text-accent-soft">.</span>
              <span className="ml-1 font-mono text-[10px] uppercase tracking-widest text-primary-foreground/60">
                ESG
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/70">
              {t("footer.tagline")}
            </p>
            <div className="mt-4 font-mono text-xs text-primary-foreground/60">
              criteriesg.com · Barcelona
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="grid gap-8 sm:grid-cols-3">
              {/* Producte — Què fem + Biblioteca */}
              <div>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent-soft">
                  {t("footer.product")}
                </p>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/informes" className="text-primary-foreground/80 hover:text-accent-soft">
                      {t("nav.informes")}
                    </a>
                  </li>
                  <li>
                    <a href="/que-fem" className="text-primary-foreground/80 hover:text-accent-soft">
                      {t("nav.quefem")}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Empresa — Qui som + FAQ */}
              <div>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent-soft">
                  {t("footer.company")}
                </p>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/qui-som" className="text-primary-foreground/80 hover:text-accent-soft">
                      {t("nav.quisom")}
                    </a>
                  </li>
                  <li>
                    <a href="/#faq" className="text-primary-foreground/80 hover:text-accent-soft">
                      {t("footer.faq")}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent-soft">
                  {t("footer.legal")}
                </p>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-primary-foreground/80 hover:text-accent-soft">
                      {t("footer.privacy")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary-foreground/80 hover:text-accent-soft">
                      {t("footer.terms")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary-foreground/80 hover:text-accent-soft">
                      {t("footer.cookies")}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/15 pt-6">
          <p className="text-xs text-primary-foreground/60">{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
