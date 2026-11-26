"use client";

import { RandomLetterSwap } from "@/components/ui/random-letter-swap";

interface RandomLetterSwapNavProps {
  links?: string[];
  activeLink?: string;
  onSelect?: (link: string) => void;
  className?: string;
}

const DEFAULT_LINKS = ["Home", "Drops", "Collection", "Innovation", "Contact"];

export default function RandomLetterSwapNav({
  links = DEFAULT_LINKS,
  activeLink,
  onSelect,
  className = "",
}: RandomLetterSwapNavProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <nav className="flex items-center gap-6 md:gap-8">
        {links.map((link) => (
          <button
            type="button"
            key={link}
            onClick={() => onSelect?.(link)}
            className="group relative py-1 focus:outline-none"
          >
            <RandomLetterSwap
              className={`cursor-pointer font-medium text-sm tracking-wider uppercase transition-colors ${
                activeLink === link
                  ? "text-primary font-bold"
                  : "text-muted-foreground group-hover:text-foreground"
              }`}
              label={link}
              staggerDuration={0.025}
              transition={{ duration: 0.6, type: "spring" }}
            />
            {activeLink === link && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

export { RandomLetterSwapNav };
