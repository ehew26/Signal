/** Drifting aurora-gradient mesh — vivid soft light fields that make the
 *  bright page feel alive and premium (violet / cyan / indigo / pink). */
export default function Aurora({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div
        className="mesh-blob absolute left-[6%] top-[-16%] h-[540px] w-[540px]"
        style={{ background: "radial-gradient(circle, rgba(85,107,46,0.22), transparent 65%)" }}
      />
      <div
        className="mesh-blob absolute right-[2%] top-[-4%] h-[480px] w-[480px]"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.20), transparent 65%)", animationDelay: "5s" }}
      />
      <div
        className="mesh-blob absolute left-[40%] top-[18%] h-[560px] w-[560px]"
        style={{ background: "radial-gradient(circle, rgba(150,130,60,0.16), transparent 65%)", animationDelay: "9s" }}
      />
      <div
        className="mesh-blob absolute right-[24%] top-[6%] h-[360px] w-[360px]"
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.13), transparent 65%)", animationDelay: "13s" }}
      />
    </div>
  );
}
