"use client";

import { useState } from "react";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";
import { Heart, Cpu, Users, Mail } from "lucide-react";

export default function QuiSomPage() {
  const { t } = useLanguage();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);

  const openAuth = (tab: "register" | "login" = "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  // Membres de l'equip (amb icona + claus i18n per rol i bio)
  const teamMembers: {
    name: string;
    icon: React.ReactNode;
    roleKey:
      | "quisom.team.paolo.role"
      | "quisom.team.techlead.role"
      | "quisom.team.zai.role";
    bioKey:
      | "quisom.team.paolo.bio"
      | "quisom.team.techlead.bio"
      | "quisom.team.zai.bio";
    isAI?: boolean;
  }[] = [
    {
      name: "Paolo",
      icon: <Heart className="h-5 w-5" />,
      roleKey: "quisom.team.paolo.role",
      bioKey: "quisom.team.paolo.bio",
    },
    {
      name: "Tech Lead",
      icon: <Cpu className="h-5 w-5" />,
      roleKey: "quisom.team.techlead.role",
      bioKey: "quisom.team.techlead.bio",
    },
    {
      name: "Assistent d'IA",
      icon: <Users className="h-5 w-5" />,
      roleKey: "quisom.team.zai.role",
      bioKey: "quisom.team.zai.bio",
      isAI: true,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        onOpenPreus={() => setPreusOpen(true)}
        onOpenAuth={(tab) => openAuth(tab || "register")}
      />
      <main className="flex-1">
        {/* Page hero */}
        <section className="border-b border-rule bg-secondary/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="eyebrow mb-2">{t("quisom.page.eyebrow")}</p>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-primary sm:text-5xl">
              {t("quisom.page.title")}
            </h1>
            <div className="rule-accent my-5" />
            <p className="max-w-2xl text-base leading-relaxed text-foreground/80">
              {t("quisom.page.subtitle")}
            </p>
          </div>
        </section>

        {/* Manifest */}
        <section className="border-b border-rule py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-md border-l-2 border-accent bg-accent-soft/10 p-5">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent-deep">
                {t("quisom.manifest.page.eyebrow")}
              </p>
              <p className="font-serif text-lg leading-relaxed text-foreground italic">
                {t("quisom.manifest.page.body")}
              </p>
            </div>
          </div>
        </section>

        {/* Equip */}
        <section className="border-b border-rule bg-secondary/30 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="eyebrow mb-3">{t("quisom.team.eyebrow")}</p>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-primary sm:text-4xl">
                {t("quisom.team.title")}
              </h2>
              <div className="rule-accent my-5" />
              <p className="max-w-2xl text-base leading-relaxed text-foreground/80">
                {t("quisom.team.intro")}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member, i) => (
                <div
                  key={i}
                  className={`flex flex-col rounded-md border p-5 ${
                    member.isAI
                      ? "border-accent/40 bg-accent-soft/10"
                      : "border-rule bg-card"
                  }`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className={`inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                        member.isAI
                          ? "bg-accent/15 text-accent"
                          : "bg-secondary text-accent-deep"
                      }`}
                    >
                      {member.icon}
                    </span>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-primary">
                        {member.name}
                      </h3>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-accent-deep">
                        {t(member.roleKey)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/75">
                    {t(member.bioKey)}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA "Vols formar-ne part?" */}
            <div className="mt-8 rounded-md border border-rule bg-card p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="mb-2 font-serif text-lg font-semibold text-primary">
                    {t("quisom.team.join.title")}
                  </h3>
                  <p className="max-w-xl text-sm leading-relaxed text-foreground/75">
                    {t("quisom.team.join.body")}
                  </p>
                </div>
                <a
                  href="mailto:info@criteriesg.com"
                  className="inline-flex h-11 flex-shrink-0 items-center justify-center gap-2 rounded-md border border-rule bg-background px-6 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent-deep"
                >
                  <Mail className="h-4 w-4" />
                  info@criteriesg.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Tancament */}
        <section className="border-b border-rule py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-md border-l-2 border-accent bg-accent-soft/10 p-5">
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-accent-deep">
                {t("quisom.page.closing.eyebrow")}
              </p>
              <p className="font-serif text-lg leading-relaxed text-foreground italic">
                {t("quisom.page.closing.body")}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog
        open={preusOpen}
        onOpenChange={setPreusOpen}
        onOpenRegister={() => openAuth("register")}
      />
    </div>
  );
}
