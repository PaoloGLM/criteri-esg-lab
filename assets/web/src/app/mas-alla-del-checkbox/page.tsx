"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/site-header-v1";
import { FooterV1 } from "@/components/site-footer-v1";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";

const preguntas = [
  { num: "001", date: "26 ago 2026", type: "Adopción de personajes", previewEs: "La respuesta te dice más sobre tu valor real que cualquier métrica ESG. Las empresas que solo crean valor para accionistas no dejan vacío cuando desaparecen...", previewCa: "La resposta et diu més sobre el teu valor real que cap mètrica ESG. Les empreses que només creen valor per a accionistes no deixen buit quan desapareixen...", textEs: "Si tu empresa desapareciera mañana, ¿quién lo notaría de verdad —y por qué?", textCa: "Si la teva empresa desaparegués demà, qui ho notaria de veritat —i per què?" },
  { num: "002", date: "9 sept 2026", type: "Dos bandos", previewEs: "La mayoría de directores no sabe responder. Tienen 47 KPIs y ninguno que sintetice. Tener demasiadas métricas sin un relato coherente es tan inútil como no tener ninguna...", previewCa: "La majoria de directors no sap respondre. Tenen 47 KPIs i cap que sintetitzi. Tenir massa mètriques sense un relat coherent és tan inútil com no tenir-ne cap...", textEs: "Si mañana te pidieran demostrar el impacto positivo de tu empresa con un solo dato, ¿cuál elegirías —y por qué?", textCa: "Si demà et demanessin demostrar l'impacte positiu de la teva empresa amb un sol dato, quin triaries —i per què?" },
  { num: "003", date: "23 sept 2026", type: "Generación de ideas", previewEs: "La pregunta es deliberadamente incómoda. Casi todo director de sostenibilidad admite que hay prácticas que prefiere no exhibir. No necesariamente porque sean ilegales: porque son inconsistentes...", previewCa: "La pregunta és deliberadament incòmoda. Gairebé tot director de sostenibilitat admet que hi ha pràctiques que prefereix no exhibir. No necessàriament perquè siguin il·legals: perquè són inconsistents...", textEs: "Si tuvieras que defender ante un regulador que tu empresa es \"ética\", ¿qué tres prácticas defenderías y qué tres ocultarías?", textCa: "Si haguessis de defensar davant un regulador que la teva empresa és \"ètica\", quines tres pràctiques defensaries i quines tres amagaries?" },
  { num: "004", date: "7 oct 2026", type: "Adopción de personajes", previewEs: "Cuando un director de sostenibilidad está solo en su despacho, sin presión de inversores, sin auditoría, sin comité — ¿para quién trabaja realmente? La respuesta honesta suele ser incómoda...", previewCa: "Quan un director de sostenibilitat està sol al seu despatx, sense pressió d'inversors, sense auditoria, sense comitè — per a qui treballa realment? La resposta honesta sol ser incòmoda...", textEs: "¿Para quién trabajas realmente cuando nadie te está mirando?", textCa: "Per a qui treballes realment quan ningú t'està mirant?" },
  { num: "005", date: "21 oct 2026", type: "Dos bandos", previewEs: "La pregunta es kantiana en su forma y marxista en su sospecha. Es incómoda para casi todos. Las tres decisiones que afloran suelen tener un patrón común...", previewCa: "La pregunta és kantiana en la seva forma i marxista en la seva sospita. És incòmoda per a gairebé tothom. Les tres decisions que afloren solen tenir un patró comú...", textEs: "Si el objetivo de tu empresa fuera el bien común y no la maximización de beneficio, ¿qué tres decisiones de los últimos dos años no se habrían tomado?", textCa: "Si l'objectiu de la teva empresa fos el bé comú i no la maximització de benefici, quines tres decisions dels últims dos anys no s'haurien pres?" },
];

export default function MasAllaCheckboxPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);

  const openAuth = (tab: "register" | "login" = "register") => { setAuthTab(tab); setAuthOpen(true); };
  const tr = (ca: string, es: string) => (lang === "ca" ? ca : es);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={(tab) => openAuth(tab || "register")} />
      <main className="flex-1">
        {/* HERO dark */}
        <section style={{ background: "#26312B", color: "#F2F5F1" }}>
          <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-8 lg:py-28">
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#AAC9B6" }}>{tr("Sèrie editorial · Cada quinzena", "Serie editorial · Cada quincena")}</p>
            <h1 className="mb-6 font-serif text-6xl font-normal leading-tight" style={{ color: "#F2F5F1", letterSpacing: "-0.025em" }}>{tr("Més enllà del ", "Más allá del ")}<em className="italic" style={{ color: "#AAC9B6", fontWeight: 500 }}>Checkbox</em></h1>
            <p className="max-w-2xl mx-auto font-serif text-xl italic" style={{ color: "rgba(245,239,230,0.7)" }}>{tr("Preguntes que no es responen amb un KPI. Per a directors de sostenibilitat que prefereixen pensar abans de complir.", "Preguntas que no se responden con un KPI. Para directores de sostenibilidad que prefieren pensar antes de cumplir.")}</p>
          </div>
        </section>

        {/* INTRO */}
        <section className="border-b border-rule" style={{ background: "#F2F5F1" }}>
          <div className="mx-auto max-w-3xl px-6 py-16 text-center">
            <p className="font-serif text-lg italic leading-relaxed text-primary">
              {tr("Cada mes publiquem una pregunta que no té resposta única. La pregunta i la nostra reflexió són públiques. La dinàmica de grup per treballar-la amb el teu equip està reservada a subscriptors Premium.", "Cada mes publicamos una pregunta que no tiene respuesta única. La pregunta y nuestra reflexión son públicas. La dinámica de grupo para trabajarla con tu equipo está reservada a suscriptores Premium.")}
            </p>
            <div className="mt-8 flex justify-center gap-12 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "#4A5F53" }}>
              <span><strong className="text-primary">5</strong> {tr("preguntes", "preguntas")}</span>
              <span><strong className="text-primary">3</strong> {tr("tipus de dinàmica", "tipos de dinámica")}</span>
            </div>
          </div>
        </section>

        {/* LLISTAT */}
        <section className="border-b border-rule" style={{ background: "#F2F5F1" }}>
          <div className="mx-auto max-w-4xl px-6 py-16">
            <div className="flex flex-col">
              {preguntas.map((p, i) => (
                <button key={p.num} onClick={() => router.push(`/mas-alla-del-checkbox/${p.num}`)} className="grid grid-cols-[60px_1fr_auto] gap-6 border-b py-8 text-left transition-colors hover:bg-[rgba(184,115,51,0.04)]" style={{ borderColor: "#D8E2DA" }}>
                  <span className="font-serif text-4xl font-light" style={{ color: "#5E8772", letterSpacing: "-0.03em" }}>{String(i + 1).padStart(2, "0")}</span>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-4 items-baseline font-mono text-[10px] uppercase tracking-[0.16px]" style={{ color: "#4A5F53" }}>
                      <span style={{ color: "#3F6653", fontWeight: 600 }}>{p.date}</span>
                      <span className="px-2 py-0.5" style={{ background: "rgba(184,115,51,0.1)", color: "#3F6653", fontWeight: 600 }}>{p.type}</span>
                    </div>
                    <h2 className="font-serif text-xl font-medium leading-tight text-primary" style={{ letterSpacing: "-0.01em" }}>{tr(p.textCa, p.textEs)}</h2>
                    <p className="text-[13px] leading-relaxed" style={{ color: "#141B18" }}>{tr(p.previewCa, p.previewEs)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 pt-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14px] font-semibold" style={{ color: "#5E8772" }}>{tr("Llegir →", "Leer →")}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.12px] font-semibold px-2 py-0.5" style={{ background: "#5E8772", color: "white" }}>{tr("Dinàmica Premium", "Dinámica Premium")}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* COM FUNCIONA */}
        <section style={{ background: "#26312B", color: "#F2F5F1" }}>
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="flex flex-col gap-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.22px] font-semibold" style={{ color: "#AAC9B6" }}>{tr("Com funciona", "Cómo funciona")}</p>
                <h2 className="font-serif text-4xl font-medium leading-tight" style={{ color: "#F2F5F1" }}>{tr("Pregunta + ", "Pregunta + ")}<em className="italic" style={{ color: "#AAC9B6" }}>{tr("reflexió", "reflexión")}</em>{tr(" + dinàmica", " + dinámica")}</h2>
                <p className="max-w-md font-serif text-lg italic" style={{ color: "rgba(245,239,230,0.75)" }}>{tr("Cada mes, una pregunta que no es resol amb un KPI. La pregunta i la nostra reflexió són sempre públiques. La dinàmica per treballar-la amb el teu equip està reservada a Premium.", "Cada mes, una pregunta que no se resuelve con un KPI. La pregunta y nuestra reflexión son siempre públicas. La dinámica para trabajarla con tu equipo está reservada a Premium.")}</p>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { n: "01", t: tr("La pregunta", "La pregunta"), d: tr("Oberta, sense resposta única, formulada per crear incomoditat productiva. Visible per a tothom.", "Abierta, sin respuesta única, formulada para crear incomodidad productiva. Visible para todos.") },
                  { n: "02", t: tr("La reflexió", "La reflexión"), d: tr("200-300 paraules des de la veu editorial de Criteri ESG. No és la resposta: és un marc per pensar.", "200-300 palabras desde la voz editorial de Criteri ESG. No es la respuesta: es un marco para pensar.") },
                  { n: "03", t: tr("La dinàmica", "La dinámica"), d: tr("Proposta pràctica per fer amb el teu equip (30-90 min). Tres tipus: generació d'idees, dos bàndols, adopció de personatges. Reservada a Premium.", "Propuesta práctica para hacer con tu equipo (30-90 min). Tres tipos: generación de ideas, dos bandos, adopción de personajes. Reservada a Premium.") },
                ].map((item) => (
                  <div key={item.n} className="grid grid-cols-[32px_1fr] gap-4 border-b py-4" style={{ borderColor: "rgba(217,165,116,0.2)" }}>
                    <span className="font-serif text-2xl font-medium" style={{ color: "#AAC9B6" }}>{item.n}</span>
                    <p className="text-sm leading-relaxed" style={{ color: "#F2F5F1" }}><strong style={{ color: "#AAC9B6", fontWeight: 600 }}>{item.t}</strong> — {item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterV1 />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
    </div>
  );
}
