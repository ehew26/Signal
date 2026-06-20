/** Soft, slowly-drifting gradient mesh — adds life without the "AI slop" glow. */
export default function Aurora({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div
        className="mesh-blob absolute left-[12%] top-[-12%] h-[460px] w-[460px]"
        style={{ background: "radial-gradient(circle, rgba(0,113,227,0.16), transparent 65%)" }}
      />
      <div
        className="mesh-blob absolute right-[6%] top-[4%] h-[420px] w-[420px]"
        style={{ background: "radial-gradient(circle, rgba(90,200,250,0.14), transparent 65%)", animationDelay: "5s" }}
      />
      <div
        className="mesh-blob absolute left-[38%] top-[26%] h-[520px] w-[520px]"
        style={{ background: "radial-gradient(circle, rgba(120,90,255,0.10), transparent 65%)", animationDelay: "9s" }}
      />
    </div>
  );
}
