import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Els 16 estàndards ESG que no hauries de confondre",
  description: "Guia dels 16 estàndards de sostenibilitat: regulacions (CSRD, CSDDD), frameworks (GRI, TCFD) i certificacions (EcoVadis, B Corp, MSCI) explicats en clar.",
  alternates: { canonical: "/estandares-esg" },
};

export default function RouteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
