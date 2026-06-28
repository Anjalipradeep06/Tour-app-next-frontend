"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa";

type StarRatingProps = {
  value?: number;
  onChange?: (value: number) => void;
  size?: number;
};

/**
 * value: current rating (0-5, can be fractional for display mode)
 * onChange: if provided, renders as an interactive input
 * size: px size of each star
 */
export default function StarRating({ value = 0, onChange, size = 18 }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const interactive = typeof onChange === "function";

  const displayValue = interactive && hovered > 0 ? hovered : value;

  return (
    <div
      className="inline-flex items-center gap-1.5"
      role={interactive ? "radiogroup" : "img"}
      aria-label={interactive ? "Select a rating" : `Rated ${value} out of 5`}
      onMouseLeave={() => interactive && setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const filled = starIndex <= Math.round(displayValue);

        return (
          <span
            key={starIndex}
            style={{ fontSize: size }}
            className={`inline-flex items-center justify-center leading-none select-none transition-all duration-200 ${
              filled ? "text-[#febb02]" : "text-gray-300"
            } ${
              interactive
                ? "cursor-pointer hover:scale-115 focus-visible:outline-2 focus-visible:outline-[#006ce4] focus-visible:outline-offset-4 focus-visible:rounded"
                : ""
            }`}
            onMouseEnter={() => interactive && setHovered(starIndex)}
            onClick={() => interactive && onChange?.(starIndex)}
            role={interactive ? "radio" : undefined}
            aria-checked={interactive ? starIndex === value : undefined}
            tabIndex={interactive ? 0 : undefined}
            onKeyDown={(e) => {
              if (interactive && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onChange?.(starIndex);
              }
            }}
          >
            <FaStar />
          </span>
        );
      })}
    </div>
  );
}