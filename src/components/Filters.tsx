"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  colorOptions,
  genderOptions,
  priceRangeOptions,
  sizeOptions,
  buildProductsUrl,
  clearAllFilters,
  type ProductQueryState,
  parseProductQuery,
  toggleMultiValue,
} from "@/lib/utils/query";

type FilterGroup = "gender" | "size" | "color" | "price";

type FiltersProps = {
  counts?: {
    gender: Record<string, number>;
    size: Record<string, number>;
    color: Record<string, number>;
    price: Record<string, number>;
  };
};

export function Filters({ counts }: FiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<FilterGroup, boolean>>({
    gender: true,
    size: true,
    color: true,
    price: true,
  });

  const currentState = useMemo(
    () => parseProductQuery(searchParams.toString()),
    [searchParams],
  );

  const activeCount =
    currentState.gender.length +
    currentState.size.length +
    currentState.color.length +
    currentState.price.length;

  function updateQuery(nextState: ProductQueryState) {
    router.replace(buildProductsUrl(pathname, nextState), { scroll: false });
  }

  function handleToggle(
    group: FilterGroup,
    value: string,
  ) {
    updateQuery(toggleMultiValue(currentState, group, value as never));
  }

  function toggleGroup(group: FilterGroup) {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  }

  const groups = [
    {
      key: "gender" as const,
        label: "Gender",
        options: genderOptions.map((option) => ({
          ...option,
          count: counts?.gender[option.value] ?? null,
        })),
      },
    {
      key: "size" as const,
        label: "Size",
        options: sizeOptions.map((option) => ({
          ...option,
          count: counts?.size[option.value] ?? null,
        })),
      },
    {
      key: "color" as const,
        label: "Color",
        options: colorOptions.map((option) => ({
          ...option,
          count: counts?.color[option.value] ?? null,
        })),
      },
    {
      key: "price" as const,
        label: "Price Range",
        options: priceRangeOptions.map((option) => ({
          ...option,
          count: counts?.price[option.value] ?? null,
        })),
      },
  ];

  const content = (
    <div className="flex h-full flex-col bg-black/95">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-400">
            Filters
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            {activeCount} active
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDrawerOpen(false)}
          className="rounded-full border border-white/10 p-2 text-white transition hover:bg-white/[0.08] lg:hidden"
          aria-label="Close filters"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
            <path
              d="M5 5L15 15M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {groups.map((group) => (
          <section
            key={group.key}
            className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur"
          >
            <button
              type="button"
              onClick={() => toggleGroup(group.key)}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <span className="text-sm font-semibold uppercase tracking-[0.24em] text-white">
                {group.label}
              </span>
              <span className="text-sm text-neutral-400">
                {openGroups[group.key] ? "Hide" : "Show"}
              </span>
            </button>

            {openGroups[group.key] && (
              <div className="mt-4 space-y-3">
                {group.options.map((option) => {
                  const selected = currentState[group.key].includes(
                    option.value as never,
                  );

                  return (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/6 px-3 py-2 transition hover:border-white/12 hover:bg-white/[0.04]"
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => handleToggle(group.key, option.value)}
                          className="h-4 w-4 rounded border-white/20 bg-black/40 text-orange-500 focus:ring-2 focus:ring-orange-500/40"
                        />
                        {"swatch" in option ? (
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: option.swatch }}
                            aria-hidden="true"
                          />
                        ) : null}
                        <span className="text-sm text-neutral-200">
                          {option.label}
                        </span>
                      </span>
                      {typeof option.count === "number" ? (
                        <span className="text-xs text-neutral-500">
                          {option.count}
                        </span>
                      ) : null}
                    </label>
                  );
                })}
              </div>
            )}
          </section>
        ))}
      </div>

      <div className="border-t border-white/10 px-5 py-4">
        <button
          type="button"
          onClick={() => updateQuery(clearAllFilters(currentState))}
          className="w-full rounded-full border border-white/12 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
        >
          Clear filters
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/[0.08]"
        >
          Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs text-black">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <aside className="hidden w-full max-w-[320px] shrink-0 lg:block">
        {content}
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filter drawer"
            className="absolute inset-0 bg-black/70"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[88vw] max-w-[360px] border-r border-white/10 shadow-2xl shadow-black/40">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
