"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Award, TrendingUp, Shield, Leaf, Users, BarChart3 } from "lucide-react";

export function CertificationsBlock() {
  const certs = [
    {
      name: "EcoVadis",
      level: "Bronze → Or",
      desc: "Rating B2B més usat a Europa. Criteris: Environment, Labor, Ethics, Procurement.",
      icon: <Award className="h-5 w-5" />,
    },
    {
      name: "B Corp",
      level: "Certificació",
      desc: "Ètica integral. 5 impact areas: Governance, Workers, Community, Environment, Customers.",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      name: "MSCI ESG",
      level: "BBB → AAA",
      desc: "Rating per a inversors. 10 themes: climate change, natural capital, human capital, etc.",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "CDP",
      level: "C → A",
      desc: "Carboni, aigua, boscos. Standard per a reporting climàtic per a inversors.",
      icon: <Leaf className="h-5 w-5" />,
    },
    {
      name: "GRI",
      level: "Reporting",
      desc: "Estàndard més usat. Universal + topic-specific (200 Econ, 300 Env, 400 Social).",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      name: "CSRD/ESRS",
      level: "Compliance",
      desc: "Reporting obligatori UE. 12 ESRS standards. Aplicació progressiva 2024-2028.",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {certs.map((cert) => (
        <Card
          key={cert.name}
          className="border-rule bg-card transition-all hover:border-accent hover:shadow-sm"
        >
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-accent-deep">
                {cert.icon}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {cert.level}
              </span>
            </div>
            <h3 className="mb-1.5 font-serif text-lg font-semibold text-primary">
              {cert.name}
            </h3>
            <p className="text-xs leading-relaxed text-foreground/70">{cert.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
