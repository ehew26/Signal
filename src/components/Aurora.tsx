/** Decorative animated background: drifting gradient orbs + faint grid. */
export default function Aurora({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-60" />
      <div
        className="aurora left-[8%] top-[-6%] h-[420px] w-[420px]"
        style={{ background: "radial-gradient(circle, rgba(124,92,255,0.55), transparent 60%)" }}
      />
      <div
        className="aurora right-[2%] top-[12%] h-[380px] w-[380px]"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.45), transparent 60%)", animationDelay: "4s" }}
      />
      <div
        className="aurora left-[40%] top-[38%] h-[460px] w-[460px]"
        style={{ background: "radial-gradient(circle, rgba(91,61,240,0.4), transparent 60%)", animationDelay: "8s" }}
      />
    </div>
  );
}
