"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Loader2, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**Pestanya activa per defecte: "register" o "login"*/
  defaultTab?: "register" | "login";
}

/**
 * Llista d'interessos ESG disponibles al formulari de registre.
 * S'envien com a metadata de l'usuari a Supabase (`user_metadata.interests`).
 */
const INTERESES: { id: string; label: string }[] = [
  { id: "csrd", label: "CSRD/ESRS" },
  { id: "ecovadis", label: "EcoVadis" },
  { id: "bcorp", label: "B Corp" },
  { id: "circular", label: "Economía circular" },
  { id: "sfdr", label: "Inversión de impacto (SFDR)" },
  { id: "bien", label: "Bien común" },
  { id: "etica", label: "Ética empresarial" },
  { id: "csddd", label: "Derechos Humanos y Cadena de Valor (CSDDD)" },
];

/**Icona SVG de Google (lucide no la inclou).*/
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function AuthDialog({
  open,
  onOpenChange,
  defaultTab = "register",
}: AuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-primary">
            Criteri ESG
          </DialogTitle>
          <DialogDescription>
            Accedeix o crea el teu compte per començar a llegir informes ESG
            sintetitzats.
          </DialogDescription>
        </DialogHeader>

        {/* El contingut intern es munta/desmunta amb el Dialog, per tant
            l'estat del formulari es reseteja naturalment cada cop que
            s'obre el modal. */}
        {open && (
          <AuthDialogInner
            defaultTab={defaultTab}
            onOpenChange={onOpenChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function AuthDialogInner({
  defaultTab,
  onOpenChange,
}: {
  defaultTab: "register" | "login";
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const { user } = useAuth();

  // ---- Estat pestanya activa ----
  const [tab, setTab] = useState<"register" | "login">(defaultTab);

  // ---- Estat formulari de registre ----
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regCompany, setRegCompany] = useState("");
  const [regInterests, setRegInterests] = useState<string[]>([]);
  const [regNewsletter, setRegNewsletter] = useState(true);
  const [regNewsletterLang, setRegNewsletterLang] = useState<"es" | "ca">("es");
  const [regPlan, setRegPlan] = useState<"free" | "premium">("free");
  const [regGdpr, setRegGdpr] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regDone, setRegDone] = useState(false);

  // ---- Estat formulari de magic link ----
  const [magicEmail, setMagicEmail] = useState("");
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  // ---- Estat formulari de login amb contrasenya ----
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Tanca automàticament quan l'usuari ja està autenticat
  useEffect(() => {
    if (user) {
      onOpenChange(false);
    }
  }, [user, onOpenChange]);

  // ---- OAuth amb Google ----
  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
    if (error) {
      toast({
        title: "No s'ha pogut iniciar la sessió amb Google",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // ---- Registre amb email ----
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!regGdpr) {
      toast({
        title: "Consentiment GDPR obligatori",
        description:
          "Has d'acceptar la política de privacitat per crear un compte.",
        variant: "destructive",
      });
      return;
    }

    setRegLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: regEmail.trim(),
      password: generateTempPassword(),
      options: {
        data: {
          full_name: regName.trim(),
          company: regCompany.trim(),
          interests: regInterests,
          newsletter_subscribed: regNewsletter,
          newsletter_language: regNewsletterLang,
          gdpr_consent: true,
          gdpr_consent_at: new Date().toISOString(),
          plan: regPlan,
        },
        emailRedirectTo:
          typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });

    setRegLoading(false);

    if (error) {
      toast({
        title: "Error en el registre",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Si l'usuari es registra immediatament com a sessió activa (sense confirmar email)
    if (data.session) {
      toast({
        title: "Benvingut/da a Criteri ESG",
        description: "El teu compte s'ha creat correctament.",
      });
      onOpenChange(false);
      return;
    }

    // Si cal confirmar per email
    setRegDone(true);
    toast({
      title: "Revisa el teu correu",
      description:
        "T'hem enviat un enllaç per confirmar el teu compte a Criteri ESG.",
    });
  };

  // ---- Magic link ----
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!magicEmail.trim()) return;

    setMagicLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: magicEmail.trim(),
      options: {
        shouldCreateUser: false,
        emailRedirectTo:
          typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
    setMagicLoading(false);

    if (error) {
      toast({
        title: "No s'ha pogut enviar l'enllaç",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setMagicSent(true);
    toast({
      title: "Enllaç enviat",
      description: "Revisa el teu correu per iniciar sessió.",
    });
  };

  // ---- Login amb contrasenya ----
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) return;

    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword,
    });
    setLoginLoading(false);

    if (error) {
      toast({
        title: "No s'ha pogut iniciar la sessió",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sessió iniciada",
      description: "Benvingut/da de nou a Criteri ESG.",
    });
    onOpenChange(false);
  };

  // ---- Reset password ----
  const handleResetPassword = async () => {
    const email = loginEmail.trim() || magicEmail.trim();
    if (!email) {
      toast({
        title: "Cal el correu electrònic",
        description:
          "Introdueix el teu correu per rebre l'enllaç de recuperació.",
        variant: "destructive",
      });
      return;
    }

    setResetLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/cuenta`
          : undefined,
    });
    setResetLoading(false);

    if (error) {
      toast({
        title: "No s'ha pogut enviar l'enllaç",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Enllaç de recuperació enviat",
      description: "Revisa el teu correu per restablir la contrasenya.",
    });
  };

  const toggleInterest = (id: string) => {
    setRegInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => setTab(v as "register" | "login")}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="register">Registro</TabsTrigger>
        <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
      </TabsList>

      {/* ====================== PESTANYA REGISTRE ====================== */}
      <TabsContent value="register" className="mt-4">
        {regDone ? (
          <div className="flex flex-col items-center py-8 text-center">
            <CheckCircle2 className="mb-4 h-12 w-12 text-accent" />
            <h3 className="mb-2 font-serif text-xl font-semibold text-primary">
              Revisa el teu correu
            </h3>
            <p className="text-sm text-muted-foreground">
              T&apos;hem enviat un enllaç de confirmació a{" "}
              <strong className="text-foreground">{regEmail}</strong>.
              Fes-hi clic per activar el teu compte.
            </p>
            <Button
              className="mt-6"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Tancar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Google */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogle}
              disabled={regLoading}
            >
              <GoogleIcon className="h-4 w-4" />
              Continuar con Google
            </Button>

            {/* Divider */}
            <div className="relative py-1">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                o regístrate con email
              </span>
            </div>

            {/* Campos */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-name">
                Nombre <span className="text-accent">*</span>
              </Label>
              <Input
                id="reg-name"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Ej: María Puig"
                className="bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-email">
                Email <span className="text-accent">*</span>
              </Label>
              <Input
                id="reg-email"
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="nombre@empresa.com"
                className="bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-company">Empresa (opcional)</Label>
              <Input
                id="reg-company"
                value={regCompany}
                onChange={(e) => setRegCompany(e.target.value)}
                placeholder="Criteri ESG S.L."
                className="bg-background"
              />
            </div>

            {/* Intereses */}
            <div className="space-y-2">
              <Label>Intereses</Label>
              <div className="grid grid-cols-1 gap-2 rounded-md border border-rule bg-background p-3 sm:grid-cols-2">
                {INTERESES.map((interest) => {
                  const checked = regInterests.includes(interest.id);
                  return (
                    <div
                      key={interest.id}
                      className="flex items-start gap-2"
                    >
                      <Checkbox
                        id={`reg-int-${interest.id}`}
                        checked={checked}
                        onCheckedChange={() => toggleInterest(interest.id)}
                      />
                      <Label
                        htmlFor={`reg-int-${interest.id}`}
                        className="cursor-pointer text-xs font-normal leading-snug"
                      >
                        {interest.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Newsletter + idioma */}
            <div className="rounded-md border border-rule bg-secondary/40 p-3">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="reg-newsletter"
                  checked={regNewsletter}
                  onCheckedChange={(v) => setRegNewsletter(v === true)}
                />
                <div className="flex-1 space-y-2">
                  <Label
                    htmlFor="reg-newsletter"
                    className="cursor-pointer text-sm font-normal leading-snug"
                  >
                    Vull rebre la newsletter quinzenal d&apos;ESG amb els
                    informes destacats.
                  </Label>
                  {regNewsletter && (
                    <div className="pt-1">
                      <p className="mb-2 text-xs text-muted-foreground">
                        Idioma de la newsletter:
                      </p>
                      <RadioGroup
                        value={regNewsletterLang}
                        onValueChange={(v) =>
                          setRegNewsletterLang(v as "es" | "ca")
                        }
                        className="flex gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="es" id="reg-lang-es" />
                          <Label
                            htmlFor="reg-lang-es"
                            className="cursor-pointer text-xs font-normal"
                          >
                            Español
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="ca" id="reg-lang-ca" />
                          <Label
                            htmlFor="reg-lang-ca"
                            className="cursor-pointer text-xs font-normal"
                          >
                            Catalán
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Plan */}
            <div className="space-y-2">
              <Label>Plan</Label>
              <RadioGroup
                value={regPlan}
                onValueChange={(v) => setRegPlan(v as "free" | "premium")}
                className="grid grid-cols-2 gap-2"
              >
                <Label
                  htmlFor="reg-plan-free"
                  className={`flex cursor-pointer flex-col gap-1 rounded-md border p-3 transition-colors ${
                    regPlan === "free"
                      ? "border-accent bg-accent-soft/15"
                      : "border-rule bg-background hover:border-accent/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="free" id="reg-plan-free" />
                    <span className="font-serif text-sm font-semibold text-primary">
                      Gratis
                    </span>
                  </div>
                  <span className="pl-6 text-xs text-muted-foreground">
                    3 informes al mes · accés bàsic
                  </span>
                </Label>
                <Label
                  htmlFor="reg-plan-premium"
                  className={`flex cursor-pointer flex-col gap-1 rounded-md border p-3 transition-colors ${
                    regPlan === "premium"
                      ? "border-accent bg-accent-soft/15"
                      : "border-rule bg-background hover:border-accent/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="premium" id="reg-plan-premium" />
                    <span className="font-serif text-sm font-semibold text-primary">
                      Premium
                    </span>
                  </div>
                  <span className="pl-6 text-xs text-muted-foreground">
                    Informes il·limitats · cross-reference
                  </span>
                </Label>
              </RadioGroup>
            </div>

            {/* GDPR */}
            <div className="flex items-start gap-2">
              <Checkbox
                id="reg-gdpr"
                checked={regGdpr}
                onCheckedChange={(v) => setRegGdpr(v === true)}
                required
              />
              <Label
                htmlFor="reg-gdpr"
                className="cursor-pointer text-xs font-normal leading-snug text-muted-foreground"
              >
                He llegit i accepto la{" "}
                <a
                  href="/politica-privacitat"
                  className="text-accent underline hover:text-accent-deep"
                >
                  política de privacitat
                </a>{" "}
                i el tractament de les meves dades segons el RGPD.
                <span className="text-accent"> *</span>
              </Label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={regLoading || !regGdpr}
            >
              {regLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creant compte…
                </>
              ) : regPlan === "premium" ? (
                <>
                  Continuar a pago Premium
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                "Crear cuenta gratis"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              En registrar-te acceptes els{" "}
              <a
                href="/termes"
                className="text-accent underline hover:text-accent-deep"
              >
                termes del servei
              </a>
              .
            </p>
          </form>
        )}
      </TabsContent>

      {/* ====================== PESTANYA LOGIN ====================== */}
      <TabsContent value="login" className="mt-4 space-y-4">
        {/* Google */}
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogle}
        >
          <GoogleIcon className="h-4 w-4" />
          Continuar con Google
        </Button>

        {/* Divider + Magic link */}
        <div className="relative py-1">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
            o inicia sesión con email
          </span>
        </div>

        {magicSent ? (
          <div className="rounded-md border border-accent/30 bg-accent-soft/10 p-4 text-center">
            <Mail className="mx-auto mb-2 h-6 w-6 text-accent" />
            <p className="text-sm text-foreground">
              T&apos;hem enviat un enllaç màgic a{" "}
              <strong>{magicEmail}</strong>. Fes-hi clic per iniciar sessió.
            </p>
            <Button
              variant="link"
              size="sm"
              className="mt-2"
              onClick={() => setMagicSent(false)}
            >
              Reenviar a un altre correu
            </Button>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="magic-email">Email</Label>
              <Input
                id="magic-email"
                type="email"
                required
                value={magicEmail}
                onChange={(e) => setMagicEmail(e.target.value)}
                placeholder="nombre@empresa.com"
                className="bg-background"
              />
            </div>
            <Button
              type="submit"
              variant="secondary"
              className="w-full"
              disabled={magicLoading || !magicEmail.trim()}
            >
              {magicLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviant…
                </>
              ) : (
                "Enviar enlace mágico"
              )}
            </Button>
          </form>
        )}

        {/* Divider + Contrasenya */}
        <div className="relative py-1">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
            o con contraseña
          </span>
        </div>

        <form onSubmit={handlePasswordLogin} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="login-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="login-email"
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="nombre@empresa.com"
                className="bg-background pl-8"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="login-password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="login-password"
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background pl-8"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={resetLoading}
              className="text-xs text-accent underline-offset-2 hover:underline disabled:opacity-50"
            >
              {resetLoading ? "Enviant…" : "¿Olvidaste tu contraseña?"}
            </button>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={loginLoading || !loginEmail.trim() || !loginPassword}
          >
            {loginLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Iniciant…
              </>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}

/**
 * Genera una contrasenya temporal segura per als registres amb email.
 * Supabase requereix contrasenya per `signUp`, però l'accés real es fa via
 * magic link / confirmació per email.
 */
function generateTempPassword(): string {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return `Criteri-${window.crypto.randomUUID()}!`;
  }
  return `Criteri-${Math.random().toString(36).slice(2)}-${Date.now()}!`;
}
