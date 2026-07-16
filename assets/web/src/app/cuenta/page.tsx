"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/components/language-provider";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Mail,
  Building2,
  User as UserIcon,
  Crown,
  Sparkles,
  Loader2,
  LogIn,
  LogOut,
  Globe,
  CheckCircle2,
  ShieldCheck,
  Save,
  X,
} from "lucide-react";

/**Llista d'interessos disponibles per al formulari d'edició.*/
const INTEREST_OPTIONS: { id: string; label: string }[] = [
  { id: "csrd", label: "CSRD/ESRS" },
  { id: "ecovadis", label: "EcoVadis" },
  { id: "bcorp", label: "B Corp" },
  { id: "circular", label: "Economía circular" },
  { id: "sfdr", label: "Inversión de impacto (SFDR)" },
  { id: "bien", label: "Bien común" },
  { id: "etica", label: "Ética empresarial" },
  { id: "csddd", label: "Derechos Humanos y Cadena de Valor (CSDDD)" },
];

/**Tipus de fila de perfil llegida de la taula `profiles` de Supabase.*/
type ProfileRow = {
  full_name: string | null;
  company: string | null;
  interests: string[] | null;
  newsletter_language: "es" | "ca" | null;
  newsletter_subscribed: boolean | null;
  plan: "free" | "premium" | null;
  gdpr_consent: boolean | null;
};

export default function CuentaPage() {
  const { user, session, loading, signOut } = useAuth();
  const { lang } = useLanguage();
  const { toast } = useToast();
  const [authOpen, setAuthOpen] = useState(false);
  const [preusOpen, setPreusOpen] = useState(false);

  // Mode edició del perfil
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Perfil llegit de la taula `profiles`. `profileRefreshKey` es fa servir
  // per forçar un refresc explícit després de guardar (Problema 4).
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [profileRefreshKey, setProfileRefreshKey] = useState(0);

  // Metadata guardada a user.user_metadata (la que envia el form de registre).
  // Es fa servir com a fallback mentre no s'hagi carregat la taula `profiles`.
  const meta = user?.user_metadata ?? {};

  // Font de veritat preferida: taula `profiles`. Si encara no s'ha carregat,
  // fem servir `user.user_metadata` per evitar parpelleigs.
  const fullName: string = profile?.full_name ?? (meta.full_name ?? "");
  const company: string = profile?.company ?? (meta.company ?? "");
  const plan: "free" | "premium" =
    profile?.plan ?? (meta.plan ?? "free");
  const interests: string[] = Array.isArray(profile?.interests)
    ? profile.interests
    : Array.isArray(meta.interests)
      ? meta.interests
      : [];
  // Defaults coherents amb el comportament del formulari de registre i amb
  // l'onboarding d'usuaris OAuth (auth-context.tsx):
  //   - newsletter_subscribed: true (tot usuari registrat la rep per defecte)
  //   - newsletter_language: 'ca' (cohrent amb <html lang="ca">)
  const newsletterSubscribed: boolean =
    profile?.newsletter_subscribed ??
    (meta.newsletter_subscribed === undefined
      ? true
      : Boolean(meta.newsletter_subscribed));
  const newsletterLanguage: "es" | "ca" =
    profile?.newsletter_language ?? (meta.newsletter_language ?? "ca");
  const gdprConsent: boolean =
    profile?.gdpr_consent ?? Boolean(meta.gdpr_consent);

  // Estat del formulari d'edició
  const [editName, setEditName] = useState(fullName);
  const [editCompany, setEditCompany] = useState(company);
  const [editInterests, setEditInterests] = useState<string[]>(interests);
  const [editLanguage, setEditLanguage] = useState<"es" | "ca">(newsletterLanguage);

  // Llegeix el perfil de la taula `profiles` quan canvia l'usuari o quan
  // es força un refresc (després de guardar).
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
          "full_name, company, interests, newsletter_language, newsletter_subscribed, plan, gdpr_consent"
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

  // Manté els camps d'edició sincronitzats amb les dades refreshed quan no
  // s'està editant (perquè la pròxima vegada que es premi "Editar dades"
  // els camps arrenquin amb els valors més recents).
  useEffect(() => {
    if (!isEditing) {
      setEditName(fullName);
      setEditCompany(company);
      setEditInterests(interests);
      setEditLanguage(newsletterLanguage);
    }
  }, [fullName, company, interests, newsletterLanguage, isEditing]);

  /**Helper de traducció inline CA/ES basat en l'idioma seleccionat al header.*/
  const tr = (ca: string, es: string) => (lang === "ca" ? ca : es);

  /**Entra en mode edició inicialitzant els camps amb els valors actuals.*/
  const handleEditClick = () => {
    setEditName(fullName);
    setEditCompany(company);
    setEditInterests(interests);
    setEditLanguage(newsletterLanguage);
    setSaveError(null);
    setIsEditing(true);
  };

  /**Cancel·la l'edició i torna al mode lectura.*/
  const handleCancel = () => {
    setIsEditing(false);
    setSaveError(null);
  };

  /**Commuta un interès seleccionat dins el formulari d'edició.*/
  const toggleInterest = (id: string) => {
    setEditInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  /**Guarda els canvis a la taula `profiles` i a les metadades d'usuari de
   * Supabase Auth perquè es reflecteixin immediatament (Problema 4).*/
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

      // 1. Actualitza la taula `profiles`
      const { error: dbError } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", user.id);
      if (dbError) throw dbError;

      // 2. Actualitza les metadades d'usuari a Supabase Auth perquè els
      //    canvis també es reflecteixin a `user.user_metadata` immediatament.
      const { error: authError } = await supabase.auth.updateUser({
        data: payload,
      });
      if (authError) throw authError;

      // 3. Refresca les dades locals llegint el perfil actualitzat de la
      //    taula `profiles` perquè la UI es repinti amb els valors nous.
      setProfileRefreshKey((k) => k + 1);

      setIsEditing(false);
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

  // Mostra un spinner mentre es carrega la sessió
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header
          onOpenPreus={() => setPreusOpen(true)}
        />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
            <p className="text-sm">
              {tr("Carregant el teu compte…", "Cargando tu cuenta…")}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- Sense usuari: mostra CTA per iniciar sessió ---
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header
          onOpenPreus={() => setPreusOpen(true)}
        />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <Card className="w-full max-w-md border-rule bg-card text-center shadow-sm">
            <CardHeader>
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft/20">
                <LogIn className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="font-serif text-2xl text-primary">
                {tr("Inicia sessió", "Inicia sesión")}
              </CardTitle>
              <CardDescription>
                {tr(
                  "Inicia sessió o crea un compte gratuït per accedir a la teva biblioteca d'informes ESG, els teus interessos guardats i la configuració de la newsletter.",
                  "Inicia sesión o crea una cuenta gratis para acceder a tu biblioteca de informes ESG, tus intereses guardados y la configuración de la newsletter."
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
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
              <p className="text-xs text-muted-foreground">
                {tr(
                  "Sense targeta de crèdit. Cancel·la quan vulguis.",
                  "Sin tarjeta de crédito. Cancela cuando quieras."
                )}
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />

        <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab="login" />
        <PreusDialog
          open={preusOpen}
          onOpenChange={setPreusOpen}
          onOpenRegister={() => setAuthOpen(true)}
        />
      </div>
    );
  }

  // --- Amb usuari: mostra les seves dades ---
  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString(
        lang === "ca" ? "ca-ES" : "es-ES",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )
    : "—";

  const provider =
    user.app_metadata?.provider ??
    (session?.user?.identities?.[0]?.provider ?? "email");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        onOpenPreus={() => setPreusOpen(true)}
      />
      <main className="flex-1">
        <section className="border-b border-rule bg-secondary/30 py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <p className="eyebrow mb-2">
              {tr("El meu compte", "Mi cuenta")}
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-primary sm:text-5xl">
              {tr("Hola", "Hola")}
              {fullName ? `, ${fullName.split(" ")[0]}` : ""}.
            </h1>
            <div className="rule-accent my-5" />
            <p className="max-w-2xl text-base leading-relaxed text-foreground/80">
              {tr(
                "Gestiona la teva subscripció i dades",
                "Gestiona tu suscripción y datos"
              )}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          {isEditing ? (
            /* ===== Mode edició: formulari editable ===== */
            <Card className="border-rule bg-card">
              <CardHeader>
                <CardTitle className="font-serif text-xl text-primary">
                  {tr("Editar dades", "Editar datos")}
                </CardTitle>
                <CardDescription>
                  {tr(
                    "Actualitza el teu nom, empresa, interessos i idioma de la newsletter.",
                    "Actualiza tu nombre, empresa, intereses e idioma de la newsletter."
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nom */}
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-name"
                    className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                  >
                    {tr("Nom", "Nombre")}
                  </Label>
                  <Input
                    id="edit-name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder={tr(
                      "El teu nom complet",
                      "Tu nombre completo"
                    )}
                    autoComplete="name"
                  />
                </div>

                {/* Empresa */}
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-company"
                    className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                  >
                    {tr("Empresa", "Empresa")}
                  </Label>
                  <Input
                    id="edit-company"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    placeholder={tr("La teva empresa", "Tu empresa")}
                    autoComplete="organization"
                  />
                </div>

                <Separator />

                {/* Interessos */}
                <div className="space-y-3">
                  <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {tr("Interessos", "Intereses")}
                  </Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {INTEREST_OPTIONS.map((opt) => {
                      const checked = editInterests.includes(opt.id);
                      return (
                        <div
                          key={opt.id}
                          className="flex items-start gap-2.5 rounded-md border border-rule bg-secondary/30 px-3 py-2"
                        >
                          <Checkbox
                            id={`interest-${opt.id}`}
                            checked={checked}
                            onCheckedChange={() => toggleInterest(opt.id)}
                            className="mt-0.5"
                          />
                          <Label
                            htmlFor={`interest-${opt.id}`}
                            className="cursor-pointer text-sm font-normal leading-snug text-foreground"
                          >
                            {opt.label}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Idioma de la newsletter — mateix text en CA i ES (Problema 3) */}
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Idioma de la newsletter
                  </Label>
                  <Select
                    value={editLanguage}
                    onValueChange={(v) => setEditLanguage(v as "es" | "ca")}
                  >
                    <SelectTrigger className="w-full sm:w-60">
                      <Globe className="h-3.5 w-3.5 text-accent" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="ca">Català</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {saveError && (
                  <p className="text-sm text-destructive" role="alert">
                    {saveError}
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            /* ===== Mode lectura: grid de cards existent ===== */
            <div className="grid gap-6 md:grid-cols-3">
              {/* Perfil bàsic */}
              <Card className="border-rule bg-card md:col-span-2">
                <CardHeader>
                  <CardTitle className="font-serif text-xl text-primary">
                    {tr("Dades personals", "Datos personales")}
                  </CardTitle>
                  <CardDescription>
                    {tr(
                      "Informació bàsica del teu perfil a Criteri ESG.",
                      "Información básica de tu perfil en Criteri ESG."
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DataRow
                    icon={<UserIcon className="h-4 w-4 text-accent" />}
                    label={tr("Nom", "Nombre")}
                    value={fullName || "—"}
                  />
                  <Separator />
                  <DataRow
                    icon={<Mail className="h-4 w-4 text-accent" />}
                    label="Email"
                    value={user.email ?? "—"}
                  />
                  <Separator />
                  <DataRow
                    icon={<Building2 className="h-4 w-4 text-accent" />}
                    label={tr("Empresa", "Empresa")}
                    value={company || "—"}
                  />
                  <Separator />
                  <DataRow
                    icon={<ShieldCheck className="h-4 w-4 text-accent" />}
                    label={tr("Mètode d'accés", "Método de acceso")}
                    value={
                      provider === "google"
                        ? "Google"
                        : tr(
                            "Email + contrasenya",
                            "Email + contraseña"
                          )
                    }
                  />
                  <Separator />
                  <DataRow
                    icon={<CheckCircle2 className="h-4 w-4 text-accent" />}
                    label={tr("Compte creat el", "Cuenta creada el")}
                    value={createdAt}
                  />
                </CardContent>
              </Card>

              {/* Pla */}
              <Card
                className={`border-rule bg-card ${
                  plan === "premium" ? "ring-1 ring-accent/40" : ""
                }`}
              >
                <CardHeader>
                  <div className="mb-1 flex items-center gap-2">
                    {plan === "premium" ? (
                      <Crown className="h-4 w-4 text-accent" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-accent" />
                    )}
                    <CardTitle className="font-serif text-lg text-primary">
                      {tr("Pla actual", "Plan actual")}
                    </CardTitle>
                  </div>
                  <CardDescription>
                    {plan === "premium"
                      ? tr(
                          "Subscrit al pla Premium.",
                          "Suscrito al plan Premium."
                        )
                      : tr(
                          "Estàs al pla gratuït.",
                          "Estás en el plan gratis."
                        )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span
                      className={`inline-block rounded-full px-3 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
                        plan === "premium"
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {plan === "premium" ? "Premium" : tr("Gratis", "Gratis")}
                    </span>
                  </div>
                  {plan === "free" ? (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => setPreusOpen(true)}
                    >
                      <Crown className="h-3.5 w-3.5" />
                      {tr("Pujar a Premium", "Subir a Premium")}
                    </Button>
                  ) : (
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {tr(
                        "Tens accés il·limitat als informes, cross-references i descàrregues PDF.",
                        "Tienes acceso ilimitado a los informes, cross-references y descargas PDF."
                      )}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Interessos */}
              <Card className="border-rule bg-card md:col-span-2">
                <CardHeader>
                  <CardTitle className="font-serif text-xl text-primary">
                    {tr("Interessos", "Intereses")}
                  </CardTitle>
                  <CardDescription>
                    {tr(
                      "Temàtiques ESG que t'interessen.",
                      "Temáticas ESG que te interesan."
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {interests.length === 0 ? (
                    <div className="rounded-md border-l-2 border-accent bg-accent-soft/10 p-3">
                      <div className="flex items-start gap-2">
                        <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-primary">
                            {tr(
                              "Encara no has seleccionat cap interès.",
                              "Aún no has seleccionado ningún interés."
                            )}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-foreground/75">
                            {tr(
                              "Si selecciones interessos et podrem personalitzar més les newsletters i avisar-te primer dels informes que t'afecten.",
                              "Si seleccionas intereses podremos personalizar más las newsletters y avisarte primero de los informes que te afectan."
                            )}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={handleEditClick}
                          >
                            {tr("Selecciona interessos", "Selecciona intereses")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {interests.map((id) => (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 rounded-md border border-rule bg-secondary/50 px-2.5 py-1 text-xs text-foreground"
                        >
                          <CheckCircle2 className="h-3 w-3 text-accent" />
                          {interestLabel(id)}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Newsletter / Estat de la subscripció */}
              <Card className="border-rule bg-card">
                <CardHeader>
                  <CardTitle className="font-serif text-lg text-primary">
                    {tr(
                      "Estat de la subscripció",
                      "Estado de la suscripción"
                    )}
                  </CardTitle>
                  <CardDescription>
                    {tr(
                      "Preferències de la newsletter quinzenal.",
                      "Preferencias de la newsletter quincenal."
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {tr("Estat", "Estado")}
                    </span>
                    <span
                      className={`font-medium ${
                        newsletterSubscribed
                          ? "text-accent"
                          : "text-muted-foreground"
                      }`}
                    >
                      {newsletterSubscribed
                        ? tr("Subscrit", "Suscrito")
                        : tr("No subscrit", "No suscrito")}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {/* Idioma de la newsletter — mateix text en CA i ES */}
                      Idioma de la newsletter
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Globe className="h-3.5 w-3.5 text-accent" />
                      {newsletterLanguage === "ca" ? "Català" : "Español"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {tr("Consentiment GDPR", "Consentimiento GDPR")}
                    </span>
                    <span
                      className={`font-medium ${
                        gdprConsent ? "text-accent" : "text-muted-foreground"
                      }`}
                    >
                      {gdprConsent ? tr("Acceptat", "Aceptado") : "—"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Accions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X className="h-4 w-4" />
                  {tr("Cancel·lar", "Cancelar")}
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {tr("Desar canvis", "Guardar cambios")}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleEditClick}>
                  {tr("Editar dades", "Editar datos")}
                </Button>
                <Button variant="destructive" onClick={() => signOut()}>
                  <LogOut className="h-4 w-4" />
                  {tr("Tancar sessió", "Cerrar sesión")}
                </Button>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab="login" />
      <PreusDialog
        open={preusOpen}
        onOpenChange={setPreusOpen}
        onOpenRegister={() => setAuthOpen(true)}
      />
    </div>
  );
}

/**Fila amb icona, label i valor per a la taula de dades del compte.*/
function DataRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-accent-soft/15">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

/**Traducció llegible de l'id d'interès al label mostrat al formulari.*/
function interestLabel(id: string): string {
  const map: Record<string, string> = {
    csrd: "CSRD/ESRS",
    ecovadis: "EcoVadis",
    bcorp: "B Corp",
    circular: "Economía circular",
    sfdr: "Inversión de impacto (SFDR)",
    bien: "Bien común",
    etica: "Ética empresarial",
    csddd: "Derechos Humanos y Cadena de Valor (CSDDD)",
  };
  return map[id] ?? id;
}
