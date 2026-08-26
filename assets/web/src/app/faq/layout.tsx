import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntes freqüents — respostes directes",
  description: "Què és Criteri ESG, quant costa, quina metodologia fem servir, què és el semàfor metodològic i com es paga. Respostes autònomes amb les xifres exactes.",
  alternates: { canonical: "/faq" },
};

export default function RouteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
