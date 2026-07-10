import { revenueSeries } from "@/lib/data";

/**
 * Dual-series area chart (revenue + pipeline), pure SVG.
 * Values are in $thousands.
 */
export default function AreaChart() {
  const data = revenueSeries;
  const w = 720;
  const h = 240;
  const padX = 16;
  const padY = 24;

  const max = Math.max(...data.map((d) => d.pipeline)) * 1.1;
  const stepX = (w - padX * 2) / (data.length - 1);

  const toXY = (val: number, i: number) => {
    const x = padX + i * stepX;
    const y = h - padY - (val / max) * (h - padY * 2);
    return [x, y] as const;
  };

  const buildPath = (key: "revenue" | "pipeline") => {
    const pts = data.map((d, i) => toXY(d[key], i));
    const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
    const area = `${line} L${padX + (data.length - 1) * stepX},${h - padY} L${padX},${h - padY} Z`;
    return { line, area, pts };
  };

  const revenue = buildPath("revenue");
  const pipeline = buildPath("pipeline");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c5cff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7c5cff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="pipe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* gridlines */}
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <line
          key={g}
          x1={padX}
          x2={w - padX}
          y1={h - padY - g * (h - padY * 2)}
          y2={h - padY - g * (h - padY * 2)}
          stroke="rgba(20,24,62,0.08)"
          strokeWidth="1"
        />
      ))}

      <path d={pipeline.area} fill="url(#pipe)" />
      <path d={pipeline.line} fill="none" stroke="#22d3ee" strokeWidth="2" strokeOpacity="0.7" />
      <path d={revenue.area} fill="url(#rev)" />
      <path d={revenue.line} fill="none" stroke="#7c5cff" strokeWidth="2.5" />

      {revenue.pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#05060d" stroke="#7c5cff" strokeWidth="2" />
      ))}

      {data.map((d, i) => (
        <text
          key={d.month}
          x={padX + i * stepX}
          y={h - 6}
          textAnchor="middle"
          className="fill-mist-faint"
          fontSize="11"
        >
          {d.month}
        </text>
      ))}
    </svg>
  );
}
