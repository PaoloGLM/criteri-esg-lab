"use client";

import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X, LogIn, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onOpenPreus?: () => void;
  onOpenAuth?: (tab?: "register" | "login") => void;
}

export function Header({ onOpenPreus, onOpenAuth }: HeaderProps = {}) {
  const { lang, setLang, t } = useLanguage();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rule bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-semibold tracking-tight text-primary">
            Criteri<span className="text-accent">.</span>
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:inline">
            ESG
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="/informes" className="editorial-link text-sm font-medium text-foreground/80 hover:text-foreground">
            {t("nav.informes")}
          </a>
          <a href="/que-fem" className="editorial-link text-sm font-medium text-foreground/80 hover:text-foreground">
            {t("nav.quefem")}
          </a>
          <a href="/estandares-esg" className="editorial-link text-sm font-medium text-foreground/80 hover:text-foreground">
            {t("nav.estandares")}
          </a>
          <a href="/preus" className="editorial-link text-sm font-medium text-foreground/80 hover:text-foreground">
            {t("nav.preus")}
          </a>
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

          {/* Auth: mostrar usuario o botón login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-md border border-rule px-3 py-1.5 text-sm font-medium text-foreground hover:border-accent transition-colors"
              >
                <User className="h-4 w-4 text-accent" />
                <span className="hidden sm:inline max-w-[120px] truncate">
                  {user.user_metadata?.full_name ||
                    user.email?.split("@")[0] ||
                    t("nav.user.default")}
                </span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-md border border-rule bg-card shadow-lg z-50">
                  <a
                    href="/cuenta"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-secondary rounded-t-md"
                  >
                    <User className="h-4 w-4" />
                    {t("nav.cuenta")}
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-secondary rounded-b-md"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("nav.logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="hidden md:inline-flex"
              onClick={() => onOpenAuth?.("login")}
            >
              <LogIn className="mr-1 h-3.5 w-3.5" />
              {t("nav.login")}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t("nav.menu")}
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
          <a href="/informes" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-left text-sm font-medium text-foreground/80 hover:bg-secondary">
            {t("nav.informes")}
          </a>
          <a href="/que-fem" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-left text-sm font-medium text-foreground/80 hover:bg-secondary">
            {t("nav.quefem")}
          </a>
          <a href="/estandares-esg" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-left text-sm font-medium text-foreground/80 hover:bg-secondary">
            {t("nav.estandares")}
          </a>
          <a href="/preus" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-left text-sm font-medium text-foreground/80 hover:bg-secondary">
            {t("nav.preus")}
          </a>
          {user ? (
            <>
              <a href="/cuenta" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-left text-sm font-medium text-foreground/80 hover:bg-secondary">
                {t("nav.cuenta")}
              </a>
              <button
                onClick={() => { setMobileOpen(false); handleSignOut(); }}
                className="rounded-md px-3 py-2 text-left text-sm font-medium text-destructive hover:bg-secondary"
              >
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() => { setMobileOpen(false); onOpenAuth?.("login"); }}
            >
              <LogIn className="mr-1 h-3.5 w-3.5" />
              {t("nav.login")}
            </Button>
          )}
        </nav>
      )}
    </header>
  );
}
