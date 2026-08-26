import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Més enllà del checkbox: la sèrie editorial",
  description: "Preguntes que cap informe respon sobre sostenibilitat empresarial: ètica, impacte real i el que les certificacions no mesuren.",
  alternates: { canonical: "/mas-alla-del-checkbox" },
};

export default function RouteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
