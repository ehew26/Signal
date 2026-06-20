/** Subtle light background wash — keeps the page feeling clean and bright. */
export default function Aurora({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div
        className="absolute left-1/2 top-[-10%] h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(closest-side, rgba(0,113,227,0.10), rgba(90,200,250,0.06), transparent)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}
