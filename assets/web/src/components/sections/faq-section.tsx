"use client";

import { useLanguage } from "@/components/language-provider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { TranslationKey } from "@/lib/i18n";

export function FaqSection() {
  const { t } = useLanguage();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faq.q1.q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.q1.a"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.q2.q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.q2.a"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.q3.q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.q3.a"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.q4.q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.q4.a"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.q5.q"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.q5.a"),
        },
      },
    ],
  };

  const items: { value: string; qKey: TranslationKey; aKey: TranslationKey }[] = [
    { value: "q1", qKey: "faq.q1.q", aKey: "faq.q1.a" },
    { value: "q2", qKey: "faq.q2.q", aKey: "faq.q2.a" },
    { value: "q3", qKey: "faq.q3.q", aKey: "faq.q3.a" },
    { value: "q4", qKey: "faq.q4.q", aKey: "faq.q4.a" },
    { value: "q5", qKey: "faq.q5.q", aKey: "faq.q5.a" },
  ];

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
    />
    <section id="faq" className="border-b border-rule py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow mb-3">{t("faq.eyebrow")}</p>
        <h2 className="font-serif text-3xl font-semibold leading-tight text-primary sm:text-4xl">
          {t("faq.title")}
        </h2>
        <div className="rule-accent my-5" />
        <Accordion type="single" collapsible className="w-full">
          {items.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger className="text-left text-base font-medium">
                {t(item.qKey)}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-foreground/75">
                {t(item.aKey)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
    </>
  );
}
