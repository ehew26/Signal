import Link from "next/link";
import { cn } from "@/lib/utils";

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
      <span className="relative grid h-9 w-9 place-items-center rounded-[10px] bg-violet">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" aria-hidden="true">
          <path d="M3 4l9 16L21 4" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx="12" cy="20" r="1.6" fill="currentColor" />
        </svg>
      </span>
      {withText && (
        <span className="text-[19px] font-semibold tracking-tight text-mist font-display">
          Vertex<span className="text-mist-faint"> AI</span>
        </span>
      )}
    </Link>
  );
}
