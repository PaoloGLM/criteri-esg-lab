"use client";

import { useState } from "react";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { QuiSomDialog } from "@/components/qui-som-dialog";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";

export default function CuentaPage() {
  const { user, session, loading, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [preusOpen, setPreusOpen] = useState(false);
  const [quiSomOpen, setQuiSomOpen] = useState(false);

  // Metadata guardada a user.user_metadata (la que envia el form de registre)
  const meta = user?.user_metadata ?? {};
  const fullName: string = meta.full_name ?? "";
  const company: string = meta.company ?? "";
  const plan: "free" | "premium" = meta.plan ?? "free";
  const interests: string[] = Array.isArray(meta.interests) ? meta.interests : [];
  const newsletterSubscribed: boolean = Boolean(meta.newsletter_subscribed);
  const newsletterLanguage: "es" | "ca" = meta.newsletter_language ?? "es";
  const gdprConsent: boolean = Boolean(meta.gdpr_consent);

  // Mostra un spinner mentre es carrega la sessió
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header
          onOpenPreus={() => setPreusOpen(true)}
          onOpenQuiSom={() => setQuiSomOpen(true)}
        />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
            <p className="text-sm">Carregant el teu compte…</p>
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
          onOpenQuiSom={() => setQuiSomOpen(true)}
        />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <Card className="w-full max-w-md border-rule bg-card text-center shadow-sm">
            <CardHeader>
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft/20">
                <LogIn className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="font-serif text-2xl text-primary">
                Inicia sesión
              </CardTitle>
              <CardDescription>
                Inicia sesión o crea un compte gratuït per accedir a la teva
                biblioteca d&apos;informes ESG, els teus interessos guardats i la
                configuració de la newsletter.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                size="lg"
                className="w-full"
                onClick={() => setAuthOpen(true)}
              >
                <LogIn className="h-4 w-4" />
                Iniciar sesión / Registrarse
              </Button>
              <p className="text-xs text-muted-foreground">
                Sense tarjeta de crèdit. Cancel·la quan vulguis.
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
        <QuiSomDialog open={quiSomOpen} onOpenChange={setQuiSomOpen} />
      </div>
    );
  }

  // --- Amb usuari: mostra les seves dades ---
  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const provider =
    user.app_metadata?.provider ??
    (session?.user?.identities?.[0]?.provider ?? "email");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        onOpenPreus={() => setPreusOpen(true)}
        onOpenQuiSom={() => setQuiSomOpen(true)}
      />
      <main className="flex-1">
        <section className="border-b border-rule bg-secondary/30 py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <p className="eyebrow mb-2">EL TEU COMPTE</p>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-primary sm:text-5xl">
              Hola{fullName ? `, ${fullName.split(" ")[0]}` : ""}.
            </h1>
            <div className="rule-accent my-5" />
            <p className="max-w-2xl text-base leading-relaxed text-foreground/80">
              Gestiona el teu perfil, el teu pla i les preferències de la
              newsletter.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Perfil bàsic */}
            <Card className="border-rule bg-card md:col-span-2">
              <CardHeader>
                <CardTitle className="font-serif text-xl text-primary">
                  Dades del compte
                </CardTitle>
                <CardDescription>
                  Informació bàsica del teu perfil a Criteri ESG.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <DataRow
                  icon={<UserIcon className="h-4 w-4 text-accent" />}
                  label="Nombre"
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
                  label="Empresa"
                  value={company || "—"}
                />
                <Separator />
                <DataRow
                  icon={<ShieldCheck className="h-4 w-4 text-accent" />}
                  label="Mètode d'accés"
                  value={
                    provider === "google"
                      ? "Google"
                      : "Email + contrasenya"
                  }
                />
                <Separator />
                <DataRow
                  icon={<CheckCircle2 className="h-4 w-4 text-accent" />}
                  label="Compte creat el"
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
                    Pla
                  </CardTitle>
                </div>
                <CardDescription>
                  {plan === "premium"
                    ? "Subscrit al pla Premium."
                    : "Estàs al pla gratuït."}
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
                    {plan === "premium" ? "Premium" : "Gratis"}
                  </span>
                </div>
                {plan === "free" ? (
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => setPreusOpen(true)}
                  >
                    <Crown className="h-3.5 w-3.5" />
                    Pujar a Premium
                  </Button>
                ) : (
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Tens accés il·limitat als informes, cross-references i
                    descàrregues PDF.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Intereses */}
            <Card className="border-rule bg-card md:col-span-2">
              <CardHeader>
                <CardTitle className="font-serif text-xl text-primary">
                  Intereses
                </CardTitle>
                <CardDescription>
                  Temàtiques ESG que t&apos;interessen.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {interests.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Encara no has seleccionat cap interès.
                  </p>
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

            {/* Newsletter */}
            <Card className="border-rule bg-card">
              <CardHeader>
                <CardTitle className="font-serif text-lg text-primary">
                  Newsletter
                </CardTitle>
                <CardDescription>
                  Preferències de la newsletter quinzenal.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estat</span>
                  <span
                    className={`font-medium ${
                      newsletterSubscribed
                        ? "text-accent"
                        : "text-muted-foreground"
                    }`}
                  >
                    {newsletterSubscribed ? "Subscrit" : "No subscrit"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Idioma</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Globe className="h-3.5 w-3.5 text-accent" />
                    {newsletterLanguage === "ca" ? "Català" : "Español"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Consentiment GDPR
                  </span>
                  <span
                    className={`font-medium ${
                      gdprConsent ? "text-accent" : "text-muted-foreground"
                    }`}
                  >
                    {gdprConsent ? "Acceptat" : "—"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Accions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setAuthOpen(true)}>
              Editar dades
            </Button>
            <Button variant="destructive" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" />
              Tancar sessió
            </Button>
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
      <QuiSomDialog open={quiSomOpen} onOpenChange={setQuiSomOpen} />
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

/**Traducció llegible de l&apos;id d&apos;interès al label mostrat al formulari.*/
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
