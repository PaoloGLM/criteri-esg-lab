"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/site-header-v1";
import { FooterV1 } from "@/components/site-footer-v1";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/lib/auth-context";



export default function PagamentPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);
  const tr = (ca: string, es: string) => (lang === "ca" ? ca : es);

  // Formulari targeta (simulat fins a integrar Stripe)
  const [ccNum, setCcNum] = useState("");
  const [ccExp, setCcExp] = useState("");
  const [ccCvc, setCvc] = useState("");
  const [paying, setPaying] = useState(false);
  const [payOk, setPayOk] = useState(false);

  // Transferència Fiare — validació real via /api/validate-fiare
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const openAuth = (tab: "register" | "login" = "register") => { setAuthTab(tab); setAuthOpen(true); };

  const formatCardNumber = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const handlePay = () => {
    setPaying(true);
    setPayOk(false);
    setTimeout(() => {
      setPaying(false);
      setPayOk(true);
    }, 1100);
  };

  const copyValue = (key: string, value: string) => {
    if (value && navigator.clipboard) navigator.clipboard.writeText(value).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1200);
  };

  const validateFiare = async (fileData: { base64: string; name: string; type: string }) => {
    if (!user) {
      setResult({ success: false, message: tr("Error validant. Escriu-nos a info@criteriesg.com.", "Error validando. Escríbenos a info@criteriesg.com.") });
      return;
    }
    setValidating(true);
    setResult(null);
    try {
      const res = await fetch("/api/validate-fiare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileBase64: fileData.base64,
          fileName: fileData.name,
          fileType: fileData.type,
          userEmail: user.email,
          userId: user.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({ success: true, message: tr("Justificant validat. Accés Premium activat!", "¡Justificante validado! ¡Acceso Premium activado!") });
      } else {
        setResult({ success: false, message: data.message || tr("No s'ha pogut validar el justificant.", "No se ha podido validar el justificante.") });
      }
    } catch {
      setResult({ success: false, message: tr("Error validant. Escriu-nos a info@criteriesg.com.", "Error validando. Escríbenos a info@criteriesg.com.") });
    }
    setValidating(false);
  };

  const handleFile = (file: File) => {
    setUploadedFile(file.name);
    setResult(null);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      void validateFiare({ base64, name: file.name, type: file.type });
    };
    reader.readAsDataURL(file);
  };

  const inputCls =
    "w-full rounded-md border bg-[#F2F5F1] px-3.5 py-3 font-mono text-sm outline-none focus:border-[#5E8772]";
  const inputStyle = { borderColor: "var(--rule)", color: "var(--ink)" };
  const labelCls = "mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.16em]";
  const bankRows: { k: string; v: string; copy: string }[] = [
    { k: tr("Titular", "Titular"), v: "Criteri ESG S.L.", copy: "Criteri ESG S.L." },
    { k: "IBAN", v: "ES•• •••• •••• •••• •••• ••••", copy: "" },
    {
      k: tr("Concepte", "Concepto"),
      v: `${tr("Premium anual", "Premium anual")} + ${user?.email || tr("<el teu email>", "<tu email>")}`,
      copy: `Premium anual + ${user?.email ?? ""}`,
    },
    { k: tr("Import", "Importe"), v: "290 €", copy: "290 €" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={(tab) => openAuth(tab || "register")} />
      <main className="flex-1">

        {/* ══════════ PAGE HERO ══════════ */}
        <section className="border-b border-rule" style={{ background: "var(--background)" }}>
          <div className="mx-auto max-w-7xl px-6 pb-14 pt-20 lg:px-8">
            <p className="eyebrow">{tr("Pla Premium · Early bird", "Plan Premium · Early bird")}</p>
            <h1 className="font-serif text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl" style={{ color: "var(--ink-deep)" }}>
              {tr("Pagament", "Pago")}
            </h1>
            <p className="sec-body mt-6 max-w-2xl text-lg">
              {tr("Activa el teu accés Premium. Tria ", "Activa tu acceso Premium. Elige ")}
              <strong>{tr("targeta", "tarjeta")}</strong>
              {tr(" per activació immediata o ", " para activación inmediata o ")}
              <strong>{tr("transferència a Fiare Banca Ètica", "transferencia a Fiare Banca Ética")}</strong>
              {tr(", amb el 100% dels teus diners a l'economia social.", ", con el 100% de tu dinero en la economía social.")}
            </p>
          </div>
        </section>

        {/* ══════════ CONTINGUT: mètodes + resum comanda ══════════ */}
        <section style={{ background: "var(--background)" }}>
          <div className="mx-auto grid max-w-6xl items-start gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,.88fr)] lg:gap-[52px] lg:px-8 lg:py-20">

            {/* Columna esquerra: mètodes */}
            <div>

              {/* TARGETA */}
              <article id="targeta" className="mb-6 rounded-[9px] border bg-white p-8" style={{ borderColor: "rgba(38,49,43,.12)", scrollMarginTop: "88px" }}>
                <div className="mb-2 flex flex-wrap items-center gap-4">
                  <svg viewBox="0 0 44 44" width="40" height="40" className="shrink-0" role="img" aria-label={tr("Icona de targeta bancària", "Icono de tarjeta bancaria")}>
                    <rect x="4" y="10" width="36" height="24" rx="4" fill="none" stroke="#5E8772" strokeWidth="2" />
                    <line x1="4" y1="18" x2="40" y2="18" stroke="#5E8772" strokeWidth="2" />
                    <rect x="9" y="26" width="10" height="3" rx="1.5" fill="#F5E381" />
                  </svg>
                  <h2 className="flex-1 font-serif text-3xl font-medium" style={{ color: "var(--ink-deep)" }}>{tr("Targeta", "Tarjeta")}</h2>
                  <span
                    className="rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]"
                    style={{ borderColor: "rgba(38,49,43,.25)", color: "var(--ink-soft)" }}
                  >
                    Stripe
                  </span>
                </div>
                <p className="mb-6 text-[0.93rem] leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  {tr("Paga amb targeta de crèdit/dèbit. Accés Premium actiu immediatament. Equival a 29 €/mes. IVA deduïble per a empreses.",
                      "Paga con tarjeta de crédito/débito. Acceso Premium activo inmediatamente. Equivale a 29 €/mes. IVA deducible para empresas.")}
                </p>

                <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
                  <div className="relative col-span-full">
                    <label htmlFor="cc-num" className={labelCls} style={{ color: "var(--ink-soft)" }}>
                      {tr("Número de la targeta", "Número de tarjeta")}
                    </label>
                    <input
                      id="cc-num"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={ccNum}
                      onChange={(e) => setCcNum(formatCardNumber(e.target.value))}
                      className={inputCls}
                      style={inputStyle}
                    />
                    <svg viewBox="0 0 26 18" aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 w-[26px] -translate-y-1/2 opacity-55" style={{ top: "calc(50% + 9px)" }}>
                      <rect x=".75" y=".75" width="24.5" height="16.5" rx="2.5" fill="none" stroke="#26312B" strokeWidth="1.2" />
                      <line x1=".75" y1="6.5" x2="25.25" y2="6.5" stroke="#26312B" strokeWidth="1.2" />
                      <rect x="4" y="10" width="6" height="4" rx="1" fill="#AAC9B6" />
                    </svg>
                  </div>
                  <div>
                    <label htmlFor="cc-exp" className={labelCls} style={{ color: "var(--ink-soft)" }}>
                      {tr("Caducitat", "Caducidad")}
                    </label>
                    <input
                      id="cc-exp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM/AA"
                      maxLength={5}
                      value={ccExp}
                      onChange={(e) => setCcExp(formatExpiry(e.target.value))}
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="cc-cvc" className={labelCls} style={{ color: "var(--ink-soft)" }}>CVC</label>
                    <input
                      id="cc-cvc"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="123"
                      maxLength={4}
                      value={ccCvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                  <div className="col-span-full">
                    <button type="submit" onClick={handlePay} disabled={paying} className="btn-v1 btn-v1-solid w-full text-center disabled:opacity-60">
                      {paying ? tr("Processant…", "Procesando…") : tr("Pagar 290 €", "Pagar 290 €")}
                    </button>
                    <p className="mt-3.5 flex items-center gap-2 font-mono text-[10px] tracking-[0.06em]" style={{ color: "var(--ink-soft)" }}>
                      <svg width="11" height="13" viewBox="0 0 11 13" aria-hidden="true">
                        <rect x=".5" y="5" width="10" height="7.5" rx="1.5" fill="#4A5F53" />
                        <path d="M3 5V3.5a2.5 2.5 0 0 1 5 0V5" fill="none" stroke="#4A5F53" strokeWidth="1.4" />
                      </svg>
                      {tr("SIMULACIÓ · SENSE CÀRREC REAL · INTEGRACIÓ STRIPE PENDENT",
                          "SIMULACIÓN · SIN CARGO REAL · INTEGRACIÓN STRIPE PENDIENTE")}
                    </p>
                    {payOk && (
                      <p
                        className="mt-4 rounded-md px-4 py-3 text-sm"
                        style={{ background: "rgba(170,201,182,.22)", borderLeft: "3px solid var(--accent)", color: "var(--ink)" }}
                      >
                        ✓ {tr("Pagament acceptat — Accés Premium actiu immediatament.", "Pago aceptado — Acceso Premium activo inmediatamente.")}
                      </p>
                    )}
                  </div>
                </form>
              </article>

              {/* TRANSFERÈNCIA */}
              <article id="transferencia" className="rounded-[9px] border bg-white p-8" style={{ borderColor: "rgba(38,49,43,.12)", scrollMarginTop: "88px" }}>
                <div className="mb-2 flex flex-wrap items-center gap-4">
                  <svg viewBox="0 0 44 44" width="40" height="40" className="shrink-0" role="img" aria-label={tr("Icona de transferència bancària", "Icono de transferencia bancaria")}>
                    <circle cx="15" cy="15" r="8" fill="none" stroke="#5E8772" strokeWidth="2" />
                    <path d="M23 23 L37 37 M37 37 v-9 M37 37 h-9" stroke="#5E8772" strokeWidth="2" fill="none" />
                    <rect x="8" y="30" width="12" height="3" rx="1.5" fill="#F5E381" />
                  </svg>
                  <h2 className="flex-1 font-serif text-3xl font-medium" style={{ color: "var(--ink-deep)" }}>{tr("Transferència", "Transferencia")}</h2>
                  <span
                    className="rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]"
                    style={{ borderColor: "rgba(38,49,43,.25)", color: "var(--ink-soft)" }}
                  >
                    {tr("Fiare Banca Ètica", "Fiare Banca Ética")}
                  </span>
                </div>

                <div className="mb-6 rounded-r-lg px-5 py-4 text-[0.93rem] leading-relaxed" style={{ background: "var(--background)", borderLeft: "3px solid var(--highlight)", color: "var(--ink)" }}>
                  {tr("Paga per transferència bancària a Fiare. Accés Premium activat en rebre el pagament. Només anual.",
                      "Paga por transferencia bancaria a Fiare. Acceso Premium activado al recibir el pago. Solo anual.")}
                  <br />
                  {tr("Per activar el teu accés Premium, realitza la ", "Para activar tu acceso Premium, realiza la ")}
                  <strong>{tr("TRANSFERÈNCIA IMMEDIATA", "TRANSFERENCIA INMEDIATA")}</strong>
                  {tr(" amb les següents dades i puja el justificant a continuació. L'accés s'activarà en uns segons.",
                      " con los siguientes datos y sube el justificante a continuación. El acceso se activará en unos segundos.")}
                </div>

                <ul className="mb-6">
                  {bankRows.map((r) => (
                    <li key={r.k} className="flex items-center justify-between gap-3.5 border-b py-3" style={{ borderColor: "rgba(38,49,43,.09)" }}>
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-soft)" }}>{r.k}</span>
                      <span className="text-right font-mono text-[13px]" style={{ color: r.copy ? "var(--ink)" : "var(--ink-soft)", letterSpacing: r.copy ? undefined : ".12em" }}>
                        {r.v}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyValue(r.k, r.copy)}
                        className="shrink-0 cursor-pointer rounded border px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-[var(--accent)] hover:text-white!"
                        style={{ borderColor: "rgba(94,135,114,.4)", color: "var(--accent)" }}
                      >
                        {copied === r.k ? tr("Copiat ✓", "Copiado ✓") : tr("Copiar", "Copiar")}
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Dropzone justificant */}
                <label
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragEnter={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const f = e.dataTransfer.files?.[0];
                    if (f) handleFile(f);
                  }}
                  className="block cursor-pointer rounded-[9px] border-[1.5px] border-dashed px-5 py-[34px] text-center transition-colors"
                  style={{
                    borderColor: dragOver ? "var(--accent)" : "rgba(94,135,114,.65)",
                    background: dragOver ? "rgba(170,201,182,.22)" : "rgba(170,201,182,.1)",
                  }}
                >
                  {uploadedFile ? (
                    <span className="block font-mono text-xs font-semibold" style={{ color: "var(--accent)" }}>
                      {uploadedFile}{validating ? tr(" — validant…", " — validando…") : ""}
                    </span>
                  ) : (
                    <span className="block font-mono text-xs tracking-[0.05em]" style={{ color: "var(--ink)" }}>
                      {tr("Arrossega el fitxer aquí o fes clic per seleccionar", "Arrastra el archivo aquí o haz clic para seleccionar")}
                    </span>
                  )}
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                    }}
                  />
                </label>

                <div className="mt-4">
                  {result && (
                    <p
                      className="rounded-md px-4 py-3 text-left text-sm"
                      style={
                        result.success
                          ? { background: "rgba(170,201,182,.22)", borderLeft: "3px solid var(--accent)", color: "var(--ink)" }
                          : { background: "rgba(201,169,97,.16)", borderLeft: "3px solid var(--sem-y)", color: "var(--ink)" }
                      }
                    >
                      {result.success ? "✓ " : "✗ "}{result.message}
                    </p>
                  )}
                </div>
                <p className="mt-4 font-mono text-[10px] tracking-[0.04em]" style={{ color: "var(--ink-soft)" }}>
                  {tr("El justificant es guardarà a la nostra base de dades per a la seva revisió.",
                      "El justificante se guardará en nuestra base de datos para su revisión.")}
                </p>
              </article>
            </div>

            {/* Columna dreta: resum comanda (sticky) */}
            <aside
              aria-label={tr("Resum de la comanda", "Resumen del pedido")}
              className="rounded-[9px] border bg-white p-7 lg:sticky lg:top-[92px] lg:p-8"
              style={{ borderColor: "rgba(38,49,43,.12)" }}
            >
              <h2 className="mb-5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--ink-soft)" }}>
                {tr("Resum de la comanda", "Resumen del pedido")}
              </h2>
              <div className="flex items-baseline justify-between gap-4 py-2.5 text-[0.94rem]" style={{ color: "var(--ink)" }}>
                <span>
                  Premium
                  <small className="mt-1 block font-mono text-[10px] tracking-[0.05em]" style={{ color: "var(--ink-soft)" }}>
                    {tr("Subscripció anual · setembre 2026 – agost 2027", "Suscripción anual · septiembre 2026 – agosto 2027")}
                  </small>
                </span>
                <span className="whitespace-nowrap font-mono text-sm">440&nbsp;€</span>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2.5 text-[0.94rem]" style={{ color: "var(--ink)" }}>
                <span>
                  {tr("Descompte early bird", "Descuento early bird")}
                  <small className="mt-1 block font-mono text-[10px] tracking-[0.05em]" style={{ color: "var(--ink-soft)" }}>
                    {tr("Primers 50 subscriptors", "Primeros 50 suscriptores")}
                  </small>
                </span>
                <span className="whitespace-nowrap font-mono text-sm font-semibold" style={{ color: "var(--accent)" }}>−150&nbsp;€</span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-4 border-t-2 pt-4" style={{ borderTopColor: "var(--ink)" }}>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink)" }}>
                  {tr("Total", "Total")}
                </span>
                <span className="font-serif text-4xl font-medium leading-none" style={{ color: "var(--ink-deep)" }}>
                  290&nbsp;€<small className="ml-1.5 font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: "var(--ink-soft)" }}>/any</small>
                </span>
              </div>
              <p className="mt-3 font-mono text-[11px] tracking-[0.04em]" style={{ color: "var(--ink-soft)" }}>
                {tr("Equival a 24,17 €/mes · Impostos inclosos", "Equivale a 24,17 €/mes · Impuestos incluidos")}
              </p>
              <button
                onClick={() => router.push("/preus")}
                className="mt-6 inline-block cursor-pointer font-mono text-[11px] tracking-[0.06em]"
                style={{ color: "var(--accent)" }}
              >
                ← {tr("Tornar a Preus", "Volver a Precios")}
              </button>
            </aside>
          </div>
        </section>

        {/* ══════════ NOTA ÈTICA (dark) ══════════ */}
        <section className="border-b" style={{ background: "var(--ink)", color: "var(--bg)" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
            <p className="eyebrow">{tr("Nota ètica", "Nota ética")}</p>
            <h2 className="font-serif text-4xl font-medium leading-[1.14] tracking-[-0.01em] sm:text-[2.7rem]" style={{ color: "var(--bg)" }}>
              {tr("Per què t'ofereixen dues maneres de pagar.", "Por qué te ofrecemos dos maneras de pagar.")}
            </h2>
            <p className="mt-5 max-w-[70ch] text-[1.03rem] leading-relaxed" style={{ color: "rgba(242,245,241,.78)" }}>
              {tr("Si pagues amb targeta (Stripe), una corporació nord-americana es queda una comissió del nostre treball i els diners circulen pel sistema financer especulatiu. Si tries la transferència anual al nostre compte de Fiare Banca Ètica, ",
                  "Si pagas con tarjeta (Stripe), una corporación norteamericana se queda una comisión de nuestro trabajo y el dinero circula por el sistema financiero especulativo. Si eliges la transferencia anual a nuestra cuenta de Fiare Banca Ética, ")}
              <strong className="font-medium" style={{ color: "var(--bg)" }}>
                {tr("el 100% dels teus diners dona suport a l'economia social i transformadora.", "el 100% de tu dinero apoya la economía social y transformadora.")}
              </strong>
            </p>
          </div>
        </section>

        {/* ══════════ TANCAMENT ══════════ */}
        <section className="bg-white">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:py-24">
            <h2 className="font-serif text-4xl font-medium leading-snug tracking-[-0.015em]" style={{ color: "var(--ink-deep)" }}>
              {tr("Sense permanència.", "Sin permanencia.")}<br />
              <span className="hl">{tr("Cancel·la quan vulguis.", "Cancela cuando quieras.")}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[0.97rem]" style={{ color: "var(--ink-soft)" }}>
              {tr("Si el servei no t'encaixa, marxes. Si et sobra temps per pensar, t'hem fet la feina.",
                  "Si el servicio no te encaja, te vas. Si te sobra tiempo para pensar, te hemos hecho el trabajo.")}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href="#targeta" className="btn-v1 btn-v1-solid">
                {tr("Pagar amb targeta", "Pagar con tarjeta")}
              </a>
              <a href="#transferencia" className="btn-v1 btn-v1-ghost">
                {tr("Pagar amb transferència", "Pagar con transferencia")}
              </a>
            </div>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--ink-soft)" }}>
              <b className="font-semibold" style={{ color: "var(--ink)" }}>EARLY BIRD</b>
              {" · "}
              {tr("290€/ANY PER ALS PRIMERS 50 SUBSCRIPTORS · IMPOSTOS INCLOSOS",
                  "290€/AÑO PARA LOS PRIMEROS 50 SUSCRIPTORES · IMPUESTOS INCLUIDOS")}
            </p>
          </div>
        </section>
      </main>
      <FooterV1 />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
    </div>
  );
}
