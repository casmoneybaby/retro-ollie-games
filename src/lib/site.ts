export const site = {
  name: "Retro Ollie Games",
  shortName: "ROG",
  tagline: "OLD TECH. NEW LIFE.",
  subline:
    "Restored consoles, games & tech, cleaned, tested and ready for another generation.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "hello@retroolliegames.com",
} as const;

export const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/refurbish", label: "Refurbish" },
  { href: "/sell-trade", label: "Sell / Trade" },
  { href: "/respawn-log", label: "Respawn Log" },
  { href: "/about", label: "About" },
] as const;

export const PLATFORM_NAV = [
  { slug: "playstation", label: "PlayStation" },
  { slug: "xbox", label: "Xbox" },
  { slug: "nintendo", label: "Nintendo" },
  { slug: "retro", label: "Retro" },
  { slug: "handhelds", label: "Handhelds" },
  { slug: "games", label: "Games" },
  { slug: "controllers", label: "Controllers" },
  { slug: "pokemon", label: "Pokémon" },
  { slug: "pc-mac", label: "PC & Mac" },
  { slug: "accessories", label: "Accessories" },
] as const;

export const SERVICE_STATUS_FLOW = [
  "REQUEST_RECEIVED",
  "AWAITING_DEVICE",
  "DEVICE_RECEIVED",
  "INSPECTION",
  "CLEANING",
  "REFURBISHMENT",
  "TESTING",
  "READY",
  "RETURN_SHIPPING",
  "COMPLETED",
] as const;

export const SERVICE_STATUS_LABELS: Record<string, string> = {
  REQUEST_RECEIVED: "Request received",
  AWAITING_DEVICE: "Awaiting device",
  DEVICE_RECEIVED: "Device received",
  INSPECTION: "Inspection",
  CLEANING: "Cleaning",
  REFURBISHMENT: "Refurbishment",
  TESTING: "Testing",
  READY: "Ready",
  RETURN_SHIPPING: "Return shipping",
  COMPLETED: "Completed",
};
