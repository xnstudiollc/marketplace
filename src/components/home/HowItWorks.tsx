"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { PackageCheck, Search, ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";

const STEPS = [
  {
    icon: Search,
    title: "Find your game",
    text: "Search more than 850 titles, then filter offers by type, price, delivery time and seller rating.",
  },
  {
    icon: ShieldCheck,
    title: "Pay into protection",
    text: "Your payment is held until the order is delivered. Sellers are rated on every completed order.",
  },
  {
    icon: PackageCheck,
    title: "Receive and confirm",
    text: "Most digital goods arrive in minutes. Confirm delivery to release payment, or open a dispute.",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 55%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-title"
      className="container-page section-y scroll-mt-20"
    >
      <SectionHeader
        id="how-title"
        eyebrow="How it works"
        title="Three steps, protected end to end"
        description="Every order on Vaultline follows the same flow, whatever you are buying."
      />
      <div ref={ref} className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute top-10 bottom-10 left-[2.5rem] z-10 w-px bg-line-strong lg:top-[3rem] lg:right-[16.6%] lg:bottom-auto lg:left-[16.6%] lg:h-px lg:w-auto"
        >
          <motion.div
            className="absolute inset-0 origin-top bg-gradient-to-b from-brand to-brand-2 lg:hidden"
            data-reveal
            style={{ scaleY: progress }}
          />
          <motion.div
            className="absolute inset-0 hidden origin-left bg-gradient-to-r from-brand to-brand-2 lg:block"
            data-reveal
            style={{ scaleX: progress }}
          />
        </div>
        <ol className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative">
              <span className="absolute top-5 left-5 z-20 grid size-10 place-items-center rounded-full border border-brand/50 bg-bg-elevated font-mono text-sm font-semibold text-fg shadow-[0_0_0_4px_var(--bg)] lg:top-6 lg:left-1/2 lg:size-12 lg:-translate-x-1/2">
                <span className="sr-only">Step </span>
                {i + 1}
              </span>
              <div className="glass h-full rounded-2xl p-5 pl-[4.25rem] lg:p-6 lg:pt-[5.25rem] lg:text-center">
                <h3 className="flex items-center gap-2 text-[1.125rem] font-semibold text-fg lg:justify-center">
                  <Icon
                    className="size-[18px] text-brand-2"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  {title}
                </h3>
                <p className="mt-1.5 text-fg-muted">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
