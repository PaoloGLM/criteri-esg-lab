import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "El mètode: de la font al criteri en 5 passos",
  description: "Detecció automàtica de 180+ fonts, curació humana, síntesi en 8 blocs, doble filtre IA amb advocat del diable i validació editorial. El procés sencer, explicat.",
  alternates: { canonical: "/que-fem" },
};

export default function RouteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
