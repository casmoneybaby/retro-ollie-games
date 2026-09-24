/**
 * Fixed scanline overlay for the whole app. Purely decorative — kept as a
 * client component with no state so it can never block interaction.
 */
export function CrtOverlay() {
  return <div aria-hidden className="crt-overlay" />;
}
