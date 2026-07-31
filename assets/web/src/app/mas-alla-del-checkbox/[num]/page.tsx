"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/lib/auth-context";

const preguntasData: Record<string, {
  date: string; type: string; duration: string;
  textEs: string; textCa: string;
  titleEs: string; titleCa: string;
  reflexioFreeEs: string; reflexioFreeCa: string;
  reflexioPremiumEs: string[]; reflexioPremiumCa: string[];
  dinamicaEs: { header: string; prep: string; steps: { time: string; desc: string }[]; closing: string[] };
  dinamicaCa: { header: string; prep: string; steps: { time: string; desc: string }[]; closing: string[] };
}> = {
  "001": {
    date: "26 agosto 2026", type: "Adopción de personajes", duration: "60-90 min · 6-10 personas",
    textEs: "Si tu empresa desapareciera mañana, ¿quién lo notaría de verdad —y por qué?",
    textCa: "Si la teva empresa desaparegués demà, qui ho notaria de veritat —i per què?",
    titleEs: "El vacío que dejas es la única medida honesta de impacto",
    titleCa: "El buit que deixes és l'única mesura honesta d'impacte",
    reflexioFreeEs: "La respuesta a esta pregunta te dice más sobre el valor real de tu empresa que cualquier métrica ESG. Lo interesante no es quién lo notaría hoy, sino quién lo notaría dentro de diez años. Las empresas que solo crean valor para accionistas no dejan vacío cuando desaparecen: el mercado lo cubre en semanas. Las que crean valor para trabajadores, comunidad y territorio, sí dejan vacío. Y ese vacío es la única medida honesta de impacto positivo.",
    reflexioFreeCa: "La resposta a aquesta pregunta et diu més sobre el valor real de la teva empresa que cap mètrica ESG. El que és interessant no és qui ho notaria avui, sinó qui ho notaria d'aquí a deu anys. Les empreses que només creen valor per a accionistes no deixen buit quan desapareixen: el mercat ho cobreix en setmanes. Les que creen valor per a treballadors, comunitat i territori, sí que deixen buit. I aquest buit és l'única mesura honesta d'impacte positiu.",
    reflexioPremiumEs: [
      "La mayoría de memorias de sostenibilidad no se atreven a hacer esta pregunta. Listan 47 KPIs pero no dicen qué pasaría si la empresa dejara de existir. Es más fácil cuantificar emisiones que responder una pregunta sobre vacío. Pero la pregunta sobre vacío es la que distingue una empresa con propósito de una empresa con reporting.",
      "No te pedimos que respondas en un tweet. Te pedimos que uses la pregunta como criterio: cada decisión estratégica que tomes este trimestre, pasa por ella. Si la decisión no cambia la respuesta a «quién lo notaría», probablemente no merece ser llamada estratégica.",
      "Hay una segunda capa más incómoda. La pregunta no es solo quién lo notaría, sino cuánto tiempo lo notaría. Si la respuesta es «unas semanas», tu empresa es reemplazable. Si es «unos meses», eres útil pero no imprescindible. Si es «años», estás creando algo que el mercado no puede sustituir fácilmente. Y si la respuesta es «generaciones», entonces tu impacto va más allá del reporting: forma parte del tejido social.",
      "La trampa del ESG es que mide lo que se puede cuantificar, no lo que importa. El vacío que dejas no se puede poner en un KPI. Pero es la pregunta que ningún regulador te hará y que todo director de sostenibilidad debería hacerse a solas, sin comité, sin auditoría, sin reporting. La honestidad con uno mismo es el primer acto de sostenibilidad real.",
    ],
    reflexioPremiumCa: [
      "La majoria de memòries de sostenibilitat no s'atreveixen a fer aquesta pregunta. Llisten 47 KPIs però no diuen què passaria si l'empresa deixés d'existir. És més fàcil quantificar emissions que respondre una pregunta sobre buit. Però la pregunta sobre buit és la que distingeix una empresa amb propòsit d'una empresa amb reporting.",
      "No et demanem que responguis en un tweet. Et demanem que facis servir la pregunta com a criteri: cada decisió estratègica que prenguis aquest trimestre, passa per ella. Si la decisió no canvia la resposta a «qui ho notaria», probablement no mereix ser called estratègica.",
      "Hi ha una segona capa més incòmoda. La pregunta no és només qui ho notaria, sinó quant de temps ho notaria. Si la resposta és «unes setmanes», la teva empresa és reemplaçable. Si és «uns mesos», ets útil però no imprescindible. Si és «anys», estàs creant alguna cosa que el mercat no pot substituir fàcilment. I si la resposta és «generacions», llavors el teu impacte va més enllà del reporting: forma part del teixit social.",
      "La trampa de l'ESG és que mesura el que es pot quantificar, no el que importa. El buit que deixes no es pot posar en un KPI. Però és la pregunta que cap regulador et farà i que tot director de sostenibilitat hauria de fer-se a soles, sense comitè, sense auditoria, sense reporting. L'honestitat amb un mateix és el primer acte de sostenibilitat real.",
    ],
    dinamicaEs: {
      header: "7 voces en la sala",
      prep: "Cada persona recibe 24h antes su personaje asignado al azar. Los personajes posibles son: el trabajador de la fábrica con 18 años de antigüedad, el alcalde del municipio donde está la planta, el proveedor local que depende 40% de vuestro negocio, el cliente final que lleva 10 años comprando vuestro producto, el competidor directo que os querría reemplazar, el regulador que tendría que gestionar el cierre, el nieto de un trabajador actual (generación futura).",
      steps: [
        { time: "15 min", desc: "Cada persona escribe en una sola frase: «Lo que yo perdería si la empresa desaparece es...» (no más de una línea)." },
        { time: "30 min", desc: "Ronda de lectura. Cada personaje lee su frase y explica en 2 minutos por qué. Sin interrupciones." },
        { time: "30 min", desc: "Discusión abierta: qué patrones aparecen. Qué personajes pierden más. Cuáles casi nada." },
        { time: "15 min", desc: "Síntesis: el grupo responde colectivamente, en una pizarra: «Si solo pudiéramos proteger a tres de estos personajes en un cierre, ¿a cuáles protegeríamos y por qué?»" },
      ],
      closing: [
        "¿Las decisiones que tomamos este trimestre protegen a esos tres personajes o a otros?",
        "¿Estaríamos dispuestos a publicar en nuestra memoria quiénes son esos tres?",
        "Si la respuesta cambia según quién pregunta, ¿es honesta?",
      ],
    },
    dinamicaCa: {
      header: "7 veus a la sala",
      prep: "Cada persona rep 24h abans el seu personatge assignat a l'atzar. Els personatges possibles són: el treballador de la fàbrica amb 18 anys d'antiguitat, l'alcalde del municipi on és la planta, el proveïdor local que depèn 40% del vostre negoci, el client final que porta 10 anys comprant el vostre producte, el competidor directe que us voldria reemplaçar, el regulador que hauria de gestionar el tancament, el nét d'un treballador actual (generació futura).",
      steps: [
        { time: "15 min", desc: "Cada persona escriu en una sola frase: «El que jo perdria si l'empresa desaparegués és...» (no més d'una línia)." },
        { time: "30 min", desc: "Ronda de lectura. Cada personatge llegeix la seva frase i explica en 2 minuts per què. Sense interrupcions." },
        { time: "30 min", desc: "Discussió oberta: quins patrons apareixen. Quins personatges perden més. Quins gairebé res." },
        { time: "15 min", desc: "Síntesi: el grup respon col·lectivament, en una pissarra: «Si només poguéssim protegir a tres d'aquests personatges en un tancament, a quins protegiríem i per què?»" },
      ],
      closing: [
        "¿Les decisions que prenem aquest trimestre protegeixen a aquests tres personatges o a altres?",
        "¿Estaríem disposats a publicar a la nostra memòria qui són aquests tres?",
        "Si la resposta canvia segons qui pregunta, és honesta?",
      ],
    },
  },
};

export default function PreguntaDetallPage() {
  const params = useParams();
  const router = useRouter();
  const { lang } = useLanguage();
  const { user, plan } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);

  const openAuth = (tab: "register" | "login" = "register") => { setAuthTab(tab); setAuthOpen(true); };
  const tr = (ca: string, es: string) => (lang === "ca" ? ca : es);

  const num = typeof params?.num === "string" ? params.num : Array.isArray(params?.num) ? params.num[0] : "";
  const data = preguntasData[num];

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={(tab) => openAuth(tab || "register")} />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 font-serif text-3xl text-primary">404</h1>
            <p className="mb-6" style={{ color: "#5C3A1E" }}>{tr("Aquesta pregunta no existeix.", "Esta pregunta no existe.")}</p>
            <button onClick={() => router.push("/mas-alla-del-checkbox")} className="px-6 py-3 text-sm font-semibold text-white" style={{ background: "#B87333" }}>{tr("← Tornar", "← Volver")}</button>
          </div>
        </main>
        <Footer />
        <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
        <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
      </div>
    );
  }

  const isPremium = !!user && plan === "premium";
  const dinamica = lang === "ca" ? data.dinamicaCa : data.dinamicaEs;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={(tab) => openAuth(tab || "register")} />
      <main className="flex-1">
        {/* BREADCRUMB */}
        <div className="border-b px-6 py-4 lg:px-8" style={{ background: "#F5EFE6", borderColor: "#C9B89A" }}>
          <div className="mx-auto max-w-4xl">
            <button onClick={() => router.push("/mas-alla-del-checkbox")} className="font-mono text-[10px] uppercase tracking-[0.16px]" style={{ color: "#8A5526" }}>
              {tr("Més enllà del Checkbox", "Más allá del Checkbox")} <span style={{ color: "#C9B89A" }}>/</span> <span style={{ color: "#2C1810" }}>{tr("Pregunta #" + num, "Pregunta #" + num)}</span>
            </button>
          </div>
        </div>

        {/* HEADER PREGUNTA */}
        <section className="border-b border-rule" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
            <div className="mb-6 flex gap-4 items-start">
              <span className="font-serif text-5xl font-light" style={{ color: "#B87333", letterSpacing: "-0.03em" }}>{String(parseInt(num)).padStart(2, "0")}</span>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.2px] font-semibold" style={{ color: "#8A5526" }}>{tr("Pregunta de la quinzena", "Pregunta de la quincena")}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14px]" style={{ color: "#8B7355" }}>{data.date} · #{num}</span>
                <span className="inline-block self-start px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14px] font-semibold mt-1" style={{ background: "rgba(184,115,51,0.1)", color: "#8A5526" }}>{data.type} · {data.duration}</span>
              </div>
            </div>
            <h1 className="font-serif text-4xl font-medium leading-tight text-primary" style={{ letterSpacing: "-0.018px" }}>
              {tr(data.textCa, data.textEs)}
            </h1>
          </div>
        </section>

        {/* REFLEXIÓ */}
        <section className="border-b border-rule" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22px] font-semibold" style={{ color: "#8A5526" }}>{tr("La nostra reflexió", "Nuestra reflexión")}</p>
            <h2 className="mb-6 font-serif text-2xl font-medium text-primary">{tr(data.titleCa, data.titleEs)}</h2>
            <div className="font-serif text-lg leading-relaxed text-primary">
              <p className="mb-4">{tr(data.reflexioFreeCa, data.reflexioFreeEs)}</p>
            </div>

            {/* Premium content */}
            {isPremium ? (
              <div className="font-serif text-lg leading-relaxed text-primary">
                {(lang === "ca" ? data.reflexioPremiumCa : data.reflexioPremiumEs).map((p, i) => (
                  <p key={i} className="mb-4">{p}</p>
                ))}

                {/* DINÀMICA */}
                <div className="mt-12 pt-8 border-t" style={{ borderColor: "#C9B89A" }}>
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22px] font-semibold" style={{ color: "#8A5526" }}>{tr("Dinàmica de grup · " + data.type, "Dinámica de grupo · " + data.type)}</p>
                  <h2 className="mb-6 font-serif text-2xl font-medium text-primary">{dinamica.header}</h2>
                  <div className="p-7" style={{ background: "rgba(184,115,51,0.06)", borderLeft: "3px solid #B87333" }}>
                    <p className="mb-4 text-sm leading-relaxed" style={{ color: "#5C3A1E" }}><strong className="text-primary">{tr("Preparació prèvia:", "Preparación previa:")}</strong> {dinamica.prep}</p>
                    <p className="mb-3 text-sm font-semibold text-primary">{tr("Desenvolupament:", "Desarrollo:")}</p>
                    <ol className="mb-4 pl-5 text-sm leading-relaxed" style={{ color: "#5C3A1E" }}>
                      {dinamica.steps.map((step, i) => (
                        <li key={i} className="mb-2"><strong className="text-primary">{step.time}</strong> — {step.desc}</li>
                      ))}
                    </ol>
                    <p className="mb-3 text-sm font-semibold text-primary">{tr("Preguntes de tancament", "Preguntas de cierre")} ({tr("queden a la pissarra tota la setmana", "quedan en la pizarra toda la semana")}):</p>
                    <ul className="pl-5 font-serif text-base italic text-primary">
                      {dinamica.closing.map((q, i) => <li key={i} className="mb-1.5">{q}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              /* PAYWALL */
              <div className="mt-8">
                <div className="h-16" style={{ background: "linear-gradient(to bottom, transparent, #F5EFE6)", marginTop: "-40px", position: "relative", zIndex: 1 }} />
                <div className="p-8 text-center" style={{ background: "#2C1810", color: "#F5EFE6" }}>
                  <p className="mb-5 font-serif text-lg italic" style={{ color: "rgba(245,239,230,0.85)" }}>
                    {tr("La reflexió completa i la dinàmica de grup per treballar aquesta pregunta amb el teu equip estan ", "La reflexión completa y la dinámica de grupo para trabajar esta pregunta con tu equipo están ")}
                    <em style={{ color: "#D9A574", fontWeight: 500, fontStyle: "normal" }}>{tr("reservades a subscriptors Premium", "reservadas a suscriptores Premium")}</em>.
                  </p>
                  <button onClick={() => setPreusOpen(true)} className="px-8 py-3.5 text-sm font-semibold text-white" style={{ background: "#B87333" }}>{tr("Fes-te Premium · 29€/mes", "Hazte Premium · 29€/mes")}</button>
                  <p className="mt-3 font-serif text-sm italic" style={{ color: "rgba(245,239,230,0.5)" }}>{tr("Durant els dos primers mesos de Criteri ESG gaudiràs de les avantatges Premium sense cost.", "Durante los dos primeros meses de Criteri ESG disfrutarás de las ventajas Premium sin coste.")}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
    </div>
  );
}
