"use client";

import { useLanguage } from "@/components/language-provider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  const { t } = useLanguage();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "És una eina de compliance o estratègica?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tots dos. Cobrim el que és obligatori (CSRD, CSDDD, SFDR) i el que és estratègic (EcoVadis, B Corp, MSCI rating). L'usuari tria el seu enfocament.",
        },
      },
      {
        "@type": "Question",
        name: "Quins frameworks cobriu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Els 7 més usats: CSRD/ESRS, Taxonomia UE, SFDR, CSDDD, GRI, SASB, TCFD/TNFD. A més de les certificacions EcoVadis, B Corp, MSCI ESG, Sustainalytics, ISS ESG i CDP.",
        },
      },
      {
        "@type": "Question",
        name: "Com es comparen els informes entre ells?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cada informe té cross-reference amb altres informes i amb els 5 frameworks principals. Pots veure evolucions, contradiccions i complementarietats.",
        },
      },
      {
        "@type": "Question",
        name: "Quan entra en vigor la subscripció?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La web obre al públic el setembre 2026. Els primers 50 subscriptors Premium tenen preu promocional de 290€/any (vs 440€ normal) de per vida.",
        },
      },
      {
        "@type": "Question",
        name: "Puc provar-ho abans de pagar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. El registre és gratuït i et dóna accés a la newsletter bimensual i als informes amb més de 6 mesos. Per accedir als informes recents, necessites Premium (290 €/any early bird per als primers 50).",
        },
      },
    ],
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
    />
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
              La web obre al públic el setembre 2026. La newsletter bimensual ja està operativa. Els primers 50 subscriptors Premium tenen preu promocional de 290€/any (vs 440€ normal) de per vida.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q5">
            <AccordionTrigger className="text-left text-base font-medium">
              Puc provar-ho abans de pagar?
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-foreground/75">
              Sí. El registre és gratuït i et dóna accés a la newsletter bimensual i als informes amb més de 6 mesos. Per accedir als informes recents, necessites Premium (290 €/any early bird per als primers 50).
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
    </>
  );
}
