export const site = {
  name: "Retro Ollie Games",
  shortName: "ROG",
  tagline: "OLD TECH. NEW LIFE.",
  footerTagline: "GOOD GAMES. BETTER PEOPLE.",
  description:
    "Retro Ollie Games is an online refurb store — buy restored consoles and games, sell or trade your gear, or send your console in for professional cleaning and refurbishment.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "hello@retroolliegames.com",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?platform=playstation", label: "Consoles", platformSlug: "playstation" },
  { href: "/shop?platform=games", label: "Games", platformSlug: "games" },
  { href: "/refurbishment", label: "Refurbishment" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/refurbishment", label: "Refurbishment" },
  { href: "/sell-trade", label: "Sell / Trade" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/policies/shipping", label: "Shipping" },
  { href: "/policies/returns", label: "Returns" },
  { href: "/policies/warranty", label: "Warranty" },
  { href: "/policies/privacy", label: "Privacy" },
] as const;

export const PLATFORM_NAV = [
  { slug: "playstation", label: "PlayStation" },
  { slug: "xbox", label: "Xbox" },
  { slug: "nintendo", label: "Nintendo" },
  { slug: "retro", label: "Retro" },
  { slug: "handhelds", label: "Handhelds" },
  { slug: "games", label: "Games" },
  { slug: "pokemon", label: "Pokémon" },
  { slug: "pc-mac", label: "PC & Mac" },
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

/** Default refurbishment checklist shown on the homepage panel (admin-editable via SiteSetting refurb_checklist). */
export const DEFAULT_REFURB_CHECKLIST = [
  "Deep Cleaning",
  "Internal Cleaning",
  "Full Testing",
  "Thermal Maintenance",
  "Software / Firmware Update",
  "Optional Repair / Parts Work",
  "Professional Care",
];
