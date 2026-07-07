"use client";

import { useState } from "react";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { MidSections } from "@/components/sections/mid-sections";
import { ReportsLibrary } from "@/components/sections/reports-library";
import { FinalCta } from "@/components/sections/final-cta";
import { RegisterDialog } from "@/components/register-dialog";
import { ReportDialog } from "@/components/report-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { QuiSomDialog } from "@/components/qui-som-dialog";

export default function Home() {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [preusOpen, setPreusOpen] = useState(false);
  const [quiSomOpen, setQuiSomOpen] = useState(false);
  const [selectedReportSlug, setSelectedReportSlug] = useState<string | null>(null);

  const handleOpenLatestReport = () => {
    setSelectedReportSlug("revisio-esrs-maig-2026");
    setReportOpen(true);
  };

  const handleOpenReport = (slug: string) => {
    setSelectedReportSlug(slug);
    setReportOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        onOpenPreus={() => setPreusOpen(true)}
        onOpenQuiSom={() => setQuiSomOpen(true)}
      />
      <main className="flex-1">
        <Hero
          onOpenReport={handleOpenLatestReport}
          onOpenRegister={() => setRegisterOpen(true)}
        />
        <ReportsLibrary onOpenReport={handleOpenReport} />
        <MidSections onOpenRegister={() => setRegisterOpen(true)} />
        <FinalCta onOpenRegister={() => setRegisterOpen(true)} />
      </main>
      <Footer />

      {/* Modals */}
      <RegisterDialog open={registerOpen} onOpenChange={setRegisterOpen} />
      <ReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        slug={selectedReportSlug}
      />
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
