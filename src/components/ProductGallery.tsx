"use client";

import Image from "next/image";
import { Check, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { useMemo, useRef, useState } from "react";

export type ProductGalleryColor = {
  id: string;
  label: string;
  swatchClassName: string;
  images: string[];
};

type ProductGalleryProps = {
  productName: string;
  fallbackImages: string[];
  colors: ProductGalleryColor[];
};

function uniqueImages(images: string[]) {
  return images.filter(Boolean);
}

function moveIndex(currentIndex: number, total: number, direction: "next" | "prev") {
  if (total <= 1) {
    return 0;
  }

  if (direction === "next") {
    return currentIndex === total - 1 ? 0 : currentIndex + 1;
  }

  return currentIndex === 0 ? total - 1 : currentIndex - 1;
}

export function ProductGallery({
  productName,
  fallbackImages,
  colors,
}: ProductGalleryProps) {
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hiddenImages, setHiddenImages] = useState<string[]>([]);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const swatchRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const availableColors = useMemo(
    () =>
      colors.filter((color) => {
        const scopedImages =
          color.images.length > 0 ? color.images : fallbackImages;
        return uniqueImages(scopedImages).length > 0;
      }),
    [colors, fallbackImages],
  );

  const effectiveSelectedColorId =
    selectedColorId &&
    availableColors.some((color) => color.id === selectedColorId)
      ? selectedColorId
      : (availableColors[0]?.id ?? null);

  const activeColor =
    availableColors.find((color) => color.id === effectiveSelectedColorId) ??
    availableColors[0] ??
    null;

  const activeImages = useMemo(() => {
    const sourceImages =
      activeColor && activeColor.images.length > 0
        ? activeColor.images
        : fallbackImages;

    return uniqueImages(sourceImages).filter(
      (image) => !hiddenImages.includes(image),
    );
  }, [activeColor, fallbackImages, hiddenImages]);

  const safeSelectedIndex = activeImages[selectedIndex] ? selectedIndex : 0;
  const currentImage = activeImages[safeSelectedIndex] ?? null;

  const handleImageError = (imageUrl: string) => {
    setHiddenImages((current) =>
      current.includes(imageUrl) ? current : [...current, imageUrl],
    );
  };

  const moveSelection = (direction: "next" | "prev") => {
    if (activeImages.length <= 1) {
      return;
    }

    setSelectedIndex((current) =>
      moveIndex(activeImages[current] ? current : 0, activeImages.length, direction),
    );
  };

  return (
    <section className="space-y-5">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a]">
        {currentImage ? (
          <>
            <div className="relative aspect-[0.95] min-h-[340px] sm:min-h-[520px]">
              <Image
                key={currentImage}
                src={currentImage}
                alt={`${productName}${activeColor ? ` in ${activeColor.label}` : ""}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 58vw, 720px"
                className="object-cover"
                onError={() => handleImageError(currentImage)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            </div>

            {activeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => moveSelection("prev")}
                  className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-black/45 text-white transition hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60"
                  aria-label="Previous product image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveSelection("next")}
                  className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-black/45 text-white transition hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60"
                  aria-label="Next product image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="flex aspect-[0.95] min-h-[340px] flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-white/12 bg-white/[0.03] px-8 text-center sm:min-h-[520px]">
            <ImageOff className="h-12 w-12 text-white/45" />
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/50">
                Gallery unavailable
              </p>
              <p className="max-w-sm text-sm leading-7 text-neutral-400">
                We could not render a valid image for this product, but the rest
                of the page is still ready to explore.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {activeImages.length > 0 ? (
          activeImages.map((image, index) => {
            const isActive = index === safeSelectedIndex;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                ref={(element) => {
                  thumbnailRefs.current[index] = element;
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    const nextIndex = moveIndex(index, activeImages.length, "next");
                    setSelectedIndex(nextIndex);
                    thumbnailRefs.current[nextIndex]?.focus();
                  }

                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    const previousIndex = moveIndex(index, activeImages.length, "prev");
                    setSelectedIndex(previousIndex);
                    thumbnailRefs.current[previousIndex]?.focus();
                  }
                }}
                className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.25rem] border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 ${
                  isActive
                    ? "border-white bg-white/10"
                    : "border-white/10 bg-white/[0.03]"
                }`}
                aria-label={`View product image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                  onError={() => handleImageError(image)}
                />
              </button>
            );
          })
        ) : (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="h-24 w-24 shrink-0 animate-pulse rounded-[1.25rem] border border-white/10 bg-white/[0.05]"
            />
          ))
        )}
      </div>

      <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/65">
          Choose color
        </p>
        <div className="flex flex-wrap gap-3">
          {availableColors.map((color, index) => {
            const isActive = color.id === activeColor?.id;

            return (
              <button
                key={color.id}
                type="button"
                ref={(element) => {
                  swatchRefs.current[index] = element;
                }}
                onClick={() => {
                  setSelectedColorId(color.id);
                  setSelectedIndex(0);
                  setHiddenImages([]);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    const nextIndex = moveIndex(index, availableColors.length, "next");
                    const nextColor = availableColors[nextIndex];
                    if (!nextColor) {
                      return;
                    }

                    setSelectedColorId(nextColor.id);
                    setSelectedIndex(0);
                    setHiddenImages([]);
                    swatchRefs.current[nextIndex]?.focus();
                  }

                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    const previousIndex = moveIndex(index, availableColors.length, "prev");
                    const previousColor = availableColors[previousIndex];
                    if (!previousColor) {
                      return;
                    }

                    setSelectedColorId(previousColor.id);
                    setSelectedIndex(0);
                    setHiddenImages([]);
                    swatchRefs.current[previousIndex]?.focus();
                  }
                }}
                className={`inline-flex items-center gap-3 rounded-full border px-3 py-2 text-sm text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 ${
                  isActive
                    ? "border-white bg-white/[0.08]"
                    : "border-white/10 bg-black/25 hover:bg-white/[0.05]"
                }`}
                aria-pressed={isActive}
              >
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/20 ${color.swatchClassName}`}
                >
                  {isActive && <Check className="h-3.5 w-3.5 text-white drop-shadow" />}
                </span>
                <span>{color.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
