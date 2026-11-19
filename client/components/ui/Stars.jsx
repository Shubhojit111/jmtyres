/* Stars.jsx — reusable five-star Lucide review treatment. */
import { Star } from "lucide-react";

export default function Stars({ className = "" }) {
  return (
    <span
      aria-label="5 out of 5 stars"
      className={`stars inline-flex items-center gap-px text-[#597b50] ${className}`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          aria-hidden="true"
          fill="currentColor"
          key={index}
          size={11}
          strokeWidth={1.6}
        />
      ))}
    </span>
  );
}
