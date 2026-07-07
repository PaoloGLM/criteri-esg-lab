"use client";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X, LogIn } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onOpenPreus?: () => void;
  onOpenQuiSom?: () => void;
}

export function Header({ onOpenPreus, onOpenQuiSom }: HeaderProps = {}) {
  const { lang, setLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rule bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-semibold tracking-tight text-primary">
            Criteri<span className="text-accent">.</span>
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:inline">
            ESG
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#informes" className="editorial-link text-sm font-medium text-foreground/80 hover:text-foreground">
            {t("nav.informes")}
          </a>
          <a href="#certificacions" className="editorial-link text-sm font-medium text-foreground/80 hover:text-foreground">
            {t("nav.certificacions")}
          </a>
          <button
            onClick={onOpenQuiSom}
            className="editorial-link text-sm font-medium text-foreground/80 hover:text-foreground"
          >
            {t("nav.quisom")}
          </button>
          <button
            onClick={onOpenPreus}
            className="editorial-link text-sm font-medium text-foreground/80 hover:text-foreground"
          >
            {t("nav.preus")}
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label={t("nav.cerca")}
            className="h-9 w-9"
          >
            <Search className="h-4 w-4" />
          </Button>

          <div className="flex items-center rounded-md border border-rule p-0.5">
            <button
              onClick={() => setLang("ca")}
              className={`rounded-sm px-2 py-1 text-xs font-medium transition-colors ${
                lang === "ca" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              CAT
            </button>
            <button
              onClick={() => setLang("es")}
              className={`rounded-sm px-2 py-1 text-xs font-medium transition-colors ${
                lang === "es" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ES
            </button>
          </div>

          <Button variant="outline" size="sm" className="hidden md:inline-flex">
            <LogIn className="mr-1 h-3.5 w-3.5" />
            {t("nav.login")}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-rule bg-secondary/40 px-4 py-3 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-3xl items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              placeholder={t("nav.cerca")}
              className="border-none bg-transparent shadow-none focus-visible:ring-0"
            />
            <Button size="sm" variant="default">{t("nav.cerca.btn")}</Button>
          </div>
        </div>
      )}

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-rule bg-background px-4 py-3 md:hidden">
          <a href="#informes" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-left text-sm font-medium text-foreground/80 hover:bg-secondary">
            {t("nav.informes")}
          </a>
          <a href="#certificacions" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-left text-sm font-medium text-foreground/80 hover:bg-secondary">
            {t("nav.certificacions")}
          </a>
          <button
            onClick={() => { setMobileOpen(false); onOpenQuiSom?.(); }}
            className="rounded-md px-3 py-2 text-left text-sm font-medium text-foreground/80 hover:bg-secondary"
          >
            {t("nav.quisom")}
          </button>
          <button
            onClick={() => { setMobileOpen(false); onOpenPreus?.(); }}
            className="rounded-md px-3 py-2 text-left text-sm font-medium text-foreground/80 hover:bg-secondary"
          >
            {t("nav.preus")}
          </button>
          <Button variant="outline" size="sm" className="mt-2 w-full">
            <LogIn className="mr-1 h-3.5 w-3.5" />
            {t("nav.login")}
          </Button>
        </nav>
      )}
    </header>
  );
}
