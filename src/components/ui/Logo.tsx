import Image from "next/image";

interface LogoProps {
  className?: string;
  iconSize?: number;
  showTagline?: boolean;
  textClassName?: string;
  taglineClassName?: string;
  priority?: boolean;
}

/**
 * Nexus brand lockup: the icon mark (small) + "NEXUS" wordmark, with an
 * optional tagline. Used everywhere the brand name / logo / tagline appears.
 */
export function Logo({
  className = "",
  iconSize = 36,
  showTagline = false,
  textClassName = "text-foreground text-lg",
  taglineClassName = "text-muted",
  priority = false,
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/nexus-icon.png"
        alt="Nexus logo"
        width={iconSize}
        height={iconSize}
        priority={priority}
        className="shrink-0 rounded-xl object-contain ring-1 ring-white/10"
        style={{ width: iconSize, height: iconSize }}
      />
      <div className="leading-tight">
        <p className={`font-bold uppercase tracking-[0.18em] ${textClassName}`}>Nexus</p>
        {showTagline ? (
          <p className={`text-[10px] uppercase tracking-[0.14em] ${taglineClassName}`}>
            Connectivity · Innovation · Solutions
          </p>
        ) : null}
      </div>
    </div>
  );
}
