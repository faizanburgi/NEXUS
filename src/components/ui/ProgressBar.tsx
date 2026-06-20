interface ProgressBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md";
}

export function ProgressBar({
  value,
  label,
  showValue = true,
  size = "md",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      {label || showValue ? (
        <div className="mb-1.5 flex items-center justify-between">
          {label ? (
            <span className="text-sm font-medium text-foreground">{label}</span>
          ) : (
            <span />
          )}
          {showValue ? (
            <span className="font-mono text-xs text-muted">{clamped}%</span>
          ) : null}
        </div>
      ) : null}
      <div
        className={`w-full overflow-hidden rounded-full bg-foreground/10 ${
          size === "sm" ? "h-1.5" : "h-2.5"
        }`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-foreground transition-[width] duration-700 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
