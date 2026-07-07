"use client";

import { useLanguage } from "@/components/language-provider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Heart, Cpu, Eye, Users, Scale, Sprout } from "lucide-react";

interface QuiSomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuiSomDialog({ open, onOpenChange }: QuiSomDialogProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            {t("quisom.eyebrow")}
          </p>
          <DialogTitle className="font-serif text-3xl font-semibold text-primary sm:text-4xl">
            {t("quisom.title")}
          </DialogTitle>
          <DialogDescription className="text-base text-foreground/70">
            {t("quisom.subtitle")}
          </DialogDescription>
        </DialogHeader>

        {/* Manifest */}
        <div className="mt-2 space-y-5">
          <div className="rounded-md border-l-2 border-accent bg-accent-soft/10 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Heart className="h-4 w-4 text-accent" />
              <p className="font-mono text-xs uppercase tracking-widest text-accent-deep">
                {t("quisom.manifest.title")}
              </p>
            </div>
            <p className="font-serif text-lg leading-relaxed text-foreground italic">
              {t("quisom.manifest.body")}
            </p>
          </div>

          <p className="text-base leading-relaxed text-foreground/80">
            {t("quisom.paragraph1")}
          </p>

          <p className="text-base leading-relaxed text-foreground/80">
            {t("quisom.paragraph2")}
          </p>

          {/* 3 pilars */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Pillar
              icon={<Heart className="h-5 w-5" />}
              title={t("quisom.pilar1.title")}
              body={t("quisom.pilar1.body")}
            />
            <Pillar
              icon={<Cpu className="h-5 w-5" />}
              title={t("quisom.pilar2.title")}
              body={t("quisom.pilar2.body")}
            />
            <Pillar
              icon={<Eye className="h-5 w-5" />}
              title={t("quisom.pilar3.title")}
              body={t("quisom.pilar3.body")}
            />
          </div>

          {/* Sistema d'IA */}
          <div className="rounded-md border border-accent/30 bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-accent" />
              <p className="font-mono text-xs uppercase tracking-widest text-accent-deep">
                {t("quisom.ai.title")}
              </p>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              {t("quisom.ai.body")}
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-md border border-rule bg-secondary/30 p-3">
              <Users className="h-4 w-4 flex-shrink-0 text-accent-deep" />
              <p className="text-xs leading-relaxed text-foreground/75">
                <strong className="text-accent-deep">{t("quisom.ai.supervision.title")}</strong>{" "}
                {t("quisom.ai.supervision.body")}
              </p>
            </div>
          </div>

          {/* Criteris i valors */}
          <div className="rounded-md border border-accent/30 bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Scale className="h-4 w-4 text-accent" />
              <p className="font-mono text-xs uppercase tracking-widest text-accent-deep">
                {t("quisom.valors.title")}
              </p>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-foreground/80">
              {t("quisom.valors.intro")}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Valor
                icon={<Scale className="h-4 w-4" />}
                title={t("quisom.valors.etica.title")}
                body={t("quisom.valors.etica.body")}
              />
              <Valor
                icon={<Sprout className="h-4 w-4" />}
                title={t("quisom.valors.economia.title")}
                body={t("quisom.valors.economia.body")}
              />
              <Valor
                icon={<Heart className="h-4 w-4" />}
                title={t("quisom.valors.dignitat.title")}
                body={t("quisom.valors.dignitat.body")}
              />
              <Valor
                icon={<Users className="h-4 w-4" />}
                title={t("quisom.valors.territori.title")}
                body={t("quisom.valors.territori.body")}
              />
            </div>
          </div>

          {/* Preguntes per millorar (Premium) */}
          <div className="rounded-md border border-accent bg-accent-soft/15 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Eye className="h-4 w-4 text-accent" />
              <p className="font-mono text-xs uppercase tracking-widest text-accent-deep">
                {t("quisom.preguntes.title")}
              </p>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80 mb-4">
              {t("quisom.preguntes.body")}
            </p>
            <div className="rounded-md border border-rule bg-background p-4">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-accent-deep">
                {t("quisom.preguntes.example.title")}
              </p>
              <p className="font-serif text-base italic leading-relaxed text-foreground">
                {t("quisom.preguntes.example.body")}
              </p>
            </div>
            <p className="mt-3 text-xs font-medium text-accent-deep">
              🔒 {t("quisom.preguntes.cta")}
            </p>
          </div>

          {/* Tancament */}
          <div className="rounded-md border-l-2 border-accent bg-accent-soft/10 p-5">
            <p className="font-serif text-base leading-relaxed text-foreground italic">
              {t("quisom.closing")}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Pillar({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-md border border-rule bg-card p-4">
      <div className="mb-2 text-accent-deep">{icon}</div>
      <h3 className="mb-1.5 font-serif text-base font-semibold text-primary">{title}</h3>
      <p className="text-xs leading-relaxed text-foreground/70">{body}</p>
    </div>
  );
}

function Valor({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-md border border-rule bg-secondary/30 p-4">
      <div className="mb-2 flex items-center gap-2 text-accent-deep">
        {icon}
        <h4 className="font-serif text-sm font-semibold text-primary">{title}</h4>
      </div>
      <p className="text-xs leading-relaxed text-foreground/75">{body}</p>
    </div>
  );
}
