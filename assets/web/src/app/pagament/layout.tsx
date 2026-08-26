import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pagament — activa el teu Premium",
  description: "Paga amb targeta via Stripe (activació immediata) o transferència a Fiare Banca Ètica. Early bird 290€/any. Sense permanència.",
  alternates: { canonical: "/pagament" },
};

export default function RouteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
