"use client";

import { useState } from "react";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";

export default function PreusPage() {
  const { lang } = useLanguage();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);

  const openAuth = (tab: "register" | "login" = "register") => { setAuthTab(tab); setAuthOpen(true); };
  const tr = (ca: string, es: string) => (lang === "ca" ? ca : es);

  const plans = [
    {
      tag: tr("Gratis per sempre", "Gratis para siempre"),
      name: "Free", price: "0€", unit: tr("/ mes", "/ mes"),
      desc: tr("Per a qui comença a explorar l'ESG i vol entendre el paisatge sense compromís.", "Para quien empieza a explorar el ESG y quiere entender el paisaje sin compromiso."),
      features: [
        { text: tr("Accés a informes antics (>6 mesos)", "Acceso a informes antiguos (>6 meses)"), ok: true },
        { text: tr("Newsletter reduïda (bimensual)", "Newsletter reducida (bimensual)"), ok: true },
        { text: tr("Pàgina d'estàndards ESG completa", "Página de estándares ESG completa"), ok: true },
        { text: tr("Informes recents (últims 6 mesos)", "Informes recientes (últimos 6 meses)"), ok: false },
        { text: tr("Cross-reference amb certificacions", "Cross-reference con certificaciones"), ok: false },
        { text: tr("Accions recomanades", "Acciones recomendadas"), ok: false },
      ],
      cta: tr("Comença gratis", "Empieza gratis"),
      featured: false,
    },
    {
      tag: tr("Recomanat", "Recomendado"),
      name: "Premium", price: "29€", unit: tr("/ mes · pagament anual", "/ mes · pago anual"),
      earlyBird: tr("Early bird · 50 places · Només anual", "Early bird · 50 plazas · Solo anual"),
      originalPrice: tr("Preu normal: 39€/mes · Early bird: 348€/any (29€/mes)", "Precio normal: 39€/mes · Early bird: 348€/año (29€/mes)"),
      desc: tr("Per al director de sostenibilitat que necessita criteri per decidir què fer cada setmana.", "Para el director de sostenibilidad que necesita criterio para decidir qué hacer cada semana."),
      features: [
        { text: tr("Tot lo de Free", "Todo lo de Free"), ok: true },
        { text: tr("Accés a tots els informes recents", "Acceso a todos los informes recientes"), ok: true },
        { text: tr("Cross-reference amb les teves certificacions", "Cross-reference con tus certificaciones"), ok: true },
        { text: tr("Accions recomanades operatives", "Acciones recomendadas operativas"), ok: true },
        { text: tr("Newsletter completa (bimensual)", "Newsletter completa (bimensual)"), ok: true },
        { text: tr("Semàfor metodològic complet", "Semáforo metodológico completo"), ok: true },
      ],
      cta: tr("Fes-te Premium", "Hazte Premium"),
      featured: true,
    },
    {
      tag: tr("Disponible abril 2027", "Disponible abril 2027"),
      name: "Ultra", price: "89€", unit: tr("/ mes", "/ mes"),
      desc: tr("Per a consultories i equips que necessiten anàlisi personalitzat i formats addicionals.", "Para consultorías y equipos que necesitan análisis personalizado y formatos adicionales."),
      features: [
        { text: tr("Tot lo de Premium", "Todo lo de Premium"), ok: true },
        { text: tr("Connexions personalitzades mensuals", "Conexiones personalizadas mensuales"), ok: false },
        { text: tr("Format PPT per a presentacions", "Formato PPT para presentaciones"), ok: false },
        { text: tr("Podcast exclusiu", "Podcast exclusivo"), ok: false },
        { text: tr("Anàlisi personalitzat d'empresa", "Análisis personalizado de empresa"), ok: false },
        { text: tr("Suport prioritari", "Soporte prioritario"), ok: false },
      ],
      cta: tr("Avisa'm quan estigui disponible", "Avísame cuando esté disponible"),
      featured: false,
      disabled: true,
    },
  ];

  const compareRows = [
    { label: tr("Informes antics (>6 mesos)", "Informes antiguos (>6 meses)"), free: true, premium: true, ultra: true },
    { label: tr("Informes recents (últims 6 mesos)", "Informes recientes (últimos 6 meses)"), free: false, premium: true, ultra: true },
    { label: tr("Semàfor metodològic", "Semáforo metodológico"), free: true, premium: true, ultra: true },
    { label: tr("Cross-reference amb certificacions", "Cross-reference con certificaciones"), free: false, premium: true, ultra: true },
    { label: tr("Accions recomanades", "Acciones recomendadas"), free: false, premium: true, ultra: true },
    { label: tr("Newsletter completa", "Newsletter completa"), free: false, premium: true, ultra: true },
    { label: tr("Preguntes ètiques + dinàmiques", "Preguntas éticas + dinámicas"), free: false, premium: true, ultra: true },
    { label: tr("Connexions personalitzades", "Conexiones personalizadas"), free: false, premium: false, ultra: true },
    { label: tr("Format PPT", "Formato PPT"), free: false, premium: false, ultra: true },
    { label: tr("Podcast exclusiu", "Podcast exclusivo"), free: false, premium: false, ultra: true },
    { label: tr("Anàlisi personalitzat", "Análisis personalizado"), free: false, premium: false, ultra: true },
  ];

  const faqs = [
    { q: tr("¿Quan s'activa el paywall?", "¿Cuándo se activa el paywall?"), a: tr("Al novembre de 2026. Durant setembre i octubre, tot el contingut és gratuït. A partir de novembre, els informes recents (últims 6 mesos) i les seccions premium de la newsletter requeriran subscripció Premium.", "En noviembre de 2026. Durante septiembre y octubre, todo el contenido es gratuito. A partir de noviembre, los informes recientes (últimos 6 meses) y las secciones premium de la newsletter requerirán suscripción Premium.") },
    { q: tr("¿Què passa amb els 50 primers subscriptors?", "¿Qué pasa con los 50 primeros suscriptores?"), a: tr("Conserven el preu de 29€/mes durant tot el primer any (12 mesos), amb pagament anual de 348€. A partir del segon any, passen al preu estàndard de 39€/mes.", "Conservan el precio de 29€/mes durante todo el primer año (12 meses), con pago anual de 348€. A partir del segundo año, pasan al precio estándar de 39€/mes.") },
    { q: tr("¿Hi ha permanència?", "¿Hay permanencia?"), a: tr("L'early bird (29€/mes) requereix pagament anual: 348€ per 12 mesos. Sense permanència més enllà de l'any contractat. El preu estàndard (39€/mes) es pot pagar mensualment sense permanència.", "El early bird (29€/mes) requiere pago anual: 348€ por 12 meses. Sin permanencia más allá del año contratado. El precio estándar (39€/mes) se puede pagar mensualmente sin permanencia.") },
    { q: tr("¿Puc provar Premium abans de pagar?", "¿Puedo probar Premium antes de pagar?"), a: tr("Sí. Qualsevol usuari nou pot provar Premium gratis durant 7 dies. Es requereix targeta, però no es cobra fins al dia 8.", "Sí. Cualquier usuario nuevo puede probar Premium gratis durante 7 días. Se requiere tarjeta, pero no se cobra hasta el día 8.") },
    { q: tr("¿Quan estarà disponible Ultra?", "¿Cuándo estará disponible Ultra?"), a: tr("Abril de 2027, 6 mesos després del llançament. Ho retràstem a propòsit: necessitem afinar els formats premium abans de vendre'ls.", "Abril de 2027, 6 meses después del lanzamiento. Lo retrasamos a propósito: necesitamos afinar los formatos premium antes de venderlos.") },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={(tab) => openAuth(tab || "register")} />
      <main className="flex-1">
        {/* HERO */}
        <section className="border-b border-rule text-center" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-3xl px-6 py-20">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#8A5526" }}>{tr("Plans · Criteri ESG", "Planes · Criteri ESG")}</p>
            <h1 className="mb-4 font-serif text-5xl font-medium leading-tight text-primary">{tr("Tres plans. ", "Tres planes. ")}<em className="italic" style={{ color: "#5C3A1E" }}>{tr("Una convicció.", "Una convicción.")}</em></h1>
            <p className="font-serif text-lg italic" style={{ color: "#5C3A1E" }}>{tr("Accés lliure al setembre i octubre. A partir de novembre, tria el pla que millor encaixi amb el teu equip. Sense permanència. Sense lletra petita.", "Acceso libre en septiembre y octubre. A partir de noviembre, elige el plan que mejor encaje con tu equipo. Sin permanencia. Sin letra pequeña.")}</p>
          </div>
        </section>

        {/* PLANS */}
        <section className="border-b border-rule" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
            <div className="grid gap-7 md:grid-cols-3">
              {plans.map((plan) => (
                <div key={plan.name} className="relative flex flex-col gap-5 border p-8" style={{ borderColor: plan.featured ? "#B87333" : "#C9B89A", background: plan.featured ? "#2C1810" : "white", color: plan.featured ? "#F5EFE6" : "#2C1810", transform: plan.featured ? "scale(1.03)" : "none" }}>
                  {plan.earlyBird && <span className="absolute -top-3 right-6 font-mono text-[9px] uppercase tracking-[0.14em] font-semibold px-3 py-1" style={{ background: "#B87333", color: "white" }}>{plan.earlyBird}</span>}
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] font-semibold" style={{ color: plan.featured ? "#D9A574" : plan.name === "Free" ? "#4A6B3A" : "#8B7355" }}>{plan.tag}</p>
                  <h2 className="font-serif text-3xl font-medium" style={{ letterSpacing: "-0.015em" }}>{plan.name}</h2>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-5xl font-normal" style={{ color: "#B87333", letterSpacing: "-0.03em" }}>{plan.price}</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: plan.featured ? "rgba(245,239,230,0.6)" : "#8B7355" }}>{plan.unit}</span>
                  </div>
                  {plan.originalPrice && <p className="font-mono text-[11px]" style={{ color: plan.featured ? "rgba(245,239,230,0.4)" : "#8B7355", textDecoration: "line-through" }}>{plan.originalPrice}</p>}
                  <p className="font-serif text-sm italic leading-relaxed border-y py-4" style={{ color: plan.featured ? "rgba(245,239,230,0.75)" : "#5C3A1E", borderColor: plan.featured ? "rgba(217,165,116,0.25)" : "#C9B89A" }}>{plan.desc}</p>
                  <div className="flex flex-col gap-2.5">
                    {plan.features.map((f) => (
                      <div key={f.text} className="flex items-baseline gap-2.5 text-[13px]" style={{ color: f.ok ? (plan.featured ? "#F5EFE6" : "#2C1810") : (plan.featured ? "rgba(245,239,230,0.4)" : "#8B7355") }}>
                        <span style={{ color: f.ok ? "#B87333" : (plan.featured ? "rgba(245,239,230,0.3)" : "#C9B89A") }}>{f.ok ? "✓" : "—"}</span>
                        <span>{f.text}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => plan.disabled ? null : plan.featured ? window.location.href = "/pagament" : openAuth("register")}
                    className="mt-auto py-3.5 text-sm font-semibold"
                    style={{ background: plan.featured ? "#B87333" : "transparent", color: plan.featured ? "white" : "#2C1810", border: plan.featured ? "none" : "1px solid #2C1810", opacity: plan.disabled ? 0.5 : 1, cursor: plan.disabled ? "not-allowed" : "pointer" }}
                  >{plan.cta}</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPARATIVA */}
        <section className="border-b border-rule" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
            <h2 className="mb-8 text-center font-serif text-3xl font-medium text-primary">{tr("Comparativa detallada", "Comparativa detallada")}</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left font-mono text-[9.5px] uppercase tracking-[0.18em] font-semibold p-3.5" style={{ background: "#5C3A1E", color: "#F5EFE6" }}>{tr("Característica", "Característica")}</th>
                  <th className="text-center font-mono text-[9.5px] uppercase tracking-[0.18em] font-semibold p-3.5" style={{ background: "#5C3A1E", color: "#F5EFE6" }}>Free</th>
                  <th className="text-center font-mono text-[9.5px] uppercase tracking-[0.18em] font-semibold p-3.5" style={{ background: "#5C3A1E", color: "#F5EFE6" }}>Premium</th>
                  <th className="text-center font-mono text-[9.5px] uppercase tracking-[0.18em] font-semibold p-3.5" style={{ background: "#5C3A1E", color: "#F5EFE6" }}>Ultra</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row.label} className="border-b" style={{ borderColor: "#C9B89A" }}>
                    <td className="p-3.5 text-[13px] text-primary">{row.label}</td>
                    <td className="p-3.5 text-center" style={{ color: row.free ? "#5C8A5C" : "#8B7355", opacity: row.free ? 1 : 0.5 }}>{row.free ? "✓" : "—"}</td>
                    <td className="p-3.5 text-center" style={{ color: row.premium ? "#5C8A5C" : "#8B7355", opacity: row.premium ? 1 : 0.5 }}>{row.premium ? "✓" : "—"}</td>
                    <td className="p-3.5 text-center" style={{ color: row.ultra ? "#5C8A5C" : "#8B7355", opacity: row.ultra ? 1 : 0.5 }}>{row.ultra ? "✓" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-rule" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-3xl px-6 py-16">
            <h2 className="mb-8 text-center font-serif text-3xl font-medium text-primary">{tr("Preguntes freqüents", "Preguntas frecuentes")}</h2>
            <div className="flex flex-col">
              {faqs.map((faq) => (
                <div key={faq.q} className="border-b py-5" style={{ borderColor: "#C9B89A" }}>
                  <h3 className="mb-2 font-serif text-lg font-medium text-primary">{faq.q}</h3>
                  <p className="text-[14px] leading-relaxed" style={{ color: "#5C3A1E" }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section style={{ background: "#2C1810", color: "#F5EFE6" }}>
          <div className="mx-auto max-w-4xl px-6 py-24 text-center">
            <h2 className="mb-6 font-serif text-4xl leading-snug" style={{ color: "#F5EFE6", letterSpacing: "-0.018em" }}>
              {tr("Si treballes en sostenibilitat, ", "Si trabajas en sostenibilidad, ")}<em className="italic font-medium" style={{ color: "#D9A574" }}>{tr("t'entenem", "te entendemos")}</em>.<br />{tr("Estem per retornar-te temps per pensar.", "Estamos para devolverte tiempo para pensar.")}
            </h2>
            <button onClick={() => openAuth("register")} className="mt-4 px-10 py-4 text-sm font-semibold text-white" style={{ background: "#B87333" }}>{tr("Accés obert al setembre", "Acceso abierto en septiembre")}</button>
            <p className="mt-3 font-serif text-sm italic" style={{ color: "rgba(245,239,230,0.5)" }}>{tr("Sense targeta de crèdit. Sense paywall fins al novembre.", "Sin tarjeta de crédito. Sin paywall hasta noviembre.")}</p>
          </div>
        </section>
      </main>
      <Footer />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
    </div>
  );
}
