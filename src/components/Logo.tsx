import Link from "next/link";
import { cn } from "@/lib/utils";
import { store } from "@/lib/store";

/** Lumé wordmark — a soft luminous dot + refined type. */
export default function Logo({
  className,
  href = "/",
  withText = true,
}: {
  className?: string;
  href?: string;
  withText?: boolean;
}) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="relative grid h-8 w-8 place-items-center">
        <span
          className="absolute inset-0 rounded-full opacity-90 blur-[6px] transition group-hover:opacity-100"
          style={{ background: "radial-gradient(circle at 35% 30%, #fbcfe8, #a78bfa 60%, #38bdf8)" }}
        />
        <span className="relative h-4 w-4 rounded-full bg-white ring-1 ring-white/70" />
      </span>
      {withText && (
        <span className="text-[20px] font-semibold tracking-tight text-mist font-display">
          {store.name}
        </span>
      )}
    </Link>
  );
}
