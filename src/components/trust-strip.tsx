const TRUST_ITEMS = [
  {
    label: "TESTED & REFURBISHED",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
  },
  {
    label: "QUALITY GUARANTEE",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: "FAST & SECURE SHIPPING",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z" />
        <circle cx="7" cy="19" r="1.6" />
        <circle cx="17" cy="19" r="1.6" />
      </svg>
    ),
  },
  {
    label: "SUSTAINABLE GAMING",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3c4 3 6 6 6 9a6 6 0 1 1-12 0c0-3 2-6 6-9z" />
      </svg>
    ),
  },
  {
    label: "SUPPORT A SMALL BUSINESS",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 9l8-5 8 5v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
        <path d="M9 20v-6h6v6" />
      </svg>
    ),
  },
];

export function TrustStrip() {
  return (
    <section aria-label="Why shop with us" className="border-b border-line bg-panel/60">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-5">
        {TRUST_ITEMS.map((item) => (
          <li
            key={item.label}
            className="flex flex-col items-center gap-3 px-4 py-7 text-center"
          >
            <span className="text-phosphor">{item.icon}</span>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-mist">
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
