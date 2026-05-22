import { Star } from "lucide-react";
import { getProductReviews } from "@/lib/actions/product";

type ProductReviewsSectionProps = {
  productId: string;
};

function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, index) => {
    const active = index < rating;

    return (
      <Star
        key={`star-${index}`}
        className={`h-4 w-4 ${
          active ? "fill-amber-300 text-amber-300" : "text-white/20"
        }`}
      />
    );
  });
}

export async function ProductReviewsSection({
  productId,
}: ProductReviewsSectionProps) {
  const reviews = await getProductReviews(productId);

  return (
    <section
      aria-labelledby="product-reviews-heading"
      className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-7"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-400">
            Reviews
          </p>
          <h2
            id="product-reviews-heading"
            className="mt-3 text-3xl font-black tracking-[-0.04em] text-white"
          >
            What shoppers are saying
          </h2>
        </div>
        <p className="text-sm text-neutral-400">
          Showing {Math.min(reviews.length, 10)} recent review
          {reviews.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-8 grid gap-4">
        {reviews.slice(0, 10).map((review) => {
          const needsCollapse = review.content.length > 180;

          return (
            <article
              key={review.id}
              className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {review.title ?? "Customer review"}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-400">
                      {review.author}
                    </p>
                  </div>
                </div>
                <time
                  dateTime={review.createdAt}
                  className="text-sm text-neutral-500"
                >
                  {formatReviewDate(review.createdAt)}
                </time>
              </div>

              {needsCollapse ? (
                <details className="mt-4 group">
                  <summary className="cursor-pointer list-none text-sm font-medium text-orange-300 transition group-open:mb-3">
                    Read full review
                  </summary>
                  <p className="text-sm leading-7 text-neutral-300">
                    {review.content}
                  </p>
                </details>
              ) : (
                <p className="mt-4 text-sm leading-7 text-neutral-300">
                  {review.content}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
