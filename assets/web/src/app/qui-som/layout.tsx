import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tecnologia al servei del criteri humà",
  description: "Qui hi ha darrere de Criteri ESG: l'equip, els criteris ètics (dignitat, justícia, sostenibilitat, democràcia, territori) i el compromís editorial.",
  alternates: { canonical: "/qui-som" },
};

export default function RouteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
