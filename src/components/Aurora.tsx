/** Neon aurora — drifting violet/cyan light fields for the deep-space theme. */
export default function Aurora({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div
        className="mesh-blob absolute left-[8%] top-[-14%] h-[520px] w-[520px]"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.28), transparent 65%)" }}
      />
      <div
        className="mesh-blob absolute right-[4%] top-[2%] h-[460px] w-[460px]"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.20), transparent 65%)", animationDelay: "5s" }}
      />
      <div
        className="mesh-blob absolute left-[36%] top-[24%] h-[560px] w-[560px]"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.16), transparent 65%)", animationDelay: "9s" }}
      />
    </div>
  );
}
