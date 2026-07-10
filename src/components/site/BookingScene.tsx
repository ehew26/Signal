"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// which slots get booked (day index, label, delay step)
const BOOKINGS: { day: number; time: string }[] = [
  { day: 0, time: "9:00" },
  { day: 0, time: "1:30" },
  { day: 1, time: "8:00" },
  { day: 1, time: "11:00" },
  { day: 2, time: "10:00" },
  { day: 2, time: "3:00" },
  { day: 3, time: "9:30" },
  { day: 4, time: "8:30" },
  { day: 4, time: "2:00" },
  { day: 5, time: "10:30" },
];

function useCountUp(target: number, run: boolean, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration]);
  return val;
}

export default function BookingScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  const leads = useCountUp(128, inView);
  const booked = useCountUp(94, inView);
  const hours = useCountUp(36, inView);

  return (
    <div ref={ref} className="rounded-[1.5rem] panel p-5 sm:p-6">
      {/* calendar header */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-mist">This week</p>
        <span className="flex items-center gap-1.5 text-xs text-emerald">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald" /> Booking live
        </span>
      </div>

      {/* week grid */}
      <div className="grid grid-cols-6 gap-1.5">
        {DAYS.map((d, di) => (
          <div key={d} className="space-y-1.5">
            <p className="pb-1 text-center text-[11px] font-medium text-mist-faint">{d}</p>
            {Array.from({ length: 3 }).map((_, si) => {
              const booking = BOOKINGS.find((b, idx) => b.day === di && BOOKINGS.filter((x) => x.day === di).indexOf(b) === si);
              const order = booking ? BOOKINGS.indexOf(booking) : 0;
              return (
                <motion.div
                  key={si}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.2 + order * 0.12 }}
                  className={`grid h-9 place-items-center rounded-md text-[10px] font-medium ${
                    booking
                      ? "bg-violet/12 text-violet ring-1 ring-violet/20"
                      : "bg-white/[0.05] text-transparent"
                  }`}
                >
                  {booking ? booking.time : "·"}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* counters */}
      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
        {[
          { v: leads, label: "Leads captured" },
          { v: booked, label: "Jobs booked" },
          { v: hours, label: "Hours saved" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-semibold tracking-tight text-mist">{s.v}</p>
            <p className="mt-0.5 text-[11px] leading-tight text-mist-faint">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[11px] text-mist-faint">Illustrative — a typical month, automated.</p>
    </div>
  );
}
