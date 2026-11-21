export function Skeleton({
  width = "100%",
  height = 14,
}: {
  readonly width?: string;
  readonly height?: number;
}) {
  return <span className="skeleton" style={{ width, height }} aria-hidden="true" />;
}
