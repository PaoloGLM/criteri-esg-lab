"use client";

/**
 * /registro — Flux d'alta d'usuaris de Criteri ESG.
 *
 * Disseny (patrons 2026 — Linear/Vercel/NIST 800-63B):
 * - Assistent en 3 passos (identitat → contrasenya → preferències): un camp
 *   nou per pantalla redueix l'abandonament i permet validació progressiva.
 * - Contrasenya ESCOLLIDA per l'usuari (no temporal com al modal antic),
 *   amb medidor de força local + comprovació de filtracions públiques
 *   via /api/password-check (k-anonymity: mai surt la contrasenya sencera).
 * - Protecció anti-enumeració: el missatge final és idèntic si l'email ja
 *   existia (no es filtra quins comptes hi ha).
 * - Accessibilitat: labels reals, aria-invalid/describedby, focus gestionat
 *   entre passos, autocomplete correcte (gestors de contrasenyes feliços).
 *
 * SEGURETAT:
 * - La validació (zod) viu a lib/validation.ts i es reaplica SEMPRE aquí;
 *   el servidor (trigger handle_new_user + RLS) és l'última barrera.
 * - Cap secret al client: tot passa pel client anon de Supabase.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  identitySchema,
  passwordSchema,
  localStrength,
} from "@/lib/validation";

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

export default function RegistroPage() {
  // ── Estat de flux ────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [demo, setDemo] = useState(false);

  // ── Camps ────────────────────────────────────────────────────────────────
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [company, setCompany] = useState("");
  const [sector, setSector] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [newsletter, setNewsletter] = useState(true); // decisió editorial: ON per defecte
  const [gdpr, setGdpr] = useState(false);

  // ── Errors i verificacions ──────────────────────────────────────────────
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
  const companyRef = useRef<HTMLSelectElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDemo(!isSupabaseConfigured());
  }, []);

  // Focus al primer camp de cada pas (accessibilitat)
  useEffect(() => {
    if (step === 1) nameRef.current?.focus();
    if (step === 2) pwRef.current?.focus();
    if (step === 3) companyRef.current?.focus();
    if (done) doneRef.current?.focus();
  }, [step, done]);

  const strength = useMemo(() => localStrength(password), [password]);

  // ── Comprovació HIBP (debounced) ────────────────────────────────────────
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

  // ── Passos ──────────────────────────────────────────────────────────────
  const goStep1to2 = () => {
    const parsed = identitySchema.safeParse({ fullName, email });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[String(issue.path[0])] = issue.message;
      }
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
      setErrors({
        password:
          "Aquesta contrasenya és massa feble: allarga-la o barreja-hi tipus de caràcters",
      });
      return;
    }
    if (pwCheck.state === "compromised") {
      setErrors({
        password: `Aquesta contrasenya apareix en ${pwCheck.count.toLocaleString("ca-ES")} filtracions conegudes. Tria'n una de diferent.`,
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
        // Mode sense Supabase configurat: simulem èxit per poder veure el flux
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

      // Apuntar a Brevo (no bloqueja si falla)
      if (newsletter) {
        fetch("/api/brevo-subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name: fullName.trim(), lang: "es" }),
        }).catch(() => {});
      }

      setSubmitting(false);
      // Èxit SEMPRE (anti-enumeració): Supabase retorna error "User already
      // registered" — no el destapem a l'usuari; el correu de confirmació
      // només arriba si el compte era nou.
      setDone(true);
      if (error && !/already|registered|exists/i.test(error.message)) {
        console.error("[registro] error de registre:", error.message);
      }
    } catch {
      setSubmitting(false);
      setDone(true); // mateixa superfície d'informació
    }
  }, [company, demo, email, fullName, gdpr, interests, newsletter, password, sector]);

  // ── UI helpers ──────────────────────────────────────────────────────────
  const fieldCls =
    "w-full rounded-md border border-input bg-card px-3 py-2.5 text-[15px] text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30";
  const errCls = "mt-1.5 text-xs text-red-600 dark:text-red-400";
  const mono = "font-mono text-[10px] uppercase tracking-[0.18em]";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:py-16">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-xl border border-border bg-card shadow-sm lg:grid-cols-[1.05fr_0.95fr]">

          {/* ════ Columna esquerra: formulari ════ */}
          <div className="p-7 sm:p-10">
            {!done ? (
              <>
                {/* Progressió */}
                <div className="mb-8 flex items-center gap-2" aria-label={`Pas ${step} de 3`}>
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        s <= step ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                  <span className={`${mono} ml-2 text-muted-foreground`}>
                    {step}/3
                  </span>
                </div>

                {step === 1 && (
                  <section aria-labelledby="s1">
                    <h1 id="s1" className="font-serif text-2xl font-semibold tracking-tight text-card-foreground sm:text-3xl">
                      Comencem pel bàsic.
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Nom i correu. Sense targeta, sense compromís: el pla Free
                      és gratis sempre.
                    </p>

                    <form
                      className="mt-7 space-y-5"
                      onSubmit={(e) => {
                        e.preventDefault();
                        goStep1to2();
                      }}
                    >
                      <div>
                        <label htmlFor="fullName" className={`${mono} mb-1.5 block text-foreground/80`}>
                          Nom i cognoms
                        </label>
                        <input
                          ref={nameRef}
                          id="fullName"
                          name="name"
                          autoComplete="name"
                          className={fieldCls}
                          placeholder="Maria Puig"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          aria-invalid={!!errors.fullName}
                          aria-describedby={errors.fullName ? "err-name" : undefined}
                        />
                        {errors.fullName && (
                          <p id="err-name" role="alert" className={errCls}>{errors.fullName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className={`${mono} mb-1.5 block text-foreground/80`}>
                          Correu professional
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          spellCheck={false}
                          className={fieldCls}
                          placeholder="maria@empresa.cat"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "err-email" : undefined}
                        />
                        {errors.email && (
                          <p id="err-email" role="alert" className={errCls}>{errors.email}</p>
                        )}
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          Hi enviarem un enllaç de confirmació. Mai spam.
                        </p>
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        Continuar →
                      </button>
                    </form>
                  </section>
                )}

                {step === 2 && (
                  <section aria-labelledby="s2">
                    <h1 id="s2" className="font-serif text-2xl font-semibold tracking-tight text-card-foreground sm:text-3xl">
                      Tria una contrasenya llarga.
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Consell honest: una frase amb espais és més segura que una
                      contrasenya curta amb símbols. Mínim 12 caràcters.
                    </p>

                    <form
                      className="mt-7 space-y-5"
                      onSubmit={(e) => {
                        e.preventDefault();
                        goStep2to3();
                      }}
                    >
                      <div>
                        <label htmlFor="password" className={`${mono} mb-1.5 block text-foreground/80`}>
                          Contrasenya
                        </label>
                        <div className="relative">
                          <input
                            ref={pwRef}
                            id="password"
                            name="new-password"
                            type={showPw ? "text" : "password"}
                            autoComplete="new-password"
                            className={`${fieldCls} pr-20`}
                            placeholder="p. ex. cafè-salvia-tarda-42"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyUp={(e) =>
                              setCapsOn(e.getModifierState?.("CapsLock") ?? false)
                            }
                            aria-invalid={!!errors.password}
                            aria-describedby="pw-strength"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPw((v) => !v)}
                            className="absolute inset-y-0 right-2 my-auto h-8 rounded px-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:bg-muted"
                            aria-pressed={showPw}
                          >
                            {showPw ? "Amaga" : "Mostra"}
                          </button>
                        </div>

                        {/* Medidor de força */}
                        <div id="pw-strength" className="mt-2.5">
                          <div className="flex gap-1" aria-hidden="true">
                            {[0, 1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition-colors ${
                                  strength.score >= i + 1
                                    ? strength.score <= 1
                                      ? "bg-red-500"
                                      : strength.score === 2
                                        ? "bg-yellow-500"
                                        : strength.score === 3
                                          ? "bg-emerald-600"
                                          : "bg-emerald-500"
                                    : "bg-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="mt-1.5 min-h-4 text-xs" role="status" aria-live="polite">
                            {strength.label && (
                              <span className="font-medium text-card-foreground">
                                Força: {strength.label}.
                              </span>
                            )}{" "}
                            {strength.hints[0] && (
                              <span className="text-muted-foreground">{strength.hints[0]}</span>
                            )}
                            {capsOn && (
                              <span className="ml-1 text-yellow-700 dark:text-yellow-400">
                                Bloq Maj activat
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Verificació de filtracions */}
                        <div className="min-h-5 mt-1 text-xs" role="status" aria-live="polite">
                          {pwCheck.state === "checking" && (
                            <span className="text-muted-foreground">Comprovant bases de filtracions públiques…</span>
                          )}
                          {pwCheck.state === "compromised" && (
                            <span className="font-medium text-red-600 dark:text-red-400">
                              ⚠ Apareix en {pwCheck.count.toLocaleString("ca-ES")} filtracions conegudes — millor tria-ne una altra
                            </span>
                          )}
                          {pwCheck.state === "ok" && (
                            <span className="text-emerald-700 dark:text-emerald-400">
                              ✓ No consta a cap filtració pública coneguda
                            </span>
                          )}
                          {pwCheck.state === "unknown" && (
                            <span className="text-muted-foreground">No hem pogut comprovar les filtracions ara mateix.</span>
                          )}
                        </div>

                        {errors.password && (
                          <p role="alert" className={errCls}>{errors.password}</p>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="rounded-md border border-input px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                        >
                          ← Enrere
                        </button>
                        <button
                          type="submit"
                          className="flex-1 rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                          Continuar →
                        </button>
                      </div>
                    </form>
                  </section>
                )}

                {step === 3 && (
                  <section aria-labelledby="s3">
                    <h1 id="s3" className="font-serif text-2xl font-semibold tracking-tight text-card-foreground sm:text-3xl">
                      Últim pas: personalitza el que rebràs.
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
                        <label htmlFor="company" className={`${mono} mb-1.5 block text-foreground/80`}>
                          Empresa <span className="normal-case text-muted-foreground">(opcional)</span>
                        </label>
                        <input
                          id="company"
                          name="organization"
                          autoComplete="organization"
                          className={fieldCls}
                          placeholder="Acme S.L."
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="sector" className={`${mono} mb-1.5 block text-foreground/80`}>
                          Sector <span className="normal-case text-muted-foreground">(opcional)</span>
                        </label>
                        <select
                          ref={companyRef}
                          id="sector"
                          className={fieldCls}
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
                        <legend className={`${mono} mb-2 text-foreground/80`}>
                          Interessos <span className="normal-case text-muted-foreground">(opcional)</span>
                        </legend>
                        <div className="flex flex-wrap gap-2">
                          {INTERESTS.map((it) => {
                            const on = interests.includes(it.id);
                            return (
                              <button
                                key={it.id}
                                type="button"
                                aria-pressed={on}
                                onClick={() =>
                                  setInterests((prev) =>
                                    on ? prev.filter((x) => x !== it.id) : [...prev, it.id]
                                  )
                                }
                                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                                  on
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-input text-muted-foreground hover:border-ring hover:text-foreground"
                                }`}
                              >
                                {on ? "✓ " : ""}{it.label}
                              </button>
                            );
                          })}
                        </div>
                      </fieldset>

                      <div className="space-y-3 rounded-lg border border-border bg-background p-4">
                        <label className="flex cursor-pointer items-start gap-3 text-sm">
                          <input
                            type="checkbox"
                            checked={newsletter}
                            onChange={(e) => setNewsletter(e.target.checked)}
                            className="mt-0.5 size-4 accent-current"
                          />
                          <span className="leading-snug text-card-foreground">
                            Rebre <strong className="font-semibold">La Quinzena</strong>:
                            els informes nous, cada 15 dies. Sense soroll diari.
                          </span>
                        </label>
                        <label className="flex cursor-pointer items-start gap-3 text-sm">
                          <input
                            type="checkbox"
                            checked={gdpr}
                            onChange={(e) => setGdpr(e.target.checked)}
                            aria-invalid={!!errors.gdpr}
                            className="mt-0.5 size-4 accent-current"
                          />
                          <span className="leading-snug text-card-foreground">
                            He llegit i accepto la{" "}
                            <a href="/privacidad" className="underline underline-offset-2 hover:text-primary" target="_blank">
                              política de privacitat
                            </a>{" "}
                            i el tractament de les meves dades segons el RGPD. *
                          </span>
                        </label>
                        {errors.gdpr && <p role="alert" className={errCls}>{errors.gdpr}</p>}
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          disabled={submitting}
                          className="rounded-md border border-input px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
                        >
                          ← Enrere
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                          {submitting ? "Creant el compte…" : "Crear el meu compte"}
                        </button>
                      </div>
                    </form>
                  </section>
                )}
              </>
            ) : (
              /* ── Confirmació (idèntica si l'email existia: anti-enumeració) ── */
              <section ref={doneRef} tabIndex={-1} aria-labelledby="ok" className="outline-none">
                <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full border border-border bg-background text-xl" aria-hidden="true">
                  ✉️
                </div>
                <h1 id="ok" className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                  Últim pas: el teu correu.
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Si l'adreça era nova, t'hi ha arribat <strong className="font-medium text-card-foreground">un enllaç de confirmació</strong>.
                  Fes clic i entra directament al teu compte.
                </p>
                <ul className="mt-5 space-y-2 rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground">
                  <li>· Revisa la carpeta de promocions o spam si triga uns minuts.</li>
                  <li>· L'enllaç caduca en 24 hores; en pots demanar un de nou des de l'accés.</li>
                  {demo && (
                    <li className="font-mono text-xs">MODE DEMO: Supabase no està configurat en aquest entorn.</li>
                  )}
                </ul>
                <a
                  href="/"
                  className="mt-6 inline-block rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Tornar a l'inici
                </a>
              </section>
            )}
          </div>

          {/* ════ Columna dreta: valor (fosc) ════ */}
          <aside className="relative hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex" aria-hidden="true">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-70">
                Criteri ESG · Pla Free
              </p>
              <p className="mt-6 font-serif text-3xl font-medium leading-snug">
                El context ESG,<br />destil·lat en cinc minuts.
              </p>
              <ul className="mt-9 space-y-6 text-sm leading-relaxed opacity-90">
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-white/15 font-mono text-[11px]">✓</span>
                  Informes institucionals destil·lats en 8 blocs fixos, màxim 1.100 paraules.
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-white/15 font-mono text-[11px]">✓</span>
                  Cada dada amb la pàgina exacta de l'original. Zero invencions.
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-white/15 font-mono text-[11px]">✓</span>
                  Un semàfor metodològic que avalua cada informe abans que hi perdis el temps.
                </li>
              </ul>
            </div>
            <div className="mt-10 border-t border-white/20 pt-6">
              <p className="font-serif text-lg italic opacity-90">
                "Més enllà del checkbox."
              </p>
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] opacity-60">
                Rigor · Frescor · Sobrietat
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
