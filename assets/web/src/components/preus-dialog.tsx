"use client";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown } from "lucide-react";

interface PreusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenRegister: () => void;
}

type BillingPeriod = "monthly" | "annual";

export function PreusDialog({ open, onOpenChange, onOpenRegister }: PreusDialogProps) {
  const { t } = useLanguage();
  const [period, setPeriod] = useState<BillingPeriod>("annual");

  const handleCta = () => {
    onOpenChange(false);
    onOpenRegister();
  };

  // Preu Premium segons el toggle
  const premiumPrice = period === "monthly" ? "39€" : "440€";
  const premiumPeriodLabel = period === "monthly" ? t("preus.period.month") : t("preus.period.year");
  const premiumSubprice = period === "monthly"
    ? (t("preus.premium.subprice.monthly") as string)
    : (t("preus.premium.subprice") as string);
  const premiumCta = period === "monthly"
    ? (t("preus.premium.cta.monthly") as string)
    : (t("preus.premium.cta") as string);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            {t("preus.eyebrow")}
          </p>
          <DialogTitle className="font-serif text-3xl font-semibold text-primary sm:text-4xl">
            {t("preus.title")}
          </DialogTitle>
          <DialogDescription className="text-base text-foreground/70">
            {t("preus.subtitle")}
          </DialogDescription>
        </DialogHeader>

        {/* Toggle Mensual / Anual */}
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
          <div className="flex items-center rounded-md border border-rule p-0.5">
            <button
              onClick={() => setPeriod("monthly")}
              className={`rounded-sm px-4 py-1.5 text-sm font-medium transition-colors ${
                period === "monthly"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("preus.toggle.monthly")}
            </button>
            <button
              onClick={() => setPeriod("annual")}
              className={`rounded-sm px-4 py-1.5 text-sm font-medium transition-colors ${
                period === "annual"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("preus.toggle.annual")}
            </button>
          </div>
          {period === "annual" && (
            <p className="text-xs text-accent-deep">{t("preus.toggle.annual.note")}</p>
          )}
        </div>

        <div className="mt-2 grid gap-5 md:grid-cols-3">
          {/* Free */}
          <PlanCard
            name={t("preus.free.name")}
            price="0€"
            period={t("preus.period.forever")}
            description={t("preus.free.description")}
            features={[
              t("preus.free.f1"),
              t("preus.free.f2"),
              t("preus.free.f3"),
              t("preus.free.f4"),
            ]}
            cta={t("preus.free.cta")}
            onCta={handleCta}
          />

          {/* Premium */}
          <PlanCard
            name={t("preus.premium.name")}
            price={premiumPrice}
            period={premiumPeriodLabel}
            badge={period === "annual" ? t("preus.premium.badge") : undefined}
            description={t("preus.premium.description")}
            features={[
              t("preus.premium.f1"),
              t("preus.premium.f2"),
              t("preus.premium.f3"),
              t("preus.premium.f4"),
              t("preus.premium.f5"),
              t("preus.premium.f6"),
            ]}
            cta={premiumCta}
            onCta={handleCta}
            highlighted
            subprice={premiumSubprice}
          />

          {/* Ultra */}
          <PlanCard
            name={t("preus.ultra.name")}
            price="89€"
            period={t("preus.period.month")}
            badge={t("preus.ultra.badge")}
            description={t("preus.ultra.description")}
            features={[
              t("preus.ultra.f1"),
              t("preus.ultra.f2"),
              t("preus.ultra.f3"),
              t("preus.ultra.f4"),
            ]}
            cta={t("preus.ultra.cta")}
            onCta={handleCta}
            icon={<Crown className="h-4 w-4" />}
            disabled
          />
        </div>

        {/* Early bird — requadre especial a sota */}
        <div className="mt-6 rounded-md border-2 border-accent bg-accent-soft/15 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent-deep mb-2">
                {t("preus.earlybird.eyebrow")}
              </p>
              <h3 className="font-serif text-xl font-semibold text-primary mb-2">
                {t("preus.earlybird.title")}
              </h3>
              <p className="text-sm leading-relaxed text-foreground/80 mb-2">
                {t("preus.earlybird.body")}
              </p>
              <p className="text-xs font-medium text-accent-deep">
                {t("preus.earlybird.subprice")}
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-4xl font-semibold text-accent">{t("preus.earlybird.price")}</span>
                <span className="text-xs text-muted-foreground">/ {t("preus.earlybird.period")}</span>
              </div>
              <Button onClick={handleCta} className="w-full sm:w-auto">
                {t("preus.earlybird.cta")}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-md border border-accent/30 bg-accent-soft/10 p-4">
          <p className="text-sm leading-relaxed text-foreground/80">
            <strong className="text-accent-deep">{t("preus.note.title")}</strong>{" "}
            {t("preus.note.body")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PlanCard({
  name,
  price,
  period,
  oldPrice,
  badge,
  description,
  features,
  cta,
  onCta,
  highlighted,
  disabled,
  icon,
  subprice,
}: {
  name: string;
  price: string;
  period: string;
  oldPrice?: string;
  badge?: string;
  description: string;
  features: string[];
  cta: string;
  onCta: () => void;
  highlighted?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  subprice?: string;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-md border p-5 ${
        disabled
          ? "border-rule bg-secondary/30"
          : highlighted
            ? "border-accent bg-accent-soft/15 shadow-sm"
            : "border-rule bg-card"
      }`}
    >
      {disabled && (
        <div className="absolute inset-0 rounded-md bg-background/40" aria-hidden />
      )}
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="font-serif text-xl font-semibold text-primary">{name}</h3>
          {badge && (
            <span className="mt-1 inline-block rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent-foreground">
              {badge}
            </span>
          )}
        </div>
        {icon && <span className="text-accent-deep">{icon}</span>}
      </div>

      <div className="mb-1 flex items-baseline gap-2">
        <span className="font-serif text-4xl font-semibold text-accent">{price}</span>
        <span className="text-xs text-muted-foreground">/ {period}</span>
      </div>
      {oldPrice && (
        <p className="mb-1 text-xs text-muted-foreground line-through">
          {oldPrice} / {period}
        </p>
      )}
      {subprice && (
        <p className="mb-3 text-xs font-medium text-accent-deep">{subprice}</p>
      )}

      <p className="mb-4 text-sm leading-relaxed text-foreground/70">{description}</p>

      <ul className="mb-5 space-y-2 text-sm">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-accent" />
            <span className="text-foreground/80">{f}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={onCta}
        variant={highlighted ? "default" : "outline"}
        disabled={disabled}
        className="mt-auto w-full"
      >
        {cta}
      </Button>
    </div>
  );
}
