"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/components/language-provider";
import { Loader2, Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "register" | "login";
}

/**
 * Diàleg d'autenticació (registre + inici de sessió).
 *
 * Disseny: basat en mockup-03-registro-final (terra + coure, bilingüe via i18n,
 * mateixa estètica que el formulari Fiare). Tots els texts venen de i18n.ts.
 *
 * NOTA: No fem servir cap useEffect que tanqui el diàleg automàticament
 * quan l'usuari està loguejat. El component pare és responsable de NO
 * obrir aquest diàleg si l'usuari ja té sessió (perquè en lloc d'això
 * ha d'obrir el PreusDialog o amagar el CTA segons el pla).
 */
export function AuthDialog({
  open,
  onOpenChange,
  defaultTab = "register",
}: AuthDialogProps) {
  const { t } = useLanguage();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-primary">
            {t("auth.title")}
          </DialogTitle>
          <DialogDescription>{t("auth.subtitle")}</DialogDescription>
        </DialogHeader>

        {open && (
          <AuthDialogInner
            defaultTab={defaultTab}
            onOpenChange={onOpenChange}
          />
        )}

        {!isSupabaseConfigured() && (
          <div className="mt-3 flex items-start gap-2 rounded-md border border-rule bg-secondary/40 p-3 text-xs text-muted-foreground">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-accent-deep" />
            <span>{t("auth.supabase.notconfigured")}</span>
          </div>
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
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();

  const [tab, setTab] = useState<"register" | "login">(defaultTab);

  // --- Estat registre ---
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regCompany, setRegCompany] = useState("");
  const [regSector, setRegSector] = useState("");
  const [regInterests, setRegInterests] = useState<string[]>([]);
  const [regNewsletter, setRegNewsletter] = useState(true);
  // Default newsletter language: 'es' (decisió editorial de Paolo - CONTEXT decisió 12)
  const [regNewsletterLang, setRegNewsletterLang] = useState<"es" | "ca">("es");
  const [regPlan, setRegPlan] = useState<"free" | "premium">("free");
  const [regGdpr, setRegGdpr] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regDone, setRegDone] = useState(false);

  // --- Estat login (magic link) ---
  const [magicEmail, setMagicEmail] = useState("");
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  const supabaseConfigured = isSupabaseConfigured();

  // Si per alguna raó l'usuari ja està loguejat i s'obre el diàleg, no fem
  // res especial: simplement el diàleg es mostra. El component pare hauria
  // d'evitar obrir-lo en aquest cas, però per robustesa no el tanquem
  // automàticament (això era el bug anterior).
  void user;

  const handleGoogle = async () => {
    if (!supabaseConfigured) {
      toast({
        title: t("auth.supabase.notconfigured"),
        variant: "destructive",
      });
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
    if (error) {
      toast({
        title: t("auth.toast.error.login"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  /** SSO LinkedIn (OIDC) — mateix flux que Google. */
  const handleLinkedIn = async () => {
    if (!supabaseConfigured) {
      toast({
        title: t("auth.supabase.notconfigured"),
        variant: "destructive",
      });
      return;
    }
    setRegLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "linkedin_oidc",
      options: {
        redirectTo:
          typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
    setRegLoading(false);
    if (error) {
      toast({
        title: t("auth.toast.error.login"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  function LinkedInIcon({ className }: { className?: string }) {
    return (
      <svg className={className} viewBox="0 0 24 24" width="16" height="16">
        <path fill="#0A66C2" d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z" />
      </svg>
    );
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!regGdpr) {
      toast({
        title: t("auth.gdpr.error"),
        variant: "destructive",
      });
      return;
    }

    if (!supabaseConfigured) {
      // En mode demo, simulem l'èxit
      setRegDone(true);
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
          sector: regSector,
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
        title: t("auth.toast.error.register"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Apuntar a Brevo per a la newsletter (no bloqueja el registre si falla)
    if (regNewsletter) {
      try {
        await fetch("/api/brevo-subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: regEmail.trim(),
            name: regName.trim(),
            lang: regNewsletterLang,
          }),
        });
      } catch (e) {
        console.warn("[auth] No s'ha pogut apuntar a Brevo:", e);
      }
    }

    if (data.session) {
      toast({
        title: t("auth.toast.welcome"),
        description: t("auth.toast.welcome.body"),
      });
      onOpenChange(false);
      return;
    }

    setRegDone(true);
    toast({
      title: t("auth.success.register.title"),
      description: t("auth.success.register.body"),
    });
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!magicEmail.trim()) return;

    if (!supabaseConfigured) {
      setMagicSent(true);
      return;
    }

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
        title: t("auth.toast.error.magic"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setMagicSent(true);
    toast({
      title: t("auth.toast.magic.sent"),
      description: t("auth.toast.magic.sent.body"),
    });
  };

  const toggleInterest = (id: string) => {
    setRegInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const interests: { id: string; key: "form.interest.csrd" | "form.interest.ecovadis" | "form.interest.bcorp" | "form.interest.msci" | "form.interest.taxonomy" | "form.interest.csddd" | "form.interest.humanrights" | "form.interest.climate" }[] = [
    { id: "csrd", key: "form.interest.csrd" },
    { id: "ecovadis", key: "form.interest.ecovadis" },
    { id: "bcorp", key: "form.interest.bcorp" },
    { id: "msci", key: "form.interest.msci" },
    { id: "taxonomy", key: "form.interest.taxonomy" },
    { id: "csddd", key: "form.interest.csddd" },
    { id: "humanrights", key: "form.interest.humanrights" },
    { id: "climate", key: "form.interest.climate" },
  ];

  const sectorOptions: { value: string; key: "form.sector.consultant" | "form.sector.director" | "form.sector.compliance" | "form.sector.investor" | "form.sector.ngo" | "form.sector.public" | "form.sector.other" }[] = [
    { value: "consultant", key: "form.sector.consultant" },
    { value: "director", key: "form.sector.director" },
    { value: "compliance", key: "form.sector.compliance" },
    { value: "investor", key: "form.sector.investor" },
    { value: "ngo", key: "form.sector.ngo" },
    { value: "public", key: "form.sector.public" },
    { value: "other", key: "form.sector.other" },
  ];

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => setTab(v as "register" | "login")}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="register">{t("auth.tab.register")}</TabsTrigger>
        <TabsTrigger value="login">{t("auth.tab.login")}</TabsTrigger>
      </TabsList>

      {/* ====================== PESTANYA REGISTRE ====================== */}
      <TabsContent value="register" className="mt-4">
        {regDone ? (
          <div className="flex flex-col items-center py-8 text-center">
            <CheckCircle2 className="mb-4 h-12 w-12 text-accent" />
            <h3 className="mb-2 font-serif text-xl font-semibold text-primary">
              {t("auth.success.register.title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("auth.success.register.body")}
            </p>
            <Button
              className="mt-6"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("auth.close")}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Banner Premium gratis 2 mesos (v7) */}
            <div
              className="px-4 py-3 text-center"
              style={{
                background: "rgba(94,135,114,.1)",
                border: "1px solid var(--accent, #5E8772)",
                borderRadius: "6px",
              }}
            >
              <p className="font-serif text-sm italic" style={{ color: "var(--ink-deep, #141B18)" }}>
                {t("auth.register.free_premium_banner")}
              </p>
            </div>
            {/* SSO: Google + LinkedIn (grid 2 cols, sense solapaments) */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogle}
                disabled={regLoading}
              >
                <GoogleIcon className="h-4 w-4" />
                {t("auth.google")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleLinkedIn}
                disabled={regLoading}
              >
                <LinkedInIcon className="h-4 w-4" />
                {t("auth.linkedin")}
              </Button>
            </div>

            {/* Divider */}
            <div className="relative py-1">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                {t("auth.divider.register")}
              </span>
            </div>

            {/* Camps */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-name">
                {t("auth.name")} <span className="text-accent">*</span>
              </Label>
              <Input
                id="reg-name"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder={t("form.name.placeholder")}
                className="bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-email">
                {t("auth.email")} <span className="text-accent">*</span>
              </Label>
              <Input
                id="reg-email"
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="nom@empresa.com"
                className="bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-company">{t("auth.company")}</Label>
              <Input
                id="reg-company"
                value={regCompany}
                onChange={(e) => setRegCompany(e.target.value)}
                placeholder="Criteri ESG S.L."
                className="bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-sector">
                {t("auth.sector")} <span className="text-accent">*</span>
              </Label>
              <Select
                value={regSector}
                onValueChange={setRegSector}
                required
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={t("auth.sector.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {sectorOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {t(opt.key)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Interesses */}
            <div className="space-y-2">
              <Label>{t("auth.interests")}</Label>
              <div className="grid grid-cols-1 gap-2 rounded-md border border-rule bg-background p-3 sm:grid-cols-2">
                {interests.map((interest) => {
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
                        {t(interest.key)}
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
                    {t("auth.newsletter.title")}
                  </Label>
                  {regNewsletter && (
                    <div className="pt-1">
                      <p className="mb-2 text-xs text-muted-foreground">
                        {t("auth.newsletter.lang")}
                      </p>
                      <RadioGroup
                        value={regNewsletterLang}
                        onValueChange={(v) =>
                          setRegNewsletterLang(v as "es" | "ca")
                        }
                        className="flex gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="ca" id="reg-lang-ca" />
                          <Label
                            htmlFor="reg-lang-ca"
                            className="cursor-pointer text-xs font-normal"
                          >
                            Català
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="es" id="reg-lang-es" />
                          <Label
                            htmlFor="reg-lang-es"
                            className="cursor-pointer text-xs font-normal"
                          >
                            Español
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
              <Label>{t("auth.plan")}</Label>
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
                      {t("auth.plan.free")}
                    </span>
                  </div>
                  <span className="pl-6 text-xs text-muted-foreground">
                    {t("auth.plan.free.desc")}
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
                      {t("auth.plan.premium")}
                    </span>
                  </div>
                  <span className="pl-6 text-xs text-muted-foreground">
                    {t("auth.plan.premium.desc")}
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
                {t("auth.gdpr")}{" "}
                <a
                  href="/privacidad.html"
                  className="text-accent underline hover:text-accent-deep"
                >
                  política de privacitat
                </a>
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
                  {t("auth.loading.register")}
                </>
              ) : regPlan === "premium" ? (
                <>
                  {t("auth.submit.register.premium")}
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  {t("auth.submit.register.free")}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              {t("auth.terms")}
            </p>
          </form>
        )}
      </TabsContent>

      {/* ====================== PESTANYA LOGIN ====================== */}
      <TabsContent value="login" className="mt-4 space-y-4">
              {/* SSO: Google + LinkedIn */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogle}
                  disabled={magicLoading}
                >
                  <GoogleIcon className="h-4 w-4" />
                  {t("auth.google")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleLinkedIn}
                  disabled={magicLoading}
                >
                  <LinkedInIcon className="h-4 w-4" />
                  {t("auth.linkedin")}
                </Button>
              </div>

        {/* Divider + Magic link */}
        <div className="relative py-1">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
            {t("auth.divider.login")}
          </span>
        </div>

        {magicSent ? (
          <div className="rounded-md border border-accent/30 bg-accent-soft/10 p-4 text-center">
            <Mail className="mx-auto mb-2 h-6 w-6 text-accent" />
            <p className="text-sm text-foreground">
              {t("auth.magic.sent.body")}{" "}
              <strong>{magicEmail}</strong>
            </p>
            <Button
              variant="link"
              size="sm"
              className="mt-2"
              onClick={() => setMagicSent(false)}
            >
              {t("auth.magic.sent.different")}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="magic-email">{t("auth.email")}</Label>
              <Input
                id="magic-email"
                type="email"
                required
                value={magicEmail}
                onChange={(e) => setMagicEmail(e.target.value)}
                placeholder="nom@empresa.com"
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
                  {t("auth.loading.magic")}
                </>
              ) : (
                t("auth.magic.send")
              )}
            </Button>
          </form>
        )}

        {/* Enllaç creuat: cap camí sense sortida */}
        <p className="text-center text-sm text-muted-foreground">
          {t("auth.noaccount")}{" "}
          <button
            type="button"
            onClick={() => setTab("register")}
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            {t("auth.tab.register")}
          </button>
        </p>
      </TabsContent>
    </Tabs>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="24" height="24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function generateTempPassword(): string {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return `Criteri-${window.crypto.randomUUID()}!`;
  }
  return `Criteri-${Math.random().toString(36).slice(2)}-${Date.now()}!`;
}
