"use client";

import { useEffect } from "react";

/** Revelat subtil en scroll (client). Respecta prefers-reduced-motion. */
export function Reveal({ children, className = "", as: Tag = "div" }: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "figure" | "li" | "article";
}) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return <Tag className={`reveal ${className}`}>{children}</Tag>;
}
