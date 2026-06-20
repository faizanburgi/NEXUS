interface CpdRingProps {
  value: number;
  max: number;
  size?: number;
  label?: string;
}

export function CpdRing({ value, max, size = 140, label = "CPD Hours" }: CpdRingProps) {
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, max === 0 ? 0 : value / max));
  const offset = circumference * (1 - pct);
  const complete = pct >= 1;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-foreground/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={complete ? "text-emerald-500" : "text-accent"}
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
          <span className="text-base text-muted">/{max}</span>
        </span>
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted">
          {label}
        </span>
      </div>
    </div>
  );
}
