"use client";

import { useState } from "react";
import { Header } from "@/components/site-header-v1";
import { FooterV1 } from "@/components/site-footer-v1";
import { HeroV1 } from "@/components/sections/hero-v1";
import HomePageV1Sections from "@/components/sections/home-v1-sections";
import { AuthDialog } from "@/components/auth-dialog";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");

  const openAuth = (tab: "register" | "login" = "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--paper)" }}>
      <Header onOpenAuth={(tab) => openAuth(tab || "register")} />
      <main className="flex-1">
        <HeroV1 />
        <HomePageV1Sections />
      </main>
      <FooterV1 />
      {!user && <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />}
    </div>
  );
}
