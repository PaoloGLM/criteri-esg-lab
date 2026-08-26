import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preus: Premium 440€/any, early bird 290€",
  description: "Pla Gratuït amb arxiu i newsletter, Premium 440€/any (36,67€/mes) amb early bird de 290€ per als primers 50. Pagament amb Stripe o Fiare Banca Ètica.",
  alternates: { canonical: "/preus" },
};

export default function RouteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
