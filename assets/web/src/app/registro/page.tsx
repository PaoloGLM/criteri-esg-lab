"use client";

/**
 * /registro — Flux d'alta d'usuaris de Criteri ESG.
 *
 * MARCA: paleta oficial v7 (PALETA-COLORS.md) + tipografies oficials
 * (TIPOGRAFIES.md): Newsreader (títols), DM Sans (cos), JetBrains Mono
 * (labels). Autocontingut: no depèn dels tokens antics de globals.css.
 *
 * SEGURETAT/UX (patrons 2026 — NIST 800-63B, Linear/Vercel):
 * - Assistent 3 passos, validació progressiva (zod compartit)
 * - Contrasenya escollida per l'usuari + medidor força + check HIBP
 *   k-anonymity via /api/password-check
 * - Anti-enumeració: pantalla final idèntica si l'email ja existia
 */

import { Newsreader, DM_Sans, JetBrains_Mono } from "next/font/google";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { identitySchema, passwordSchema, localStrength } from "@/lib/validation";

/* Tipografies oficials (TIPOGRAFIES.md) — autoallotjades per next/font
   (la CSP de producció bloqueja fonts.googleapis.com; next/font serveix
   els fitxers des del mateix domini, sense CSP ni FOUT). */
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  variable: "--rg-font-display",
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--rg-font-body",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--rg-font-mono",
  display: "swap",
});

type Step = 1 | 2 | 3;

const SECTORS = [
  "Alimentació",
  "Energia",
  "Finançament / Assegurances",
  "Industrial",
  "Serveis professionals",
  "Tecnologia",
  "Tercer sector",
  "Administració pública",
  "Altres",
];

const INTERESTS = [
  { id: "clima", label: "Clima i transició" },
  { id: "social", label: "Social i laboral" },
  { id: "cadena", label: "Cadena de subministrament" },
  { id: "estandards", label: "Estàndards i certificacions" },
  { id: "regulacio", label: "Regulació (CSRD, Omnibus…)" },
] as const;

/* Paleta oficial v7 — PALETA-COLORS.md */
const C = {
  ink: "#26312B",
  inkDeep: "#141B18",
  inkSoft: "#4A5F53",
  accent: "#5E8772",
  verdClar: "#AAC9B6",
  bg: "#F2F5F1",
  paper: "#FFFFFF",
  highlight: "#F5E381",
} as const;

export default function RegistroPage() {
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [demo, setDemo] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [company, setCompany] = useState("");
  const [sector, setSector] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [newsletter, setNewsletter] = useState(true);
  const [gdpr, setGdpr] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pwCheck, setPwCheck] = useState<
    | { state: "idle" }
    | { state: "checking" }
    | { state: "unknown" }
    | { state: "ok" }
    | { state: "compromised"; count: number }
  >({ state: "idle" });
  const [capsOn, setCapsOn] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const sectorRef = useRef<HTMLSelectElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => setDemo(!isSupabaseConfigured()), []);

  useEffect(() => {
    if (done) doneRef.current?.focus();
    else if (step === 1) nameRef.current?.focus();
    else if (step === 2) pwRef.current?.focus();
    else sectorRef.current?.focus();
  }, [step, done]);

  const strength = useMemo(() => localStrength(password), [password]);

  useEffect(() => {
    if (step !== 2 || password.length < 8) {
      setPwCheck({ state: "idle" });
      return;
    }
    const t = setTimeout(async () => {
      try {
        setPwCheck({ state: "checking" });
        const res = await fetch("/api/password-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPwCheck(
          data.compromised
            ? { state: "compromised", count: data.count }
            : data.unknown
              ? { state: "unknown" }
              : { state: "ok" }
        );
      } catch {
        setPwCheck({ state: "unknown" });
      }
    }, 600);
    return () => clearTimeout(t);
  }, [password, step]);

  const goStep1to2 = () => {
    const parsed = identitySchema.safeParse({ fullName, email });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] = issue.message;
      setErrors(errs);
      return;
    }
    setFullName(parsed.data.fullName);
    setEmail(parsed.data.email);
    setErrors({});
    setStep(2);
  };

  const goStep2to3 = () => {
    const parsedPw = passwordSchema.safeParse(password);
    if (!parsedPw.success) {
      setErrors({ password: parsedPw.error.issues[0].message });
      return;
    }
    if (strength.score <= 1) {
      setErrors({ password: "Massa feble: allarga-la o barreja-hi tipus de caràcters" });
      return;
    }
    if (pwCheck.state === "compromised") {
      setErrors({
        password: `Apareix en ${pwCheck.count.toLocaleString("ca-ES")} filtracions conegudes. Tria'n una de diferent.`,
      });
      return;
    }
    setErrors({});
    setStep(3);
  };

  const finish = useCallback(async () => {
    if (!gdpr) {
      setErrors({ gdpr: "Cal acceptar el tractament de dades per continuar" });
      return;
    }
    setErrors({});
    setSubmitting(true);

    const userData = {
      full_name: fullName.trim(),
      company: company.trim(),
      sector,
      interests,
      newsletter_subscribed: newsletter,
      newsletter_language: "es" as const,
      gdpr_consent: true,
      gdpr_consent_at: new Date().toISOString(),
      plan: "free" as const,
    };

    try {
      if (demo) {
        await new Promise((r) => setTimeout(r, 700));
        setSubmitting(false);
        setDone(true);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/cuenta`
              : undefined,
        },
      });

      if (newsletter) {
        fetch("/api/brevo-subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name: fullName.trim(), lang: "es" }),
        }).catch(() => {});
      }

      setSubmitting(false);
      setDone(true); // anti-enumeració: èxit sempre
      if (error && !/already|registered|exists/i.test(error.message)) {
        console.error("[registro] error de registre:", error.message);
      }
    } catch {
      setSubmitting(false);
      setDone(true);
    }
  }, [company, demo, email, fullName, gdpr, interests, newsletter, password, sector]);

  return (
    <>
      {/* Tipografies oficials (TIPOGRAFIES.md) via next/font: autoallotjades
          (la CSP bloqueja fonts.googleapis.com i així no cal obrir-la) */}
      <style>{`
        .rg { background:${C.bg}; color:${C.ink}; font-family:var(--rg-font-body),'DM Sans',system-ui,sans-serif; }
        .rg-serif { font-family:var(--rg-font-display),'Newsreader',Georgia,serif; }
        .rg-mono { font-family:var(--rg-font-mono),'JetBrains Mono',Consolas,monospace; }
        .rg-field {
          width:100%; border-radius:8px; border:1px solid rgba(38,49,43,.22);
          background:${C.paper}; padding:12px 14px; font-size:15px; color:${C.ink};
          outline:none; transition:border-color .15s, box-shadow .15s;
          font-family:var(--rg-font-body),'DM Sans',system-ui,sans-serif;
        }
        .rg-field::placeholder { color:rgba(74,95,83,.5); }
        .rg-field:focus { border-color:${C.accent}; box-shadow:0 0 0 3px rgba(94,135,114,.18); }
        .rg-field[aria-invalid="true"] { border-color:#A0522D; box-shadow:0 0 0 3px rgba(160,82,45,.14); }
        .rg-label {
          display:block; margin-bottom:6px; font-family:'JetBrains Mono',monospace;
          font-size:10.5px; font-weight:600; letter-spacing:.16em; text-transform:uppercase;
          color:${C.inkSoft};
        }
        .rg-btn {
          display:inline-flex; align-items:center; justify-content:center; gap:6px;
          background:${C.accent}; color:#fff; border:none; cursor:pointer;
          font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:600;
          letter-spacing:.05em; padding:14px 22px; border-radius:8px;
          transition:transform .12s, box-shadow .12s, background .12s;
        }
        .rg-btn:hover { background:#527A66; transform:translateY(-1px); box-shadow:0 6px 16px rgba(94,135,114,.3); }
        .rg-btn:disabled { opacity:.55; cursor:default; transform:none; box-shadow:none; }
        .rg-btn-ghost {
          background:transparent; color:${C.ink}; border:1px solid rgba(38,49,43,.25);
        }
        .rg-btn-ghost:hover { background:rgba(38,49,43,.05); box-shadow:none; }
        .rg-err { margin-top:6px; font-size:12.5px; color:#A0522D; font-weight:500; }
        .rg-chip {
          border:1px solid rgba(38,49,43,.22); background:${C.paper}; color:${C.inkSoft};
          border-radius:99px; padding:7px 14px; font-size:12.5px; font-weight:500;
          cursor:pointer; transition:all .12s; font-family:'DM Sans',sans-serif;
        }
        .rg-chip:hover { border-color:${C.accent}; color:${C.ink}; }
        .rg-chip[aria-pressed="true"] { background:${C.accent}; border-color:${C.accent}; color:#fff; }
      `}</style>

      <div
        className={`rg flex min-h-screen flex-col ${newsreader.variable} ${dmSans.variable} ${jetbrains.variable}`}
      >
        <Header />

        <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:py-14">
          <div
            className="grid w-full max-w-5xl overflow-hidden rounded-xl lg:grid-cols-[1.05fr_0.95fr]"
            style={{ background: C.paper, boxShadow: "0 2px 20px rgba(20,27,24,.09)" }}
          >
            {/* ════ Formulari ════ */}
            <div className="p-7 sm:p-10">
              {!done ? (
                <>
                  <div className="mb-8 flex items-center gap-2" aria-label={`Pas ${step} de 3`}>
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className="h-1 flex-1 rounded-full transition-colors"
                        style={{ background: s <= step ? C.accent : "rgba(38,49,43,.12)" }}
                      />
                    ))}
                    <span className="rg-mono ml-2 text-[10px] tracking-[0.18em]" style={{ color: C.inkSoft }}>
                      {step}/3
                    </span>
                  </div>

                  {step === 1 && (
                    <section aria-labelledby="s1">
                      <p className="rg-mono mb-3 text-[10.5px] font-semibold uppercase tracking-[0.2em]" style={{ color: C.accent }}>
                        Registre · Pla Free
                      </p>
                      <h1 id="s1" className="rg-serif text-[26px] font-medium leading-tight sm:text-[32px]" style={{ color: C.inkDeep }}>
                        Comencem pel bàsic.
                      </h1>
                      <p className="mt-2.5 text-[14.5px] leading-relaxed" style={{ color: C.inkSoft }}>
                        Nom i correu. Sense targeta, sense compromís: el pla Free és gratis sempre.
                      </p>

                      <form
                        className="mt-7 space-y-5"
                        onSubmit={(e) => {
                          e.preventDefault();
                          goStep1to2();
                        }}
                      >
                        <div>
                          <label htmlFor="fullName" className="rg-label">Nom i cognoms</label>
                          <input
                            ref={nameRef}
                            id="fullName"
                            name="name"
                            autoComplete="name"
                            className="rg-field"
                            placeholder="Maria Puig"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            aria-invalid={!!errors.fullName}
                            aria-describedby={errors.fullName ? "err-name" : undefined}
                          />
                          {errors.fullName && (
                            <p id="err-name" role="alert" className="rg-err">{errors.fullName}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="email" className="rg-label">Correu professional</label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            spellCheck={false}
                            className="rg-field"
                            placeholder="maria@empresa.cat"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? "err-email" : undefined}
                          />
                          {errors.email && (
                            <p id="err-email" role="alert" className="rg-err">{errors.email}</p>
                          )}
                          <p className="mt-1.5 text-xs" style={{ color: C.inkSoft }}>
                            Hi enviarem un enllaç de confirmació. Mai spam.
                          </p>
                        </div>

                        <button type="submit" className="rg-btn w-full">Continuar →</button>
                      </form>
                    </section>
                  )}

                  {step === 2 && (
                    <section aria-labelledby="s2">
                      <p className="rg-mono mb-3 text-[10.5px] font-semibold uppercase tracking-[0.2em]" style={{ color: C.accent }}>
                        Registre · 2 de 3
                      </p>
                      <h1 id="s2" className="rg-serif text-[26px] font-medium leading-tight sm:text-[32px]" style={{ color: C.inkDeep }}>
                        Tria una contrasenya llarga.
                      </h1>
                      <p className="mt-2.5 text-[14.5px] leading-relaxed" style={{ color: C.inkSoft }}>
                        Consell honest: una frase amb espais és més segura que una contrasenya curta amb símbols. Mínim 12 caràcters.
                      </p>

                      <form
                        className="mt-7 space-y-5"
                        onSubmit={(e) => {
                          e.preventDefault();
                          goStep2to3();
                        }}
                      >
                        <div>
                          <label htmlFor="password" className="rg-label">Contrasenya</label>
                          <div className="relative">
                            <input
                              ref={pwRef}
                              id="password"
                              name="new-password"
                              type={showPw ? "text" : "password"}
                              autoComplete="new-password"
                              className="rg-field"
                              style={{ paddingRight: 76 }}
                              placeholder="p. ex. cafè-salvia-tarda-42"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              onKeyUp={(e) => setCapsOn(e.getModifierState?.("CapsLock") ?? false)}
                              aria-invalid={!!errors.password}
                              aria-describedby="pw-strength"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPw((v) => !v)}
                              className="rg-mono absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-[11px] uppercase tracking-wider"
                              style={{ color: C.inkSoft, background: "transparent", border: "none", cursor: "pointer" }}
                              aria-pressed={showPw}
                            >
                              {showPw ? "Amaga" : "Mostra"}
                            </button>
                          </div>

                          <div id="pw-strength" className="mt-2.5">
                            <div className="flex gap-1" aria-hidden="true">
                              {[0, 1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className="h-1.5 flex-1 rounded-full transition-colors"
                                  style={{
                                    background:
                                      strength.score >= i + 1
                                        ? strength.score <= 1
                                          ? "#A0522D"
                                          : strength.score === 2
                                            ? "#C9A961"
                                            : C.accent
                                        : "rgba(38,49,43,.12)",
                                  }}
                                />
                              ))}
                            </div>
                            <div className="mt-1.5 min-h-4 text-xs" role="status" aria-live="polite">
                              {strength.label && (
                                <span className="font-medium" style={{ color: C.ink }}>Força: {strength.label}.</span>
                              )}{" "}
                              {strength.hints[0] && <span style={{ color: C.inkSoft }}>{strength.hints[0]}</span>}
                              {capsOn && <span style={{ color: "#8A6D1F" }}> · Bloq Maj activat</span>}
                            </div>
                          </div>

                          <div className="mt-1 min-h-5 text-xs" role="status" aria-live="polite">
                            {pwCheck.state === "checking" && (
                              <span style={{ color: C.inkSoft }}>Comprovant bases de filtracions públiques…</span>
                            )}
                            {pwCheck.state === "compromised" && (
                              <span className="font-medium" style={{ color: "#A0522D" }}>
                                ⚠ Apareix en {pwCheck.count.toLocaleString("ca-ES")} filtracions conegudes — millor tria'n una altra
                              </span>
                            )}
                            {pwCheck.state === "ok" && (
                              <span style={{ color: C.accent }}>✓ No consta a cap filtració pública coneguda</span>
                            )}
                            {pwCheck.state === "unknown" && (
                              <span style={{ color: C.inkSoft }}>No hem pogut comprovar les filtracions ara mateix.</span>
                            )}
                          </div>

                          {errors.password && <p role="alert" className="rg-err">{errors.password}</p>}
                        </div>

                        <div className="flex gap-3">
                          <button type="button" onClick={() => setStep(1)} className="rg-btn rg-btn-ghost">← Enrere</button>
                          <button type="submit" className="rg-btn flex-1">Continuar →</button>
                        </div>
                      </form>
                    </section>
                  )}

                  {step === 3 && (
                    <section aria-labelledby="s3">
                      <p className="rg-mono mb-3 text-[10.5px] font-semibold uppercase tracking-[0.2em]" style={{ color: C.accent }}>
                        Registre · 3 de 3
                      </p>
                      <h1 id="s3" className="rg-serif text-[26px] font-medium leading-tight sm:text-[32px]" style={{ color: C.inkDeep }}>
                        Personalitza el que rebràs.
                      </h1>
                      <p className="mt-2.5 text-[14.5px] leading-relaxed" style={{ color: C.inkSoft }}>
                        Tot això ho pots canviar després des del teu compte.
                      </p>

                      <form
                        className="mt-7 space-y-5"
                        onSubmit={(e) => {
                          e.preventDefault();
                          finish();
                        }}
                      >
                        <div>
                          <label htmlFor="company" className="rg-label">
                            Empresa <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>(opcional)</span>
                          </label>
                          <input
                            id="company"
                            name="organization"
                            autoComplete="organization"
                            className="rg-field"
                            placeholder="Acme S.L."
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                          />
                        </div>

                        <div>
                          <label htmlFor="sector" className="rg-label">
                            Sector <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>(opcional)</span>
                          </label>
                          <select
                            ref={sectorRef}
                            id="sector"
                            className="rg-field"
                            value={sector}
                            onChange={(e) => setSector(e.target.value)}
                          >
                            <option value="">— Tria, si vols —</option>
                            {SECTORS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>

                        <fieldset>
                          <legend className="rg-label">
                            Interessos <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>(opcional)</span>
                          </legend>
                          <div className="flex flex-wrap gap-2">
                            {INTERESTS.map((it) => (
                              <button
                                key={it.id}
                                type="button"
                                className="rg-chip"
                                aria-pressed={interests.includes(it.id)}
                                onClick={() =>
                                  setInterests((prev) =>
                                    prev.includes(it.id)
                                      ? prev.filter((x) => x !== it.id)
                                      : [...prev, it.id]
                                  )
                                }
                              >
                                {interests.includes(it.id) ? "✓ " : ""}{it.label}
                              </button>
                            ))}
                          </div>
                        </fieldset>

                        <div className="space-y-3 rounded-lg p-4" style={{ background: C.bg, border: `1px solid rgba(38,49,43,.12)` }}>
                          <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug">
                            <input
                              type="checkbox"
                              checked={newsletter}
                              onChange={(e) => setNewsletter(e.target.checked)}
                              className="mt-0.5 size-4 shrink-0"
                              style={{ accentColor: C.accent }}
                            />
                            <span>
                              Rebre <strong style={{ fontWeight: 600 }}>La Quinzena</strong>: els informes nous, cada 15 dies. Sense soroll diari.
                            </span>
                          </label>
                          <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug">
                            <input
                              type="checkbox"
                              checked={gdpr}
                              onChange={(e) => setGdpr(e.target.checked)}
                              aria-invalid={!!errors.gdpr}
                              className="mt-0.5 size-4 shrink-0"
                              style={{ accentColor: C.accent }}
                            />
                            <span>
                              He llegit i accepto la{" "}
                              <a href="/privacidad" target="_blank" style={{ color: C.accent, textDecoration: "underline", textUnderlineOffset: 2 }}>
                                política de privacitat
                              </a>{" "}
                              i el tractament de les meves dades segons el RGPD. *
                            </span>
                          </label>
                          {errors.gdpr && <p role="alert" className="rg-err">{errors.gdpr}</p>}
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            disabled={submitting}
                            className="rg-btn rg-btn-ghost"
                          >
                            ← Enrere
                          </button>
                          <button type="submit" disabled={submitting} className="rg-btn flex-1">
                            {submitting ? "Creant el compte…" : "Crear el meu compte"}
                          </button>
                        </div>
                      </form>
                    </section>
                  )}
                </>
              ) : (
                <section ref={doneRef} tabIndex={-1} aria-labelledby="ok" className="outline-none">
                  <div
                    className="rg-mono mb-5 flex size-12 items-center justify-center rounded-full text-xl"
                    style={{ background: C.bg, border: `1px solid rgba(38,49,43,.15)` }}
                    aria-hidden="true"
                  >
                    ✉️
                  </div>
                  <h1 id="ok" className="rg-serif text-[26px] font-medium leading-tight sm:text-[32px]" style={{ color: C.inkDeep }}>
                    Últim pas: el teu correu.
                  </h1>
                  <p className="mt-3 text-[14.5px] leading-relaxed" style={{ color: C.inkSoft }}>
                    Si l'adreça era nova, t'hi ha arribat <strong style={{ fontWeight: 600, color: C.ink }}>un enllaç de confirmació</strong>. Fes clic i entra directament al teu compte.
                  </p>
                  <ul className="mt-5 space-y-2 rounded-lg p-4 text-sm" style={{ background: C.bg, border: `1px solid rgba(38,49,43,.12)`, color: C.inkSoft }}>
                    <li>· Revisa la carpeta de promocions o spam si triga uns minuts.</li>
                    <li>· L'enllaç caduca en 24 hores; en pots demanar un de nou des de l'accés.</li>
                    {demo && <li className="rg-mono text-xs">MODE DEMO: Supabase no està configurat en aquest entorn.</li>}
                  </ul>
                  <a href="/" className="rg-btn mt-6 inline-flex">Tornar a l'inici</a>
                </section>
              )}
            </div>

            {/* ════ Panell de valor (ink) ════ */}
            <aside
              className="relative hidden flex-col justify-between p-10 lg:flex"
              style={{ background: C.inkDeep, color: C.bg }}
              aria-hidden="true"
            >
              <div>
                <p className="rg-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: C.verdClar }}>
                  Criteri ESG · Pla Free
                </p>
                <p className="rg-serif mt-6 text-[30px] font-medium leading-snug">
                  El context ESG,
                  <br />
                  destil·lat en <em style={{ color: C.verdClar }}>cinc minuts</em>.
                </p>
                <ul className="mt-9 space-y-6 text-sm leading-relaxed" style={{ color: "rgba(242,245,241,.85)" }}>
                  {[
                    "Informes institucionals destil·lats en 8 blocs fixos, màxim 1.100 paraules.",
                    "Cada dada amb la pàgina exacta de l'original. Zero invencions.",
                    "Un semàfor metodològic que avalua cada informe abans que hi perdis el temps.",
                  ].map((t) => (
                    <li key={t.slice(0, 12)} className="flex gap-3">
                      <span
                        className="rg-mono mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[11px]"
                        style={{ background: "rgba(170,201,182,.18)", color: C.verdClar }}
                      >
                        ✓
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 pt-6" style={{ borderTop: "1px solid rgba(170,201,182,.22)" }}>
                <p className="rg-serif text-lg italic" style={{ color: C.verdClar }}>
                  "Més enllà del checkbox."
                </p>
                <p className="rg-mono mt-1.5 text-[10px] uppercase tracking-[0.18em]" style={{ color: "rgba(242,245,241,.55)" }}>
                  Rigor · Frescor · Sobrietat
                </p>
              </div>
            </aside>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
