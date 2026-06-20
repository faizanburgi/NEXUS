"use client";

import type { EcoPartner } from "@/types";

interface RelationshipGraphProps {
  partners: EcoPartner[];
  onSelect?: (partner: EcoPartner) => void;
  selectedId?: string;
}

function nodeColor(score: number): string {
  if (score >= 80) return "#10b981"; // emerald
  if (score >= 60) return "#f59e0b"; // amber
  return "#ef4444"; // red
}

/**
 * Lightweight SVG network graph. Center node is the firm; each partner is a
 * node whose size reflects satisfaction and whose edge thickness reflects
 * relationship strength. No external graph library — keeps the DOM lean.
 */
export function RelationshipGraph({ partners, onSelect, selectedId }: RelationshipGraphProps) {
  const width = 520;
  const height = 320;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 120;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label="Partner relationship graph"
    >
      {partners.map((p, i) => {
        const angle = (i / partners.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        return (
          <line
            key={`edge-${p.id}`}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke={nodeColor(p.satisfactionScore)}
            strokeOpacity={0.35}
            strokeWidth={1 + p.relationshipStrength * 6}
            style={{ transition: "stroke-width 0.6s ease, stroke 0.6s ease" }}
          />
        );
      })}

      {/* firm center node */}
      <circle cx={cx} cy={cy} r={26} fill="#f8fafc" stroke="#5b8cff" strokeWidth={2} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fontWeight="600" fill="#0a0c11">
        Firm
      </text>

      {partners.map((p, i) => {
        const angle = (i / partners.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        const r = 14 + (p.satisfactionScore / 100) * 12;
        const selected = selectedId === p.id;
        return (
          <g
            key={p.id}
            onClick={() => onSelect?.(p)}
            style={{ cursor: onSelect ? "pointer" : "default" }}
          >
            <circle
              cx={x}
              cy={y}
              r={r}
              fill={nodeColor(p.satisfactionScore)}
              fillOpacity={0.9}
              stroke={selected ? "#f8fafc" : "rgba(255,255,255,0.45)"}
              strokeWidth={selected ? 3 : 1.5}
              style={{ transition: "r 0.6s cubic-bezier(0.22,1,0.36,1), fill 0.6s ease" }}
            />
            <text
              x={x}
              y={y + r + 14}
              textAnchor="middle"
              fontSize="11"
              fontWeight="500"
              fill="#cbd2dd"
            >
              {p.name}
            </text>
            <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
              {p.satisfactionScore}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
