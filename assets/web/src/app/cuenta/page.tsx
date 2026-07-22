"use client";

import { useState } from "react";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";
<<<<<<< Updated upstream
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  LogIn,
  LogOut,
  Save,
} from "lucide-react";
import type { TranslationKey } from "@/lib/i18n";

/**
 * /cuenta — Fase 2D redesign.
 *
 * Design source: /home/z/my-project/scripts/informe-variants/cuenta-redissenyat.html
 *
 * Layout: 2 cols
 *   - Sidebar dark (sticky, 320px): brand + user card + nav (6 items) + logout
 *   - Main content (5 cards):
 *       01 Perfil         — form: Nombre, Email, Empresa, Sector profesional
 *       02 Newsletter     — CAT/ES toggle + description
 *       03 Mi plan        — dark card with "Plan Free" + "Hazte Premium →"
 *       04 Mis estándares ESG — 16 chips with category color stripe + legend
 *       05 Otros intereses — 8 chips from registration form
 *
 * CRITICAL:
 *   - NO "Actividad" section (we don't store activity data).
 *   - 16 standards are ESG standard categories (5 reg + 5 fw + 6 cert).
 *   - 8 interests are from registration form (DIFFERENT from the 16 standards).
 *   - Chips are clickable with useState to track selected/unselected.
 *   - Auth checks (useAuth) and Supabase persistence preserved.
 */

// --- 16 ESG STANDARDS (same source as /estandares-esg) ---
type StandarType = "reg" | "fw" | "cert";
interface StandarChip {
  slug: string;
  name: string;
  type: StandarType;
}
const STANDARDS: StandarChip[] = [
  // 5 Regulaciones
=======
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

/**
 * /cuenta — Fase 2D redesign.
 * Design: /home/z/my-project/scripts/informe-variants/cuenta-redissenyat.html
 *
 * - Sidebar dark (sticky) amb logo + user card + nav (6 items) + logout
 * - 5 cards: Perfil / Newsletter / Mi plan / Mis estándares ESG (16) / Otros intereses (8)
 * - Sense apartat Activitat (no emmagatzemarem de moment)
 */
type StandarType = "reg" | "fw" | "cert";

const ESTANDARES: { slug: string; name: string; type: StandarType }[] = [
>>>>>>> Stashed changes
  { slug: "csrd-esrs", name: "CSRD / ESRS", type: "reg" },
  { slug: "csddd", name: "CSDDD", type: "reg" },
  { slug: "sfdr", name: "SFDR", type: "reg" },
  { slug: "taxonomia-ue", name: "Taxonomía UE", type: "reg" },
  { slug: "emas", name: "EMAS", type: "reg" },
<<<<<<< Updated upstream
  // 5 Frameworks
=======
>>>>>>> Stashed changes
  { slug: "gri", name: "GRI", type: "fw" },
  { slug: "sasb", name: "SASB", type: "fw" },
  { slug: "tnfd", name: "TNFD", type: "fw" },
  { slug: "tcfd", name: "TCFD", type: "fw" },
  { slug: "iso-26000", name: "ISO 26000", type: "fw" },
<<<<<<< Updated upstream
  // 6 Certificaciones
=======
>>>>>>> Stashed changes
  { slug: "ecovadis", name: "EcoVadis", type: "cert" },
  { slug: "b-corp", name: "B Corp", type: "cert" },
  { slug: "msci-esg", name: "MSCI ESG", type: "cert" },
  { slug: "cdp", name: "CDP", type: "cert" },
  { slug: "sge-21", name: "SGE 21", type: "cert" },
  { slug: "sustainalytics", name: "Sustainalytics", type: "cert" },
<<<<<<< Updated upstream
];

const TYPE_BORDER: Record<StandarType, string> = {
  reg: "#5C3A1E",
  fw: "#B87333",
  cert: "#E8C99A",
};

// --- 8 INTERESTS (from registration form, i18n keys form.interest.*) ---
const INTEREST_IDS: { id: string; labelKey: TranslationKey }[] = [
  { id: "csrd", labelKey: "form.interest.csrd" },
  { id: "ecovadis", labelKey: "form.interest.ecovadis" },
  { id: "bcorp", labelKey: "form.interest.bcorp" },
  { id: "msci", labelKey: "form.interest.msci" },
  { id: "taxonomy", labelKey: "form.interest.taxonomy" },
  { id: "csddd", labelKey: "form.interest.csddd" },
  { id: "humanrights", labelKey: "form.interest.humanrights" },
  { id: "climate", labelKey: "form.interest.climate" },
];

// --- Sidebar nav items (anchor links to sections by id) ---
const NAV_ITEMS: { num: string; href: string; labelKey: TranslationKey }[] = [
  { num: "01", href: "#perfil", labelKey: "v2.cuenta.nav.perfil" },
  { num: "02", href: "#newsletter", labelKey: "v2.cuenta.nav.newsletter" },
  { num: "03", href: "#pla", labelKey: "v2.cuenta.nav.pla" },
  { num: "04", href: "#estandares", labelKey: "v2.cuenta.nav.estandards" },
  { num: "05", href: "#interessos", labelKey: "v2.cuenta.nav.interessos" },
  { num: "06", href: "#billing", labelKey: "v2.cuenta.nav.billing" },
=======
>>>>>>> Stashed changes
];

const INTERESSOS = [
  { id: "csrd", key: "form.interest.csrd" as const },
  { id: "ecovadis", key: "form.interest.ecovadis" as const },
  { id: "bcorp", key: "form.interest.bcorp" as const },
  { id: "msci", key: "form.interest.msci" as const },
  { id: "taxonomy", key: "form.interest.taxonomy" as const },
  { id: "csddd", key: "form.interest.csddd" as const },
  { id: "humanrights", key: "form.interest.humanrights" as const },
  { id: "climate", key: "form.interest.climate" as const },
];

const CAT_TYPE_COLOR: Record<StandarType, string> = {
  reg: "#5C3A1E",
  fw: "#B87333",
  cert: "#E8C99A",
};

export default function CuentaPage() {
<<<<<<< Updated upstream
  const { user, session, loading, signOut, plan } = useAuth();
  const { t, lang } = useLanguage();
  const { toast } = useToast();
=======
  const { t } = useLanguage();
  const { user, plan } = useAuth();
  const router = useRouter();
>>>>>>> Stashed changes
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("perfil");
  const [selectedEstandards, setSelectedEstandards] = useState<string[]>(["csrd-esrs", "gri", "ecovadis"]);
  const [selectedInteressos, setSelectedInteressos] = useState<string[]>(["csrd", "ecovadis", "taxonomy", "climate"]);
  const [newsletterLang, setNewsletterLang] = useState<"ca" | "es">("es");

<<<<<<< Updated upstream
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Profile from `profiles` table
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [profileRefreshKey, setProfileRefreshKey] = useState(0);

  // Form state — all editable in place
  const [editName, setEditName] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editLanguage, setEditLanguage] = useState<"es" | "ca">("es");
  const [editInterests, setEditInterests] = useState<string[]>([]);
  // Standards chips — local state only (no DB column yet)
  const [editStandards, setEditStandards] = useState<string[]>([]);

  const meta = user?.user_metadata ?? {};
  const fullName: string = profile?.full_name ?? (meta.full_name ?? "");
  const company: string = profile?.company ?? (meta.company ?? "");
  const interests: string[] = Array.isArray(profile?.interests)
    ? profile.interests
    : Array.isArray(meta.interests)
      ? meta.interests
      : [];
  const newsletterLanguage: "es" | "ca" =
    profile?.newsletter_language ?? (meta.newsletter_language ?? "es");

  const email = user?.email ?? "";
  const userPlan: "free" | "premium" = plan ?? (meta.plan ?? "free");

  // Display name (for sidebar avatar): first letter of full_name, fallback "U"
  const avatarLetter = (fullName || "U").charAt(0).toUpperCase();

  // tr helper for non-i18n admin strings
  const tr = (ca: string, es: string) => (lang === "ca" ? ca : es);

  // Load profile from Supabase
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "full_name, company, interests, newsletter_language, newsletter_subscribed, gdpr_consent"
        )
        .eq("id", user.id)
        .maybeSingle();
      if (active && !error && data) {
        setProfile(data as ProfileRow);
      }
    })();
    return () => {
      active = false;
    };
  }, [user, profileRefreshKey]);

  // Initialize form state when profile loads
  useEffect(() => {
    setEditName(fullName);
    setEditCompany(company);
    setEditInterests(interests);
    setEditLanguage(newsletterLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullName, company, interests.join(","), newsletterLanguage]);

  /**Toggle an interest chip selected/unselected.*/
  const toggleInterest = (id: string) => {
    setEditInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  /**Toggle a standard chip selected/unselected (local state only).*/
  const toggleStandard = (slug: string) => {
    setEditStandards((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  /**Save changes to `profiles` table and Supabase Auth user_metadata.*/
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaveError(null);
    try {
      const payload = {
        full_name: editName,
        company: editCompany,
        interests: editInterests,
        newsletter_language: editLanguage,
      };

      const { error: dbError } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", user.id);
      if (dbError) throw dbError;

      const { error: authError } = await supabase.auth.updateUser({
        data: payload,
      });
      if (authError) throw authError;

      setProfileRefreshKey((k) => k + 1);

      toast({
        title: tr("Canvis desats", "Cambios guardados"),
        description: tr(
          "Canvis desats correctament",
          "Cambios guardados correctamente"
        ),
      });
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : tr("Error guardant els canvis", "Error guardando los cambios")
      );
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col" style={{ background: "#F5EFE6" }}>
        <Header onOpenPreus={() => setPreusOpen(true)} />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3" style={{ color: "#8B7355" }}>
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#B87333" }} />
            <p className="text-sm">
              {tr("Carregant el teu compte…", "Cargando tu cuenta…")}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not authenticated — show login CTA
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col" style={{ background: "#F5EFE6", color: "#2C1810" }}>
        <Header onOpenPreus={() => setPreusOpen(true)} />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div
            className="w-full max-w-md text-center"
            style={{
              background: "white",
              border: "1px solid #C9B89A",
              padding: "32px",
            }}
          >
            <div
              className="mx-auto mb-3 flex items-center justify-center"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(184, 115, 51, 0.15)",
              }}
            >
              <LogIn className="h-6 w-6" style={{ color: "#B87333" }} />
            </div>
            <h2
              className="mb-2 font-serif font-medium"
              style={{ fontSize: "1.5rem", color: "#2C1810" }}
            >
              {tr("Inicia sessió", "Inicia sesión")}
            </h2>
            <p
              className="mb-4"
              style={{
                fontSize: "0.875rem",
                color: "#5C3A1E",
                lineHeight: 1.5,
              }}
            >
              {tr(
                "Inicia sessió o crea un compte gratuït per accedir a la teva biblioteca d'informes ESG, els teus interessos guardats i la configuració de la newsletter.",
                "Inicia sesión o crea una cuenta gratis para acceder a tu biblioteca de informes ESG, tus intereses guardados y la configuración de la newsletter."
              )}
            </p>
            <Button
              size="lg"
              className="w-full"
              onClick={() => setAuthOpen(true)}
            >
              <LogIn className="h-4 w-4" />
              {tr(
                "Iniciar sessió / Registrar-se",
                "Iniciar sesión / Registrarse"
              )}
            </Button>
            <p
              className="mt-3"
              style={{ fontSize: "0.75rem", color: "#8B7355" }}
            >
              {tr(
                "Sense targeta de crèdit. Cancel·la quan vulguis.",
                "Sin tarjeta de crédito. Cancela cuando quieras."
              )}
            </p>
=======
  const openAuth = (tab: "register" | "login" = "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const toggleEstandar = (slug: string) => {
    setSelectedEstandards((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const toggleInteres = (id: string) => {
    setSelectedInteressos((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // Si no hi ha usuari loguejat, mostrar CTA per accedir
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={(tab) => openAuth(tab || "register")} />
        <main className="flex flex-1 items-center justify-center px-6">
          <div className="text-center">
            <h1 className="mb-4 font-serif text-3xl font-medium text-primary">{t("cuenta.v2.login_required.title")}</h1>
            <p className="mb-8 font-serif text-lg italic" style={{ color: "#5C3A1E" }}>{t("cuenta.v2.login_required.body")}</p>
            <button
              onClick={() => openAuth("login")}
              className="px-8 py-3 text-sm font-semibold text-white"
              style={{ background: "#B87333" }}
            >
              {t("cuenta.v2.login_required.cta")}
            </button>
>>>>>>> Stashed changes
          </div>
        </main>
        <Footer />
        <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
        <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
      </div>
    );
  }

<<<<<<< Updated upstream
  // Authenticated — show the redesigned account page
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: "#F5EFE6", color: "#2C1810" }}
    >
      <Header onOpenPreus={() => setPreusOpen(true)} />
      <main className="flex-1">
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[320px_1fr]">
          {/* ===== SIDEBAR (dark, sticky) ===== */}
          <aside
            className="flex flex-col gap-8 px-6 py-12 lg:sticky lg:top-[70px] lg:h-[calc(100vh-70px)]"
            style={{
              background: "#2C1810",
              color: "#F5EFE6",
              padding: "48px 32px",
            }}
          >
            {/* Brand */}
            <div
              className="font-serif font-semibold"
              style={{
                fontSize: "1.375rem",
                color: "#F5EFE6",
                letterSpacing: "-0.015em",
                paddingBottom: "24px",
                borderBottom: "1px solid rgba(217, 165, 116, 0.25)",
              }}
            >
              Criteri<span style={{ color: "#D9A574" }}>.</span> ESG
            </div>

            {/* User card */}
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center font-serif font-medium"
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "#B87333",
                  color: "#FFFFFF",
                  fontSize: "1.5rem",
                }}
              >
                {avatarLetter}
              </div>
              <div className="flex flex-col gap-1">
                <div
                  className="font-serif font-medium"
                  style={{
                    fontSize: "1.125rem",
                    color: "#F5EFE6",
                    letterSpacing: "-0.008em",
                  }}
                >
                  {fullName || t("v2.cuenta.user.default")}
                </div>
                <div
                  className="font-mono text-[10px] font-semibold uppercase"
                  style={{ color: "#D9A574", letterSpacing: "0.18em" }}
                >
                  {userPlan === "premium"
                    ? t("v2.cuenta.plan.premium")
                    : t("v2.cuenta.plan.free")}
=======
  const navItems = [
    { id: "perfil", num: "01", label: t("cuenta.v2.nav.perfil") },
    { id: "newsletter", num: "02", label: t("cuenta.v2.nav.newsletter") },
    { id: "plan", num: "03", label: t("cuenta.v2.nav.plan") },
    { id: "estandares", num: "04", label: t("cuenta.v2.nav.estandares") },
    { id: "intereses", num: "05", label: t("cuenta.v2.nav.intereses") },
    { id: "billing", num: "06", label: t("cuenta.v2.nav.billing") },
  ];

  const userInitial = (user.email?.[0] || "U").toUpperCase();
  const isPremium = plan === "premium";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={(tab) => openAuth(tab || "register")} />
      <main className="flex-1">
        <div className="grid lg:grid-cols-[320px_1fr]">
          {/* === SIDEBAR === */}
          <aside
            className="sticky top-[70px] hidden h-[calc(100vh-70px)] flex-col p-12 lg:flex"
            style={{ background: "#2C1810", color: "#F5EFE6" }}
          >
            <div className="mb-8 pb-6 border-b" style={{ borderColor: "rgba(217,165,116,0.25)" }}>
              <div className="font-serif text-xl font-semibold" style={{ color: "#F5EFE6", letterSpacing: "-0.015em" }}>
                Criteri<span style={{ color: "#D9A574" }}>.</span> ESG
              </div>
            </div>

            <div className="mb-8 flex items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full font-serif text-2xl font-medium"
                style={{ background: "#B87333", color: "#FFFFFF" }}
              >
                {userInitial}
              </div>
              <div className="flex flex-col gap-1">
                <div className="font-serif text-lg font-medium" style={{ color: "#F5EFE6" }}>
                  {user.email?.split("@")[0] || "Usuario"}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#D9A574" }}>
                  {isPremium ? t("cuenta.v2.plan.premium") : t("cuenta.v2.plan.free")}
>>>>>>> Stashed changes
                </div>
              </div>
            </div>

<<<<<<< Updated upstream
            {/* Nav */}
            <nav className="flex flex-col gap-0.5">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.num}
                  href={item.href}
                  className="grid items-baseline gap-3 px-4 py-3 font-sans text-sm font-medium no-underline transition-colors"
                  style={{
                    gridTemplateColumns: "24px 1fr",
                    color: "rgba(245, 239, 230, 0.7)",
                    borderLeft: "2px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#F5EFE6";
                    e.currentTarget.style.background = "rgba(217, 165, 116, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(245, 239, 230, 0.7)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span
                    className="font-mono text-[10px] font-semibold"
                    style={{ color: "rgba(217, 165, 116, 0.5)" }}
                  >
                    {item.num}
                  </span>
                  <span>{t(item.labelKey)}</span>
                </a>
              ))}
            </nav>

            {/* Logout */}
            <button
              onClick={() => signOut()}
              className="mt-auto border-0 bg-transparent p-0 text-left font-sans text-[13px] font-medium"
              style={{
                color: "rgba(245, 239, 230, 0.5)",
                borderTop: "1px solid rgba(217, 165, 116, 0.15)",
                paddingTop: "12px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#D9A574";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(245, 239, 230, 0.5)";
              }}
            >
              {t("v2.cuenta.nav.logout")}
            </button>
          </aside>

          {/* ===== MAIN CONTENT ===== */}
          <div
            className="flex flex-col gap-8 px-6 py-12 sm:px-12 lg:px-16"
            style={{ padding: "48px 64px" }}
          >
            {/* Page title */}
            <div>
              <h1
                className="font-serif font-medium"
                style={{
                  fontSize: "clamp(2rem, 3vw, 2.25rem)",
                  color: "#2C1810",
                  letterSpacing: "-0.018em",
                  marginBottom: "8px",
                }}
              >
                {t("v2.cuenta.page.title")}
              </h1>
              <p
                className="font-serif italic"
                style={{
                  fontSize: "1rem",
                  color: "#5C3A1E",
                  marginBottom: "16px",
                }}
              >
                {t("v2.cuenta.page.subtitle")}
              </p>
            </div>

            {/* ===== 01 PERFIL ===== */}
            <section
              id="perfil"
              className="flex flex-col gap-5"
              style={{
                background: "white",
                border: "1px solid #C9B89A",
                padding: "32px",
                scrollMarginTop: "90px",
              }}
            >
              <div
                className="flex items-baseline justify-between pb-4"
                style={{ borderBottom: "1px solid #C9B89A" }}
              >
                <h2
                  className="font-serif font-medium"
                  style={{
                    fontSize: "1.375rem",
                    color: "#2C1810",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {t("v2.cuenta.card.perfil.title")}
                </h2>
                <span
                  className="font-mono text-[10px] font-semibold uppercase"
                  style={{ color: "#B87333", letterSpacing: "0.18em" }}
                >
                  01
                </span>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-mono text-[10px] font-semibold uppercase"
                    style={{ color: "#8A5526", letterSpacing: "0.16em" }}
                  >
                    {t("v2.cuenta.perfil.name")}
                  </label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder={tr("El teu nom", "Tu nombre")}
                    className="font-sans text-sm font-medium"
                    style={{
                      background: "#F5EFE6",
                      border: "1px solid #C9B89A",
                      padding: "12px 16px",
                      color: "#2C1810",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-mono text-[10px] font-semibold uppercase"
                    style={{ color: "#8A5526", letterSpacing: "0.16em" }}
                  >
                    {t("v2.cuenta.perfil.email")}
                  </label>
                  <input
                    value={email}
                    readOnly
                    className="font-sans text-sm font-medium"
                    style={{
                      background: "#F5EFE6",
                      border: "1px solid #C9B89A",
                      padding: "12px 16px",
                      color: "#2C1810",
                      opacity: 0.7,
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-mono text-[10px] font-semibold uppercase"
                    style={{ color: "#8A5526", letterSpacing: "0.16em" }}
                  >
                    {t("v2.cuenta.perfil.empresa")}
                  </label>
                  <input
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    placeholder={t("v2.cuenta.perfil.empresa.placeholder")}
                    className="font-sans text-sm font-medium"
                    style={{
                      background: "#F5EFE6",
                      border: "1px solid #C9B89A",
                      padding: "12px 16px",
                      color: "#2C1810",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-mono text-[10px] font-semibold uppercase"
                    style={{ color: "#8A5526", letterSpacing: "0.16em" }}
                  >
                    {t("v2.cuenta.perfil.sector")}
                  </label>
                  <input
                    defaultValue={t("v2.cuenta.perfil.sector.default")}
                    className="font-sans text-sm font-medium"
                    style={{
                      background: "#F5EFE6",
                      border: "1px solid #C9B89A",
                      padding: "12px 16px",
                      color: "#2C1810",
                    }}
                  />
                </div>
              </div>
            </section>

            {/* ===== 02 NEWSLETTER ===== */}
            <section
              id="newsletter"
              className="flex flex-col gap-5"
              style={{
                background: "white",
                border: "1px solid #C9B89A",
                padding: "32px",
                scrollMarginTop: "90px",
              }}
            >
              <div
                className="flex items-baseline justify-between pb-4"
                style={{ borderBottom: "1px solid #C9B89A" }}
              >
                <h2
                  className="font-serif font-medium"
                  style={{
                    fontSize: "1.375rem",
                    color: "#2C1810",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {t("v2.cuenta.card.newsletter.title")}
                </h2>
                <span
                  className="font-mono text-[10px] font-semibold uppercase"
                  style={{ color: "#B87333", letterSpacing: "0.18em" }}
                >
                  02
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="font-mono text-[10px] font-semibold uppercase"
                  style={{ color: "#8A5526", letterSpacing: "0.16em" }}
                >
                  {t("v2.cuenta.newsletter.lang.label")}
                </label>
                <div
                  className="inline-flex"
                  style={{ border: "1px solid #C9B89A", width: "fit-content" }}
                >
                  <button
                    onClick={() => setEditLanguage("ca")}
                    className="font-mono text-[11px] font-semibold uppercase"
                    style={{
                      padding: "12px 24px",
                      letterSpacing: "0.18em",
                      border: "none",
                      cursor: "pointer",
                      background: editLanguage === "ca" ? "#B87333" : "#F5EFE6",
                      color: editLanguage === "ca" ? "#FFFFFF" : "#5C3A1E",
                    }}
                  >
                    CAT
                  </button>
                  <button
                    onClick={() => setEditLanguage("es")}
                    className="font-mono text-[11px] font-semibold uppercase"
                    style={{
                      padding: "12px 24px",
                      letterSpacing: "0.18em",
                      border: "none",
                      cursor: "pointer",
                      background: editLanguage === "es" ? "#B87333" : "#F5EFE6",
                      color: editLanguage === "es" ? "#FFFFFF" : "#5C3A1E",
                    }}
                  >
                    ES
                  </button>
                </div>
              </div>
              <p
                className="font-serif italic"
                style={{
                  fontSize: "0.875rem",
                  color: "#5C3A1E",
                  lineHeight: 1.4,
                }}
              >
                {t("v2.cuenta.newsletter.desc")}
              </p>
            </section>

            {/* ===== 03 MI PLAN ===== */}
            <section
              id="pla"
              className="flex flex-col gap-5"
              style={{
                background: "white",
                border: "1px solid #C9B89A",
                padding: "32px",
                scrollMarginTop: "90px",
              }}
            >
              <div
                className="flex items-baseline justify-between pb-4"
                style={{ borderBottom: "1px solid #C9B89A" }}
              >
                <h2
                  className="font-serif font-medium"
                  style={{
                    fontSize: "1.375rem",
                    color: "#2C1810",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {t("v2.cuenta.card.pla.title")}
                </h2>
                <span
                  className="font-mono text-[10px] font-semibold uppercase"
                  style={{ color: "#B87333", letterSpacing: "0.18em" }}
                >
                  03
                </span>
              </div>
              <div
                className="flex items-center justify-between gap-6"
                style={{
                  background: "#2C1810",
                  color: "#F5EFE6",
                  padding: "24px",
                }}
              >
                <div className="flex flex-col gap-1">
                  <div
                    className="font-serif font-medium"
                    style={{
                      fontSize: "1.5rem",
                      color: "#F5EFE6",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {userPlan === "premium"
                      ? t("v2.cuenta.plan.premium")
                      : t("v2.cuenta.pla.free.name")}
                  </div>
                  <div
                    className="font-mono text-[11px] font-semibold uppercase"
                    style={{ color: "#D9A574", letterSpacing: "0.16em" }}
                  >
                    {userPlan === "premium"
                      ? tr(
                          "Accés il·limitat · Facturació activa",
                          "Acceso ilimitado · Facturación activa"
                        )
                      : t("v2.cuenta.pla.free.price")}
                  </div>
                </div>
                {userPlan === "free" && (
                  <button
                    onClick={() => setPreusOpen(true)}
                    className="font-sans text-[13px] font-semibold"
                    style={{
                      background: "#B87333",
                      color: "#FFFFFF",
                      padding: "12px 24px",
                      border: "none",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t("v2.cuenta.pla.cta")}
                  </button>
                )}
              </div>
              {userPlan === "free" && (
                <p
                  className="font-sans"
                  style={{
                    fontSize: "0.8125rem",
                    color: "#5C3A1E",
                    lineHeight: 1.5,
                  }}
                >
                  {t("v2.cuenta.pla.desc")}
                </p>
              )}
            </section>

            {/* ===== 04 MIS ESTÁNDARES ESG (16 chips) ===== */}
            <section
              id="estandares"
              className="flex flex-col gap-5"
              style={{
                background: "white",
                border: "1px solid #C9B89A",
                padding: "32px",
                scrollMarginTop: "90px",
              }}
            >
              <div
                className="flex items-baseline justify-between pb-4"
                style={{ borderBottom: "1px solid #C9B89A" }}
              >
                <h2
                  className="font-serif font-medium"
                  style={{
                    fontSize: "1.375rem",
                    color: "#2C1810",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {t("v2.cuenta.card.estandards.title")}
                </h2>
                <span
                  className="font-mono text-[10px] font-semibold uppercase"
                  style={{ color: "#B87333", letterSpacing: "0.18em" }}
                >
                  04
                </span>
              </div>
              <p
                className="font-serif italic"
                style={{
                  fontSize: "0.875rem",
                  color: "#5C3A1E",
                  lineHeight: 1.4,
                }}
              >
                {t("v2.cuenta.estandards.desc")}
              </p>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                {STANDARDS.map((s) => {
                  const selected = editStandards.includes(s.slug);
                  return (
                    <button
                      key={s.slug}
                      onClick={() => toggleStandard(s.slug)}
                      className="flex items-center gap-2.5 text-left font-sans text-[13px] font-medium"
                      style={{
                        padding: "12px 14px",
                        background: selected ? "#2C1810" : "#F5EFE6",
                        color: selected ? "#F5EFE6" : "#2C1810",
                        border: selected
                          ? "1px solid #B87333"
                          : "1px solid #C9B89A",
                        borderLeft: `4px solid ${TYPE_BORDER[s.type]}`,
                        cursor: "pointer",
                      }}
                    >
                      <span
                        className="flex items-center justify-center"
                        style={{
                          width: "16px",
                          height: "16px",
                          border: selected
                            ? "1.5px solid #B87333"
                            : "1.5px solid #C9B89A",
                          background: selected ? "#B87333" : "transparent",
                          color: selected ? "white" : "transparent",
                          fontSize: "11px",
                        }}
                      >
                        ✓
                      </span>
                      {s.name}
=======
            <nav className="flex flex-col gap-0.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    document.getElementById(`card-${item.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="grid grid-cols-[24px_1fr] items-baseline gap-3 border-l-2 px-4 py-3 text-left text-sm font-medium transition-colors"
                  style={{
                    color: activeNav === item.id ? "#F5EFE6" : "rgba(245,239,230,0.7)",
                    background: activeNav === item.id ? "rgba(217,165,116,0.12)" : "transparent",
                    borderLeftColor: activeNav === item.id ? "#B87333" : "transparent",
                  }}
                >
                  <span className="font-mono text-[10px] font-semibold" style={{ color: activeNav === item.id ? "#D9A574" : "rgba(217,165,116,0.5)" }}>
                    {item.num}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <button
              onClick={() => router.push("/")}
              className="mt-auto border-t pt-3 text-left text-[13px] font-medium"
              style={{ borderColor: "rgba(217,165,116,0.15)", color: "rgba(245,239,230,0.5)" }}
            >
              ← {t("cuenta.v2.logout")}
            </button>
          </aside>

          {/* === MAIN === */}
          <div className="flex flex-col gap-8 p-12" style={{ background: "#F5EFE6" }}>
            <div>
              <h1 className="mb-2 font-serif text-4xl font-medium text-primary" style={{ letterSpacing: "-0.018em" }}>
                {t("cuenta.v2.page.title")}
              </h1>
              <p className="font-serif text-base italic" style={{ color: "#5C3A1E" }}>
                {t("cuenta.v2.page.subtitle")}
              </p>
            </div>

            {/* CARD 01: PERFIL */}
            <div id="card-perfil" className="border p-8" style={{ borderColor: "#C9B89A", background: "white" }}>
              <div className="mb-5 flex justify-between border-b pb-4" style={{ borderColor: "#C9B89A" }}>
                <h2 className="font-serif text-xl font-medium text-primary" style={{ letterSpacing: "-0.01em" }}>
                  {t("cuenta.v2.perfil.title")}
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#B87333" }}>01</span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#8A5526" }}>
                    {t("cuenta.v2.perfil.nombre")}
                  </label>
                  <input
                    className="border p-3 text-sm font-medium text-primary"
                    style={{ background: "#F5EFE6", borderColor: "#C9B89A" }}
                    defaultValue={user.email?.split("@")[0] || ""}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#8A5526" }}>
                    {t("cuenta.v2.perfil.email")}
                  </label>
                  <input
                    className="border p-3 text-sm font-medium text-primary"
                    style={{ background: "#F5EFE6", borderColor: "#C9B89A" }}
                    defaultValue={user.email || ""}
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#8A5526" }}>
                    {t("cuenta.v2.perfil.empresa")}
                  </label>
                  <input
                    className="border p-3 text-sm font-medium text-primary"
                    style={{ background: "#F5EFE6", borderColor: "#C9B89A" }}
                    placeholder={t("cuenta.v2.perfil.empresa_placeholder")}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#8A5526" }}>
                    {t("cuenta.v2.perfil.sector")}
                  </label>
                  <input
                    className="border p-3 text-sm font-medium text-primary"
                    style={{ background: "#F5EFE6", borderColor: "#C9B89A" }}
                    placeholder={t("cuenta.v2.perfil.sector_placeholder")}
                  />
                </div>
              </div>
            </div>

            {/* CARD 02: NEWSLETTER */}
            <div id="card-newsletter" className="border p-8" style={{ borderColor: "#C9B89A", background: "white" }}>
              <div className="mb-5 flex justify-between border-b pb-4" style={{ borderColor: "#C9B89A" }}>
                <h2 className="font-serif text-xl font-medium text-primary" style={{ letterSpacing: "-0.01em" }}>
                  {t("cuenta.v2.newsletter.title")}
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#B87333" }}>02</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#8A5526" }}>
                  {t("cuenta.v2.newsletter.idioma")}
                </label>
                <div className="inline-flex border" style={{ borderColor: "#C9B89A" }}>
                  {(["ca", "es"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setNewsletterLang(lang)}
                      className="px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] font-semibold"
                      style={{
                        background: newsletterLang === lang ? "#B87333" : "#F5EFE6",
                        color: newsletterLang === lang ? "#FFFFFF" : "#5C3A1E",
                      }}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <p className="mt-4 font-serif text-sm italic leading-relaxed" style={{ color: "#5C3A1E" }}>
                {t("cuenta.v2.newsletter.desc")}
              </p>
            </div>

            {/* CARD 03: MI PLAN */}
            <div id="card-plan" className="border p-8" style={{ borderColor: "#C9B89A", background: "white" }}>
              <div className="mb-5 flex justify-between border-b pb-4" style={{ borderColor: "#C9B89A" }}>
                <h2 className="font-serif text-xl font-medium text-primary" style={{ letterSpacing: "-0.01em" }}>
                  {t("cuenta.v2.plan.title")}
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#B87333" }}>03</span>
              </div>
              <div
                className="flex items-center justify-between gap-6 p-6"
                style={{ background: "#2C1810", color: "#F5EFE6" }}
              >
                <div className="flex flex-col gap-1">
                  <div className="font-serif text-2xl font-medium" style={{ color: "#F5EFE6", letterSpacing: "-0.01em" }}>
                    {isPremium ? t("cuenta.v2.plan.premium") : t("cuenta.v2.plan.free")}
                  </div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#D9A574" }}>
                    {isPremium ? t("cuenta.v2.plan.premium_desc") : t("cuenta.v2.plan.free_desc")}
                  </div>
                </div>
                {!isPremium && (
                  <button
                    onClick={() => setPreusOpen(true)}
                    className="px-6 py-3 text-[13px] font-semibold text-white"
                    style={{ background: "#B87333" }}
                  >
                    {t("cuenta.v2.plan.upgrade")}
                  </button>
                )}
              </div>
              <p className="mt-4 text-[13px] leading-relaxed" style={{ color: "#5C3A1E" }}>
                {t("cuenta.v2.plan.premium_info")}
              </p>
            </div>

            {/* CARD 04: MIS ESTÁNDARES ESG (16) */}
            <div id="card-estandares" className="border p-8" style={{ borderColor: "#C9B89A", background: "white" }}>
              <div className="mb-5 flex justify-between border-b pb-4" style={{ borderColor: "#C9B89A" }}>
                <h2 className="font-serif text-xl font-medium text-primary" style={{ letterSpacing: "-0.01em" }}>
                  {t("cuenta.v2.estandares.title")}
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#B87333" }}>04</span>
              </div>
              <p className="mb-4 font-serif text-sm italic leading-relaxed" style={{ color: "#5C3A1E" }}>
                {t("cuenta.v2.estandares.desc")}
              </p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {ESTANDARES.map((est) => {
                  const selected = selectedEstandards.includes(est.slug);
                  return (
                    <button
                      key={est.slug}
                      onClick={() => toggleEstandar(est.slug)}
                      className="flex items-center gap-2.5 border-l-4 p-3 text-left text-[13px] font-medium"
                      style={{
                        borderColor: CAT_TYPE_COLOR[est.type],
                        background: selected ? "#2C1810" : "#F5EFE6",
                        color: selected ? "#F5EFE6" : "#2C1810",
                        border: selected ? "1px solid #B87333" : "1px solid #C9B89A",
                        borderLeftColor: CAT_TYPE_COLOR[est.type],
                        borderLeftWidth: "4px",
                      }}
                    >
                      <span
                        className="flex h-4 w-4 items-center justify-center text-[11px]"
                        style={{
                          background: selected ? "#B87333" : "transparent",
                          border: selected ? "1px solid #B87333" : "1.5px solid #C9B89A",
                          color: "white",
                        }}
                      >
                        {selected ? "✓" : ""}
                      </span>
                      {est.name}
>>>>>>> Stashed changes
                    </button>
                  );
                })}
              </div>
<<<<<<< Updated upstream
              {/* Legend */}
              <div
                className="flex flex-wrap gap-6 font-mono text-[9.5px] font-semibold uppercase"
                style={{
                  color: "#5C3A1E",
                  letterSpacing: "0.16em",
                  marginTop: "8px",
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    style={{ width: "18px", height: "4px", background: "#5C3A1E" }}
                  />
                  {t("v2.cuenta.estandards.legend.reg")}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    style={{ width: "18px", height: "4px", background: "#B87333" }}
                  />
                  {t("v2.cuenta.estandards.legend.fw")}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    style={{ width: "18px", height: "4px", background: "#E8C99A" }}
                  />
                  {t("v2.cuenta.estandards.legend.cert")}
                </div>
              </div>
            </section>

            {/* ===== 05 OTROS INTERESES (8 chips) ===== */}
            <section
              id="interessos"
              className="flex flex-col gap-5"
              style={{
                background: "white",
                border: "1px solid #C9B89A",
                padding: "32px",
                scrollMarginTop: "90px",
              }}
            >
              <div
                className="flex items-baseline justify-between pb-4"
                style={{ borderBottom: "1px solid #C9B89A" }}
              >
                <h2
                  className="font-serif font-medium"
                  style={{
                    fontSize: "1.375rem",
                    color: "#2C1810",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {t("v2.cuenta.card.interessos.title")}
                </h2>
                <span
                  className="font-mono text-[10px] font-semibold uppercase"
                  style={{ color: "#B87333", letterSpacing: "0.18em" }}
                >
                  05
                </span>
              </div>
              <p
                className="font-serif italic"
                style={{
                  fontSize: "0.875rem",
                  color: "#5C3A1E",
                  lineHeight: 1.4,
                }}
              >
                {t("v2.cuenta.interessos.desc")}
              </p>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                {INTEREST_IDS.map((opt) => {
                  const selected = editInterests.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleInterest(opt.id)}
                      className="flex items-center gap-2.5 text-left font-sans text-[13px] font-medium"
                      style={{
                        padding: "12px 14px",
                        background: selected
                          ? "rgba(184, 115, 51, 0.12)"
                          : "#F5EFE6",
                        color: selected ? "#5C3A1E" : "#2C1810",
                        border: selected
                          ? "1px solid #B87333"
                          : "1px solid #C9B89A",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        className="flex items-center justify-center"
                        style={{
                          width: "16px",
                          height: "16px",
                          border: selected
                            ? "1.5px solid #B87333"
                            : "1.5px solid #C9B89A",
                          background: selected ? "#B87333" : "transparent",
                          color: selected ? "white" : "transparent",
                          fontSize: "11px",
                        }}
                      >
                        ✓
                      </span>
                      {t(opt.labelKey)}
=======
              <div className="mt-4 flex gap-6 font-mono text-[9.5px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#5C3A1E" }}>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-[18px] h-1" style={{ background: "#5C3A1E" }} />
                  <span>{t("cuenta.v2.estandares.legend.reg")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-[18px] h-1" style={{ background: "#B87333" }} />
                  <span>{t("cuenta.v2.estandares.legend.fw")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-[18px] h-1" style={{ background: "#E8C99A" }} />
                  <span>{t("cuenta.v2.estandares.legend.cert")}</span>
                </div>
              </div>
            </div>

            {/* CARD 05: OTROS INTERESES (8) */}
            <div id="card-intereses" className="border p-8" style={{ borderColor: "#C9B89A", background: "white" }}>
              <div className="mb-5 flex justify-between border-b pb-4" style={{ borderColor: "#C9B89A" }}>
                <h2 className="font-serif text-xl font-medium text-primary" style={{ letterSpacing: "-0.01em" }}>
                  {t("cuenta.v2.intereses.title")}
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#B87333" }}>05</span>
              </div>
              <p className="mb-4 font-serif text-sm italic leading-relaxed" style={{ color: "#5C3A1E" }}>
                {t("cuenta.v2.intereses.desc")}
              </p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {INTERESSOS.map((interes) => {
                  const selected = selectedInteressos.includes(interes.id);
                  return (
                    <button
                      key={interes.id}
                      onClick={() => toggleInteres(interes.id)}
                      className="flex items-center gap-2.5 p-3 text-left text-[13px] font-medium"
                      style={{
                        background: selected ? "rgba(184,115,51,0.12)" : "#F5EFE6",
                        border: selected ? "1px solid #B87333" : "1px solid #C9B89A",
                        color: selected ? "#5C3A1E" : "#2C1810",
                      }}
                    >
                      <span
                        className="flex h-4 w-4 items-center justify-center text-[11px]"
                        style={{
                          background: selected ? "#B87333" : "transparent",
                          border: selected ? "1px solid #B87333" : "1.5px solid #C9B89A",
                          color: "white",
                        }}
                      >
                        {selected ? "✓" : ""}
                      </span>
                      {t(interes.key)}
>>>>>>> Stashed changes
                    </button>
                  );
                })}
              </div>
<<<<<<< Updated upstream
            </section>

            {/* ===== 06 BILLING (placeholder card — keep simple) ===== */}
            <section
              id="billing"
              className="flex flex-col gap-5"
              style={{
                background: "white",
                border: "1px solid #C9B89A",
                padding: "32px",
                scrollMarginTop: "90px",
              }}
            >
              <div
                className="flex items-baseline justify-between pb-4"
                style={{ borderBottom: "1px solid #C9B89A" }}
              >
                <h2
                  className="font-serif font-medium"
                  style={{
                    fontSize: "1.375rem",
                    color: "#2C1810",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {t("v2.cuenta.nav.billing")}
                </h2>
                <span
                  className="font-mono text-[10px] font-semibold uppercase"
                  style={{ color: "#B87333", letterSpacing: "0.18em" }}
                >
                  06
                </span>
              </div>
              <p
                className="font-serif italic"
                style={{
                  fontSize: "0.875rem",
                  color: "#5C3A1E",
                  lineHeight: 1.5,
                }}
              >
                {userPlan === "premium"
                  ? tr(
                      "Gestiona la teva subscripció, factura i mètode de pagament. Per canvis, escriu-nos a info@criteriesg.com.",
                      "Gestiona tu suscripción, factura y método de pago. Para cambios, escríbenos a info@criteriesg.com."
                    )
                  : tr(
                      "Encara no ets Premium. Quan ho siguis, aquí podràs gestionar la teva subscripció i factures.",
                      "Aún no eres Premium. Cuando lo seas, aquí podrás gestionar tu suscripción y facturas."
                    )}
              </p>
            </section>

            {/* Save / error */}
            {saveError && (
              <p
                className="text-sm"
                style={{ color: "#A04020" }}
                role="alert"
              >
                {saveError}
              </p>
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                onClick={handleSave}
                disabled={saving}
                style={{
                  background: "#B87333",
                  color: "#FFFFFF",
                  border: "none",
                }}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {tr("Desar canvis", "Guardar cambios")}
              </Button>
              <Button
                variant="outline"
                onClick={() => signOut()}
                style={{
                  borderColor: "#C9B89A",
                  color: "#5C3A1E",
                  background: "transparent",
                }}
              >
                <LogOut className="h-4 w-4" />
                {tr("Tancar sessió", "Cerrar sesión")}
              </Button>
            </div>
=======
            </div>

>>>>>>> Stashed changes
          </div>
        </div>
      </main>
      <Footer />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
    </div>
  );
}
