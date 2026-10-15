export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg">
      <div className="absolute -top-[22vmax] -left-[18vmax] size-[60vmax] animate-drift rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.18),transparent_65%)] blur-[120px]" />
      <div className="absolute -right-[20vmax] -bottom-[24vmax] size-[60vmax] animate-drift-reverse rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.12),transparent_65%)] blur-[120px]" />
      <div className="bg-noise absolute inset-0" />
    </div>
  );
}
