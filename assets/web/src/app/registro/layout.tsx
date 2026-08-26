import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registre — tres passos, zero fricció",
  description: "Crea el teu compte de Criteri ESG amb Google, LinkedIn o correu. Pla Gratuït amb arxiu complet i newsletter bimensual. 2 mesos Premium gratis.",
  alternates: { canonical: "/registro" },
};

export default function RouteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
