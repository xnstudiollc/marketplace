"use client";

import { Children, type ReactNode } from "react";
import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "0px 0px -10% 0px" } as const;

/**
 * Fades and rises a section 16px the first time it scrolls into view.
 * Under reduced motion, a `[data-reveal]` rule in globals.css pins it visible, which keeps hydration stable.
 */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.45, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

const ITEM = { hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0 } };

/** Staggers direct children by 40ms, capped at 400ms in total. */
export function Stagger({
  children,
  className,
  itemClassName,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  as?: "div" | "ul";
}) {
  const items = Children.toArray(children);
  const Wrapper = as === "ul" ? motion.ul : motion.div;
  const Item = as === "ul" ? motion.li : motion.div;
  return (
    <Wrapper className={className} initial="hidden" whileInView="shown" viewport={VIEWPORT}>
      {items.map((child, i) => (
        <Item
          key={i}
          data-reveal
          className={itemClassName}
          variants={ITEM}
          transition={{ duration: 0.45, ease: EASE, delay: Math.min(i * 0.04, 0.4) }}
        >
          {child}
        </Item>
      ))}
    </Wrapper>
  );
}
