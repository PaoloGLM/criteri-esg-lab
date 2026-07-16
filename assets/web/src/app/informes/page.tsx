"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { ReportsLibrary } from "@/components/sections/reports-library";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";

export default function InformesPage() {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");

  const openAuth = (tab: "register" | "login" = "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };
  const [preusOpen, setPreusOpen] = useState(false);

  const handleOpenReport = (slug: string) => {
    router.push(`/informes/${slug}`);
  };

  // El component ReportsLibrary porta el seu propi eyebrow + H1 + descripció
  // (unificat amb el patró canònic de page hero).
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        onOpenPreus={() => setPreusOpen(true)}
        onOpenAuth={(tab) => openAuth(tab || "register")}
      />
      <main className="flex-1">
        <ReportsLibrary onOpenReport={handleOpenReport} />
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
