type FeatureIconProps = {
  kind: "membership" | "events" | "news";
};

export function FeatureIcon({ kind }: FeatureIconProps) {
  if (kind === "membership") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <circle cx="16.5" cy="9" r="2.5" />
        <path d="M4 19c0-2.8 2.2-5 5-5s5 2.2 5 5" />
        <path d="M13 18.5c.4-1.9 2-3.5 4-3.5 2.2 0 4 1.8 4 4" />
      </svg>
    );
  }

  if (kind === "events") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4" />
        <path d="M16 3v4" />
        <path d="M3 10h18" />
        <path d="M8 14h3" />
        <path d="M13 14h3" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16v10H7l-3 3z" />
      <path d="M8 10h8" />
      <path d="M8 13h5" />
    </svg>
  );
}
