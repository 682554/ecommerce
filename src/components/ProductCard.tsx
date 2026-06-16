"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface ProductImage {
  url: string;
  color: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  images?: ProductImage[];
  category: string;
}

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [imageError, setImageError] = useState(false);

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [{ url: product.imageUrl, color: "Default" }];

  const handlePrevImage = () => {
    setImageError(false);
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setImageError(false);
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1,
    );
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const dragEnd = e.clientX;
    const diff = dragStart - dragEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }
  };

  const currentImage = images[currentImageIndex];
  const fallbackImage = useMemo(() => {
    const label = `${product.name} | ${product.category}`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
        <defs>
          <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#18181b" />
            <stop offset="100%" stop-color="#ea580c" />
          </linearGradient>
        </defs>
        <rect width="800" height="800" fill="url(#bg)" />
        <circle cx="650" cy="150" r="120" fill="rgba(255,255,255,0.12)" />
        <circle cx="180" cy="620" r="160" fill="rgba(255,255,255,0.08)" />
        <text x="60" y="620" fill="white" font-family="Arial, sans-serif" font-size="54" font-weight="700">${label}</text>
      </svg>
    `)}`;
  }, [product.category, product.name]);

  return (
    <div
      className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-black/30 focus-within:ring-2 focus-within:ring-orange-400/60"
      onClick={() => router.push(`/products/${product.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(`/products/${product.id}`);
        }
      }}
      role="link"
      tabIndex={0}
    >
      <div
        className="relative mb-0 aspect-square w-full cursor-grab overflow-hidden bg-neutral-950 active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDragging(false)}
      >
        <Image
          key={`${currentImage.url}-${imageError ? "fallback" : "live"}`}
          src={imageError ? fallbackImage : currentImage.url}
          alt={`${product.name} - ${currentImage.color}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="select-none object-cover transition-transform duration-500 group-hover:scale-105"
          draggable={false}
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80 backdrop-blur">
          {product.category}
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(event) => {
                  event.stopPropagation();
                  setImageError(false);
                  setCurrentImageIndex(idx);
                }}
                className={`h-2 rounded-full transition-all ${
                  idx === currentImageIndex
                    ? "w-6 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`View color variant ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={(event) => {
                event.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-2 top-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-all hover:bg-black/80 group-hover:opacity-100"
              aria-label="Previous color"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
              >
                <path
                  d="M12.5 4.5L7 10l5.5 5.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-2 top-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-all hover:bg-black/80 group-hover:opacity-100"
              aria-label="Next color"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
              >
                <path
                  d="M7.5 4.5L13 10l-5.5 5.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      <div className="space-y-3 p-5">
        <h3 className="text-lg font-bold leading-tight text-white">
          {product.name}
        </h3>
        {images.length > 1 && (
          <p className="text-xs text-neutral-400">
            {currentImage.color} / {currentImageIndex + 1} of {images.length}
          </p>
        )}
        <p className="line-clamp-2 text-sm text-neutral-300">
          {product.description}
        </p>
        <p className="pt-2 text-xl font-bold text-white">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
