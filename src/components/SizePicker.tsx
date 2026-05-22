"use client";

import { useRef, useState } from "react";

type SizePickerProps = {
  sizes: string[];
  selectedSize?: string | null;
  onSelectSize?: (size: string) => void;
  disabledSizes?: string[];
};

export function SizePicker({
  sizes,
  selectedSize: controlledSize,
  onSelectSize,
  disabledSizes = [],
}: SizePickerProps) {
  const [uncontrolledSize, setUncontrolledSize] = useState<string | null>(
    sizes[0] ?? null,
  );
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedSize =
    typeof controlledSize !== "undefined" ? controlledSize : uncontrolledSize;

  const setSelectedSize = (size: string) => {
    if (disabledSizes.includes(size)) {
      return;
    }

    onSelectSize?.(size);

    if (typeof controlledSize === "undefined") {
      setUncontrolledSize(size);
    }
  };

  const moveFocus = (currentIndex: number, direction: "next" | "prev") => {
    if (sizes.length <= 1) {
      return;
    }

    const targetIndex =
      direction === "next"
        ? currentIndex === sizes.length - 1
          ? 0
          : currentIndex + 1
        : currentIndex === 0
          ? sizes.length - 1
          : currentIndex - 1;

    const targetSize = sizes[targetIndex];
    if (!targetSize) {
      return;
    }

    setSelectedSize(targetSize);
    buttonRefs.current[targetIndex]?.focus();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/65">
          Select size
        </p>
        {selectedSize && (
          <p className="text-sm text-neutral-400">Selected: {selectedSize}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {sizes.map((size, index) => {
          const isActive = selectedSize === size;
          const isDisabled = disabledSizes.includes(size);

          return (
            <button
              key={size}
              type="button"
              ref={(element) => {
                buttonRefs.current[index] = element;
              }}
              onClick={() => setSelectedSize(size)}
              onKeyDown={(event) => {
                if (isDisabled) {
                  return;
                }

                if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                  event.preventDefault();
                  moveFocus(index, "next");
                }

                if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                  event.preventDefault();
                  moveFocus(index, "prev");
                }
              }}
              className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 ${
                isActive
                  ? "border-white bg-white text-black"
                  : isDisabled
                    ? "cursor-not-allowed border-white/8 bg-white/[0.02] text-white/30"
                    : "border-white/12 bg-white/[0.04] text-white hover:bg-white/[0.08]"
              }`}
              aria-pressed={isActive}
              disabled={isDisabled}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
