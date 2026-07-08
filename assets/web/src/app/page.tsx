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
import { RegisterDialog } from "@/components/register-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { QuiSomDialog } from "@/components/qui-som-dialog";

export default function Home() {
  const router = useRouter();
  const [registerOpen, setRegisterOpen] = useState(false);
  const [preusOpen, setPreusOpen] = useState(false);
  const [quiSomOpen, setQuiSomOpen] = useState(false);

  // Obrir l'informe de prova (ESRS) — accés lliure sense registre
  const handleOpenLatestReport = () => {
    router.push("/informes/revisio-esrs-maig-2026");
  };

  // Obrir qualsevol informe — va a la pàgina dedicada
  const handleOpenReport = (slug: string) => {
    router.push(`/informes/${slug}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        onOpenPreus={() => setPreusOpen(true)}
        onOpenQuiSom={() => setQuiSomOpen(true)}
      />
      <main className="flex-1">
        {/* 1. Hero (inclou "Què trobaràs") */}
        <Hero
          onOpenReport={handleOpenLatestReport}
          onOpenRegister={() => setRegisterOpen(true)}
        />

        {/* 2. Estalvia temps, només 5 min (inclou Vuit blocs + botó exemple real) */}
        <MidSections
          onOpenRegister={() => setRegisterOpen(true)}
          onOpenReport={handleOpenLatestReport}
        />

        {/* 3. Biblioteca d'informes (preview 6 caselles + CTA a pàgina completa) */}
        <ReportsPreview onOpenReport={handleOpenReport} />

        {/* 4. FAQ */}
        <FaqSection />

        {/* 5. CTA final */}
        <FinalCta onOpenRegister={() => setRegisterOpen(true)} />
      </main>
      <Footer />

      {/* Modals */}
      <RegisterDialog open={registerOpen} onOpenChange={setRegisterOpen} />
      <PreusDialog
        open={preusOpen}
        onOpenChange={setPreusOpen}
        onOpenRegister={() => setRegisterOpen(true)}
      />
      <QuiSomDialog
        open={quiSomOpen}
        onOpenChange={setQuiSomOpen}
      />
    </div>
  );
}
