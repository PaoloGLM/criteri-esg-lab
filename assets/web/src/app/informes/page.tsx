"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { ReportsLibrary } from "@/components/sections/reports-library";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { QuiSomDialog } from "@/components/qui-som-dialog";

export default function InformesPage() {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [preusOpen, setPreusOpen] = useState(false);
  const [quiSomOpen, setQuiSomOpen] = useState(false);

  const handleOpenReport = (slug: string) => {
    router.push(`/informes/${slug}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        onOpenPreus={() => setPreusOpen(true)}
        onOpenQuiSom={() => setQuiSomOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
      />
      <main className="flex-1">
        <section className="border-b border-rule bg-secondary/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="eyebrow mb-2">
              BIBLIOTECA D'INFORMES
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-primary sm:text-5xl">
              Tots els informes processats.
            </h1>
            <div className="rule-accent my-5" />
            <p className="max-w-2xl text-base leading-relaxed text-foreground/80">
              Cada informe està sintetitzat amb els 8 blocs (Semàfor Metodològic + 7 blocs narratius). Fes servir els filtres per trobar el que necessites.
            </p>
          </div>
        </section>

        <ReportsLibrary onOpenReport={handleOpenReport} />
      </main>
      <Footer />

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      <PreusDialog
        open={preusOpen}
        onOpenChange={setPreusOpen}
        onOpenRegister={() => setAuthOpen(true)}
      />
      <QuiSomDialog
        open={quiSomOpen}
        onOpenChange={setQuiSomOpen}
      />
    </div>
  );
}
