export function ProductMark({ className }: { readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 26 26"
      width={26}
      height={26}
      className={className}
      role="img"
      aria-label="Buku Kas"
    >
      <rect x="1" y="5" width="24" height="3.4" rx="1" fill="currentColor" />
      <rect x="1" y="11.4" width="15" height="3.4" rx="1" fill="currentColor" />
      <rect x="1" y="17.8" width="24" height="1.6" rx="0.8" fill="currentColor" opacity="0.35" />
    </svg>
  );
}
