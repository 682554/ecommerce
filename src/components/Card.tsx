"use client";

import { useState, useRef, useCallback } from "react";

export interface ColorVariant {
  id: number;
  colorName: string;
  colorHex: string;
  imageUrl: string;
}

interface CardProps {
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  colors?: ColorVariant[];
  badge?: string;
}

export function Card({
  name,
  price,
  imageUrl,
  category,
  colors = [],
  badge,
}: CardProps) {
  const [activeColorIndex, setActiveColorIndex] = useState(-1);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const displayedImage =
    activeColorIndex >= 0 && colors[activeColorIndex]
      ? colors[activeColorIndex].imageUrl
      : imageUrl;

  const colorCount = colors.length;

  const handleSwipe = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (colorCount === 0) return;

    if (Math.abs(diff) < threshold) return;

    if (diff > 0) {
      // Swipe left → next color
      setActiveColorIndex((prev) => {
        const current = prev < 0 ? 0 : prev;
        return current < colorCount - 1 ? current + 1 : 0;
      });
    } else {
      // Swipe right → previous color
      setActiveColorIndex((prev) => {
        const current = prev < 0 ? 0 : prev;
        return current > 0 ? current - 1 : colorCount - 1;
      });
    }
  }, [colorCount]);

  return (
    <article className="group cursor-pointer overflow-hidden">
      {/* Image Container with swipe support */}
      <div
        className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800"
        onTouchStart={(e) => {
          touchStartX.current = e.targetTouches[0].clientX;
        }}
        onTouchMove={(e) => {
          touchEndX.current = e.targetTouches[0].clientX;
        }}
        onTouchEnd={handleSwipe}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displayedImage}
          alt={name}
          className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
        />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-semibold text-orange-600 shadow-sm">
            {badge}
          </span>
        )}

        {/* Color indicator dots on image */}
        {colorCount > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {colors.map((color, i) => (
              <button
                key={color.id}
                type="button"
                aria-label={`View ${color.colorName}`}
                className={`h-2 w-2 rounded-full border transition-transform ${
                  i === activeColorIndex
                    ? "scale-125 border-zinc-900 dark:border-white"
                    : "border-zinc-400 dark:border-zinc-500"
                }`}
                style={{ backgroundColor: color.colorHex }}
                onClick={() => setActiveColorIndex(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-1 pt-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {name}
          </h3>
          <span className="shrink-0 text-base font-semibold text-zinc-900 dark:text-zinc-50">
            ${price.toFixed(2)}
          </span>
        </div>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {category}
        </p>
        {colorCount > 0 && (
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            {colorCount} {colorCount === 1 ? "Colour" : "Colours"}
          </p>
        )}

        {/* Color swatches */}
        {colorCount > 1 && (
          <div className="mt-2 flex gap-1.5">
            {colors.map((color, i) => (
              <button
                key={color.id}
                type="button"
                aria-label={`View ${color.colorName}`}
                title={color.colorName}
                className={`h-4 w-4 rounded-full border-2 transition-all ${
                  i === activeColorIndex
                    ? "border-zinc-900 ring-1 ring-zinc-900 dark:border-white dark:ring-white"
                    : "border-zinc-300 dark:border-zinc-600"
                }`}
                style={{ backgroundColor: color.colorHex }}
                onClick={() => setActiveColorIndex(i)}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
