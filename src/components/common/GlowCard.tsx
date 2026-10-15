import { GlassCard, type GlassCardProps } from "./GlassCard";

/** Interactive glass card. The cursor-follow highlight is driven globally by <ClientEffects>. */
export function GlowCard(props: Omit<GlassCardProps, "variant">) {
  return <GlassCard variant="interactive" {...props} />;
}
