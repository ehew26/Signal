/** Tiny inline sparkline rendered as SVG. No dependencies. */
export default function Sparkline({
  data,
  positive = true,
  className = "",
}: {
  data: number[];
  positive?: boolean;
  className?: string;
}) {
  const w = 120;
  const h = 36;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);

  const points = data.map((d, i) => {
    const x = i * step;
    const y = h - ((d - min) / range) * (h - 6) - 3;
    return [x, y] as const;
  });

  const line = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `0,${h} ${line} ${w},${h}`;
  const stroke = positive ? "#34d399" : "#fb7185";
  const id = `spark-${positive ? "up" : "down"}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${id})`} />
      <polyline
        points={line}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
