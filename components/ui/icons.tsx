type IconProps = { readonly size?: number };

function Svg({ size = 20, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function LedgerIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 3.5h8.5A1.5 1.5 0 0 1 15 5v11.5H6.5A1.5 1.5 0 0 1 5 15z" />
      <path d="M5 3.5v13M8 7.5h4M8 10.5h4M8 13.5h2.5" />
    </Svg>
  );
}

export function RowsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 5.5h2M9 5.5h7M4 10h2M9 10h7M4 14.5h2M9 14.5h7" />
    </Svg>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H9l7 7-4.5 4.5L4 8.5z" />
      <circle cx="7.6" cy="7.6" r="1.1" />
    </Svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M10 4.5v11M4.5 10h11" />
    </Svg>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M15.5 8A6 6 0 0 0 5 6.5" />
      <path d="M4.5 12a6 6 0 0 0 10.5 1.5" />
      <path d="M15.5 4.5V8h-3.5M4.5 15.5V12H8" />
    </Svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M15.5 10h-11M9 5l-5 5 5 5" />
    </Svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M11.5 5 6.5 10l5 5" />
    </Svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8.5 5 13.5 10l-5 5" />
    </Svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 5l10 10M15 5 5 15" />
    </Svg>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="10" cy="10" r="6.5" />
      <path d="M10 6.5v4.5M10 13.5v.01" />
    </Svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 10.5 8 14l7.5-8" />
    </Svg>
  );
}
