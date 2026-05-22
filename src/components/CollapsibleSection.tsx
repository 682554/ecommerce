"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

type CollapsibleSectionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.03]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-white outline-none transition hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-orange-400/60"
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className="text-sm font-semibold uppercase tracking-[0.26em] text-white/80">
          {title}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-white/70 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          id={panelId}
          className="border-t border-white/8 px-5 py-5 text-sm leading-7 text-neutral-300"
        >
          {children}
        </div>
      )}
    </section>
  );
}
