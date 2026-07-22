"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-line overflow-hidden rounded-2xl panel">
      {faqs.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="text-base font-medium text-mist">{item.q}</span>
              <Plus
                className={cn(
                  "h-5 w-5 shrink-0 text-violet transition-transform duration-300",
                  isOpen && "rotate-45"
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm leading-relaxed text-mist-dim">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
