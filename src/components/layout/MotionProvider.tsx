"use client";

import { MotionConfig } from "motion/react";

/** With "user", motion skips transform and layout animations when the OS asks for reduced motion; opacity fades still run. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
