"use client";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Layers,
  Network,
  Target,
  ClipboardCheck,
  FileText,
  TrendingUp,
} from "lucide-react";

interface MidSectionsProps {
  onOpenRegister?: () => void;
}

export function MidSections({ onOpenRegister }: MidSectionsProps = {}) {
  const { t } = useLanguage();
  void onOpenRegister; // mantingut per compatibilitat futura

  return (
    <>
      {/* Speed section */}
      <section className="border-b border-rule py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <p className="eyebrow mb-3">
                {t("sections.informes.title").toUpperCase()}
              </p>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-primary sm:text-4xl">
                Hores d'anàlisi, en 5 minuts de lectura.
              </h2>
              <div className="rule-accent my-6" />
              <p className="max-w-2xl text-base leading-relaxed text-foreground/80">
                Un director de sostenibilitat dedica de mitjana el 60% del seu temps a recopilar informació. Criteri ESG centralitza tota aquesta informació i la sintetitza en 8 blocs, perquè el temps d'anàlisi es converteixi en temps de decisió.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="grid grid-cols-3 gap-3">
                <StatCard value="5 min" label="per entendre un informe" />
                <StatCard value="180+" label="fonts monitoritzades" />
                <StatCard value="8" label="blocs per informe" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Format section */}
      <section className="border-b border-rule bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="eyebrow mb-3">COM REBRÀS LA INFORMACIÓ</p>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-primary sm:text-4xl">
              Vuit blocs. Un mateix patró per a 1.000 informes.
            </h2>
            <div className="rule-accent my-5" />
            <p className="max-w-2xl text-base leading-relaxed text-foreground/80">
              La consistència et permet saber què esperar. Cada informe segueix el mateix esquema perquè puguis comparar, prioritzar i decidir.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FormatBloc num="00" icon={<Target className="h-4 w-4" />} title="0. Semàfor Metodològic" desc="5 indicadors + nota A-D. Avalua la qualitat en 10 segons." highlighted />
            <FormatBloc num="01" icon={<FileText className="h-4 w-4" />} title="1. Fitxa tècnica" desc="Institució, data, tipus, pàgines, URL. 50 paraules." />
            <FormatBloc num="02" icon={<TrendingUp className="h-4 w-4" />} title="2. 5 dades clau" desc="Punts quantitatius amb valor, context i pàgina citada." />
            <FormatBloc num="03" icon={<Layers className="h-4 w-4" />} title="3. Resum executiu" desc="Què diu en llenguatge planer. 300 paraules." />
            <FormatBloc num="04" icon={<Target className="h-4 w-4" />} title="4. Implicacions" desc="Empreses, reguladors, ciutadans. + Més enllà del Checkbox." />
            <FormatBloc num="05" icon={<Network className="h-4 w-4" />} title="5. Connexions" desc="Relacions amb altres informes i actualitat." />
            <FormatBloc num="06" icon={<ClipboardCheck className="h-4 w-4" />} title="6. Accions recomanades" desc="3-5 accions concretes. El cor operatiu." highlighted />
            <FormatBloc num="07" icon={<Network className="h-4 w-4" />} title="7. Cross-reference" desc="Mapatge amb EcoVadis, B Corp, MSCI, GRI." highlighted wide />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-b border-rule py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-3">PREGUNTES FREQÜENTS</p>
          <h2 className="font-serif text-3xl font-semibold leading-tight text-primary sm:text-4xl">
            Tot el que et pots preguntar.
          </h2>
          <div className="rule-accent my-6" />
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger className="text-left text-base font-medium">
                És una eina de compliance o estratègica?
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-foreground/75">
                Tots dos. Cobrim el que és obligatori (CSRD, CSDDD, SFDR) i el que és estratègic (EcoVadis, B Corp, MSCI rating). L'usuari tria el seu enfocament: pot prioritzar compliment normatiu o millorar reputació.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="text-left text-base font-medium">
                Quins frameworks cobriu?
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-foreground/75">
                Els 7 més usats: CSRD/ESRS, Taxonomia UE, SFDR, CSDDD, GRI, SASB, TCFD/TNFD. A més de les certificacions EcoVadis, B Corp, MSCI ESG, Sustainalytics, ISS ESG i CDP.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="text-left text-base font-medium">
                Com es comparen els informes entre ells?
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-foreground/75">
                Cada informe té cross-reference amb altres informes i amb els 5 frameworks principals. Pots veure evolucions, contradiccions i complementarietats.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger className="text-left text-base font-medium">
                Quan entra en vigor la subscripció?
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-foreground/75">
                La web obre al públic el setembre 2026. La newsletter bimensual ja està operativa. Els primers 50 subscriptors premium tenen preu promocional de 29€/mes (vs 39€ normal) de per vida.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger className="text-left text-base font-medium">
                Puc provar-ho abans de pagar?
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-foreground/75">
                Sí. 7 dies de prova premium sense targeta. La newsletter i 3 informes oberts al mes són gratuïts per sempre amb registre.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-md border border-rule bg-card p-4 text-center">
      <div className="font-serif text-3xl font-medium text-accent sm:text-4xl">{value}</div>
      <div className="mt-1 text-xs leading-tight text-muted-foreground">{label}</div>
    </div>
  );
}

function FormatBloc({
  num,
  icon,
  title,
  desc,
  highlighted,
  wide,
}: {
  num: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  highlighted?: boolean;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-md border p-4 ${
        highlighted ? "border-accent bg-accent-soft/15" : "border-rule bg-card"
      } ${wide ? "lg:col-span-2" : ""}`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-xs text-accent-deep">{num}</span>
        <span className="text-accent-deep">{icon}</span>
      </div>
      <h3 className="mb-1.5 font-serif text-base font-semibold leading-tight text-primary">{title}</h3>
      <p className="text-xs leading-relaxed text-foreground/70">{desc}</p>
    </div>
  );
}
