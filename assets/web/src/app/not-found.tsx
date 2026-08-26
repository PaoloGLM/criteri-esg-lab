"use client";

import { Header } from "@/components/site-header-v1";
import { FooterV1 } from "@/components/site-footer-v1";
import { useLanguage } from "@/components/language-provider";
import Link from "next/link";

export default function NotFound() {
  const { lang } = useLanguage();
  const ca = lang === "ca";

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--paper)" }}>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-7 py-32 text-center" style={{ background: "var(--ink-deep)" }}>
        <p className="font-mono text-[.7rem] uppercase tracking-[.24em]" style={{ color: "var(--verd-clar)" }}>
          404
        </p>
        <h1 className="mt-6 font-serif font-medium italic leading-[1.15] text-[clamp(2.4rem,5.5vw,4.6rem)] tracking-[-.015em] [text-wrap:balance]" style={{ color: "var(--verd-clar)" }}>
          {ca ? (
            <>
              Aquesta pàgina no existeix.
              <br />
              <span style={{ color: "var(--highlight)" }}>El criteri, sí.</span>
            </>
          ) : (
            <>
              Esta página no existe.
              <br />
              <span style={{ color: "var(--highlight)" }}>El criterio, sí.</span>
            </>
          )}
        </h1>
        <p className="mt-8 max-w-[46ch] text-[1.02rem] leading-[1.7]" style={{ color: "rgba(242,245,241,.65)" }}>
          {ca
            ? "Potser l'adreça ha canviat o mai no ha existit. Des d'aquí pots tornar a la pàgina principal o llegir l'últim informe."
            : "Puede que la dirección haya cambiado o que nunca haya existido. Desde aquí puedes volver a la página principal o leer el último informe."}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3.5">
          <Link href="/" className="btn-v1 btn-v1-solid">
            {ca ? "Torna a l'inici" : "Vuelve al inicio"}
          </Link>
          <Link href="/informes" className="btn-v1 btn-v1-ghost">
            {ca ? "Veure els informes" : "Ver los informes"}
          </Link>
        </div>
      </main>
      <FooterV1 />
    </div>
  );
}
