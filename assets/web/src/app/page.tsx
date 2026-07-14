"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { MidSections } from "@/components/sections/mid-sections";
import { ReportsPreview } from "@/components/sections/reports-preview";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCta } from "@/components/sections/final-cta";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { QuiSomDialog } from "@/components/qui-som-dialog";

export default function Home() {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);
  const [quiSomOpen, setQuiSomOpen] = useState(false);

  const openAuth = (tab: "register" | "login" = "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const handleOpenLatestReport = () => {
    router.push("/informes/revisio-esrs-maig-2026");
  };

  const handleOpenReport = (slug: string) => {
    router.push(`/informes/${slug}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        onOpenPreus={() => setPreusOpen(true)}
        onOpenQuiSom={() => setQuiSomOpen(true)}
        onOpenAuth={(tab) => openAuth(tab || "register")}
      />
      <main className="flex-1">
        <Hero
          onOpenReport={handleOpenLatestReport}
          onOpenRegister={() => openAuth("register")}
        />
        <MidSections
          onOpenRegister={() => openAuth("register")}
          onOpenReport={handleOpenLatestReport}
        />
        <ReportsPreview onOpenReport={handleOpenReport} />
        <FaqSection />
        <FinalCta onOpenRegister={() => openAuth("register")} />
      </main>
      <Footer />

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog
        open={preusOpen}
        onOpenChange={setPreusOpen}
        onOpenRegister={() => openAuth("register")}
      />
      <QuiSomDialog
        open={quiSomOpen}
        onOpenChange={setQuiSomOpen}
      />
    </div>
  );
}
