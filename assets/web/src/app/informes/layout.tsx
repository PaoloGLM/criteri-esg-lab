import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Informes ESG: estalvia temps, només 5 minuts",
  description: "Biblioteca d'informes institucionals ESG destil·lats en 8 blocs amb semàfor metodològic i cross-reference amb els 16 estàndards. Filtrats per certificació.",
  alternates: { canonical: "/informes" },
};

export default function RouteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
