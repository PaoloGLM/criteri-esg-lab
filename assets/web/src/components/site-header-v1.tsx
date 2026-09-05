"use client";

import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/lib/auth-context";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onOpenPreus?: () => void;
  /** Obsolet: el login ara viu a /registro (botó Comença). Es manté a la
   * interfície per compatibilitat amb les pàgines que encara el passen. */
  onOpenAuth?: (tab?: "register" | "login") => void;
}

const LINKS = [
  { href: "/informes", ca: "Informes", es: "Informes" },
  { href: "/que-fem", ca: "Què fem", es: "Qué hacemos" },
  { href: "/estandares-esg", ca: "Estàndards", es: "Estándares" },
  { href: "/preus", ca: "Preus", es: "Precios" },
  { href: "/mas-alla-del-checkbox", ca: "Més enllà", es: "Más allá" },
];

export function Header({ onOpenPreus }: HeaderProps = {}) {
  const { lang, setLang, t } = useLanguage();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <header
      className="sticky top-0 z-40 w-full border-b"
      style={{ background: "rgba(20,27,24,.92)", backdropFilter: "blur(8px)", borderColor: "rgba(170,201,182,.14)" }}
    >
      <div className="mx-auto flex h-16 max-w-[1160px] items-center justify-between px-6">
        {/* Logo */}
        <a href="/" className="flex items-center" aria-label="Criteri ESG — inici">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-clar.svg" alt="Criteri ESG" className="h-[30px] w-auto" />
        </a>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-[.74rem] font-medium uppercase tracking-[.08em] text-[#AAC9B6] transition-colors hover:text-[#F5E381]"
            >
              {lang === "ca" ? l.ca : l.es}
            </a>
          ))}
          <a
            href={user ? "/cuenta" : "/registro"}
            className="rounded-[5px] bg-[#AAC9B6] px-[14px] py-[7px] font-mono text-[.74rem] font-semibold uppercase tracking-[.08em] text-[#141B18] transition-colors hover:bg-[#F5E381]"
          >
            {user ? (lang === "ca" ? "El meu compte" : "Mi cuenta") : lang === "ca" ? "Comença" : "Empieza"}
          </a>
          {/* Idioma */}
          <button
            onClick={() => setLang(lang === "ca" ? "es" : "ca")}
            className="font-mono text-[.68rem] font-semibold uppercase tracking-[.1em] text-[#AAC9B6] transition-colors hover:text-[#F5E381]"
            aria-label="Canviar idioma"
          >
            {lang === "ca" ? "ES" : "CAT"}
          </button>
          {/* Usuari (només loguejat: el login viu a /registro, des del botó Comença) */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 font-mono text-[.7rem] uppercase tracking-[.08em] text-[#AAC9B6] hover:text-[#F5E381]"
              >
                <User className="h-4 w-4" />
                {user.email?.split("@")[0]}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border border-[#D8E2DA] bg-white py-1 shadow-lg">
                  <a href="/cuenta" className="block px-4 py-2 text-sm text-[#26312B] hover:bg-[#F2F5F1]">
                    {lang === "ca" ? "El meu compte" : "Mi cuenta"}
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[#26312B] hover:bg-[#F2F5F1]"
                  >
                    <LogOut className="h-4 w-4" />
                    {lang === "ca" ? "Tanca la sessió" : "Cerrar sesión"}
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="text-[#AAC9B6] md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Nav mobile */}
      {mobileOpen && (
        <nav className="border-t border-[rgba(170,201,182,.14)] px-6 py-4 md:hidden" style={{ background: "#141B18" }}>
          <div className="flex flex-col gap-4">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="font-mono text-[.78rem] font-medium uppercase tracking-[.08em] text-[#AAC9B6]"
              >
                {lang === "ca" ? l.ca : l.es}
              </a>
            ))}
            <a
              href={user ? "/cuenta" : "/registro"}
              onClick={() => setMobileOpen(false)}
              className="rounded-[5px] bg-[#AAC9B6] px-[14px] py-[8px] text-center font-mono text-[.78rem] font-semibold uppercase tracking-[.08em] text-[#141B18]"
            >
              {user ? (lang === "ca" ? "El meu compte" : "Mi cuenta") : lang === "ca" ? "Comença" : "Empieza"}
            </a>
            <button
              onClick={() => setLang(lang === "ca" ? "es" : "ca")}
              className="text-left font-mono text-[.78rem] font-semibold uppercase tracking-[.1em] text-[#AAC9B6]"
            >
              {lang === "ca" ? "ES" : "CAT"}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
