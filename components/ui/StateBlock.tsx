export function StateBlock({
  title,
  description,
  tone = "empty",
  children,
}: {
  readonly title: string;
  readonly description?: string;
  readonly tone?: "empty" | "error";
  readonly children?: React.ReactNode;
}) {
  return (
    <div className={`state${tone === "error" ? " state-error" : ""}`} role={tone === "error" ? "alert" : undefined}>
      <strong>{title}</strong>
      {description ? <span>{description}</span> : null}
      {children}
    </div>
  );
}
