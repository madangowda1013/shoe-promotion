"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Eye, ZoomIn, Compass } from "lucide-react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to combine Tailwind class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */

export interface ProductItem {
  id: string | number;
  name: string;
  nameLines?: [string, string] | string[];
  tagline?: string;
  description: string;
  price: string | number;
  image: string;
  thumbnail: string;
  accentColor?: string;
  buyUrl?: string;
  badge?: string;
}

export type PerspectiveMode = "profile" | "sprint" | "elevate" | "macro";

export interface ProductHoverShowcaseProps {
  products?: ProductItem[];
  selectedIndex?: number;
  defaultIndex?: number;
  onSelect?: (index: number, product: ProductItem) => void;
  autoplay?: boolean;
  autoplayInterval?: number;
  pauseOnHover?: boolean;
  enableReflection?: boolean;
  enableGlow?: boolean;
  enableFloatingMotion?: boolean;
  buyButtonText?: string;
  onBuyClick?: (product: ProductItem) => void;
  perspective?: PerspectiveMode;
  onPerspectiveChange?: (mode: PerspectiveMode) => void;
  customAccentColor?: string;
  className?: string;
}

/* ==========================================================================
   DEFAULT PRODUCTS - DOOMS WEAR RUNNER SERIES
   ========================================================================== */

export const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: "velocity-flow-2",
    name: "Velocity Flow 2",
    nameLines: ["VELOCITY", "FLOW 2"],
    tagline: "ROAD RACING",
    description:
      "BUILT FOR FAST MILES AND SMOOTH LANDINGS. A BREATHABLE KNIT UPPER AND ENERGETIC FOAM DELIVER A FLUID, CONFIDENT RIDE FROM START TO FINISH.",
    price: "$320.00",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
    accentColor: "#ef4444",
  },
  {
    id: "aerostrike-x1",
    name: "Aerostrike X1",
    nameLines: ["AEROSTRIKE", "X1"],
    tagline: "SPEED TRAINING",
    description:
      "ENGINEERED FOR SPEED AND BUILT FOR COMFORT. EXPERIENCE LIGHTWEIGHT CUSHIONING, RESPONSIVE ENERGY RETURN, AND EFFORTLESS MOVEMENT WITH EVERY STRIDE.",
    price: "$185.00",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=400&q=80",
    accentColor: "#84cc16",
  },
  {
    id: "superlight-flyline-2",
    name: "Superlight Flyline 2",
    nameLines: ["SUPERLIGHT", "FLYLINE 2"],
    tagline: "DISTANCE PERFORMANCE",
    description:
      "ENGINEERED FOR SPEED AND COMFORT, THESE PERFORMANCE RUNNING SHOES COMBINE A LIGHTWEIGHT DESIGN, RESPONSIVE CUSHIONING, AND A DYNAMIC SILHOUETTE TO KEEP YOU MOVING EFFORTLESSLY WITH EVERY STRIDE.",
    price: "$240.00",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=400&q=80",
    accentColor: "#f97316",
  },
  {
    id: "hyperglide-pro",
    name: "Hyperglide Pro",
    nameLines: ["HYPERGLIDE", "PRO"],
    tagline: "MARATHON ELITE",
    description:
      "DESIGNED FOR EFFORTLESS SPEED AND SMOOTH TRANSITIONS. FEATURING RESPONSIVE CUSHIONING AND A LIGHTWEIGHT CONSTRUCTION TO KEEP YOU MOVING FASTER, LONGER.",
    price: "$325.00",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=400&q=80",
    accentColor: "#ec4899",
  },
  {
    id: "phantom-cyberdrive",
    name: "Phantom Cyberdrive",
    nameLines: ["PHANTOM", "CYBERDRIVE"],
    tagline: "TITANIUM PROPULSION",
    description:
      "FEATURING AN ULTRA-RESPONSIVE CARBON WAVEGUIDE AND DUAL-ZONE KINETIC RETENTION. CRAFTED FOR EXPLOSIVE STRIDES AND SUB-SECOND VELOCITY SURGES.",
    price: "$295.00",
    image: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=400&q=80",
    accentColor: "#06b6d4",
  },
  {
    id: "superlight-redline",
    name: "Superlight Redline",
    nameLines: ["SUPERLIGHT", "REDLINE"],
    tagline: "COMPETITION SERIES",
    description:
      "A BOLD RACE-DAY SHOE WITH A SCULPTED MIDSOLE, SECURE FIT AND PROPULSIVE CUSHIONING MADE FOR CHASING YOUR NEXT PERSONAL BEST.",
    price: "$280.00",
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1200&q=80",
    thumbnail: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=400&q=80",
    accentColor: "#2563eb",
  },
];

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */

export function ProductHoverShowcase({
  products = DEFAULT_PRODUCTS,
  selectedIndex,
  defaultIndex = 4, // Default to the newly added Phantom Cyberdrive!
  onSelect,
  autoplay = false,
  autoplayInterval = 4000,
  pauseOnHover = true,
  enableReflection = true,
  enableGlow = true,
  enableFloatingMotion = true,
  buyButtonText = "BUY NOW",
  onBuyClick,
  perspective = "profile",
  onPerspectiveChange,
  customAccentColor,
  className,
}: ProductHoverShowcaseProps) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const [internalPerspective, setInternalPerspective] = useState<PerspectiveMode>(perspective);
  const [isHovered, setIsHovered] = useState(false);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isControlled = selectedIndex !== undefined;
  const activeIndex = isControlled ? selectedIndex : internalIndex;
  const activeProduct = products[activeIndex] ?? products[0];

  const currentPerspective = onPerspectiveChange ? perspective : internalPerspective;

  const handleSelect = useCallback(
    (index: number) => {
      if (!isControlled) {
        setInternalIndex(index);
      }
      onSelect?.(index, products[index]);
    },
    [isControlled, onSelect, products]
  );

  const handlePerspective = (mode: PerspectiveMode) => {
    if (onPerspectiveChange) {
      onPerspectiveChange(mode);
    } else {
      setInternalPerspective(mode);
    }
  };

  // Autoplay support
  useEffect(() => {
    if (!autoplay || (pauseOnHover && isHovered)) return;

    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % products.length;
      handleSelect(nextIndex);
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [autoplay, autoplayInterval, pauseOnHover, isHovered, activeIndex, products.length, handleSelect]);

  // Keyboard navigation across thumbnails
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      nextIndex = (index + 1) % products.length;
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      nextIndex = (index - 1 + products.length) % products.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = products.length - 1;
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(index);
      return;
    } else {
      return;
    }

    handleSelect(nextIndex);
    thumbnailRefs.current[nextIndex]?.focus();
  };

  // Helper to resolve title lines
  const titleLines: [string, string] = activeProduct.nameLines
    ? [activeProduct.nameLines[0], activeProduct.nameLines[1] || ""]
    : (() => {
        const parts = activeProduct.name.split(" ");
        const first = parts[0] || "";
        const rest = parts.slice(1).join(" ") || "";
        return [first, rest];
      })();

  const activeAccent = customAccentColor || activeProduct.accentColor || "#3b82f6";

  // Dynamic transforms based on perspective mode
  const perspectiveTransforms = {
    profile: { rotate: 0, scale: 1, y: 0 },
    sprint: { rotate: -12, scale: 1.05, y: -10 },
    elevate: { rotate: 8, scale: 0.98, y: -24 },
    macro: { rotate: -4, scale: 1.2, y: -6 },
  };

  const currentTransform = perspectiveTransforms[currentPerspective];

  return (
    <div
      role="region"
      aria-label="Interactive sneaker showcase"
      className={cn(
        "relative w-full select-none overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-[#f6f5f8] dark:bg-neutral-950 shadow-2xl transition-colors duration-300",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient background glow matching active sneaker color */}
      {enableGlow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full opacity-20 blur-3xl transition-colors duration-500 dark:opacity-25"
          style={{
            backgroundColor: activeAccent,
          }}
        />
      )}

      {/* Top Header Segment */}
      <div className="relative z-10 flex flex-col justify-between gap-4 p-5 sm:p-7 md:flex-row md:items-start">
        {/* Left: Product Name and Description */}
        <div className="max-w-md">
          {activeProduct.tagline && (
            <p className="text-[11px] font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
              {activeProduct.tagline}
            </p>
          )}

          <div className="overflow-hidden mt-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <h1 className="text-3xl font-black uppercase tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl leading-[0.92]">
                  <span className="block">{titleLines[0]}</span>
                  <span className="block font-medium text-neutral-700 dark:text-neutral-300">
                    {titleLines[1]}
                  </span>
                </h1>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-2.5">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeProduct.id + "-desc"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="text-[11px] font-medium leading-relaxed tracking-wider text-neutral-500 dark:text-neutral-400 uppercase max-w-xs sm:max-w-sm"
              >
                {activeProduct.description}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Price and Buy Button */}
        <div className="flex items-center gap-4 sm:gap-6 self-start md:self-auto pt-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct.id + "-price"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-3xl font-light tracking-tight text-neutral-900 dark:text-white sm:text-4xl tabular-nums"
            >
              {typeof activeProduct.price === "number"
                ? `$${activeProduct.price.toFixed(2)}`
                : activeProduct.price}
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={() => onBuyClick?.(activeProduct)}
            className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-neutral-800 hover:scale-[1.02] active:scale-95 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 sm:px-8 sm:py-3.5 shadow-lg shadow-neutral-900/10 dark:shadow-white/5 cursor-pointer"
          >
            <span>{buyButtonText}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Hero Showcase Center Stage */}
      <div className="relative flex h-[300px] w-full items-center justify-center sm:h-[380px] md:h-[440px] overflow-hidden my-2">
        {/* Subtle floor shadow / surface line */}
        <div
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 h-8 w-3/4 -translate-x-1/2 rounded-full bg-neutral-900/10 dark:bg-white/5 blur-xl"
        />

        {/* Feature 1 Overlay: Perspective Studio Angle Pills */}
        <div className="absolute top-3 left-4 sm:left-7 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-white/70 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 text-[10px] font-bold uppercase tracking-wider">
          <span className="px-2 text-neutral-400 flex items-center gap-1">
            <Compass className="h-3 w-3" /> Angle
          </span>
          {(["profile", "sprint", "elevate", "macro"] as PerspectiveMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => handlePerspective(mode)}
              className={cn(
                "px-2.5 py-1 rounded-lg transition-all cursor-pointer",
                currentPerspective === mode
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              {mode}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct.id}
            initial={{ opacity: 0, scale: 0.96, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.96, x: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex h-full w-full items-center justify-center"
          >
            {/* Runner Leg Profile Visual with Floating Motion & Perspective transforms */}
            <motion.div
              animate={
                enableFloatingMotion
                  ? {
                      y: [currentTransform.y, currentTransform.y - 8, currentTransform.y],
                      rotate: currentTransform.rotate,
                      scale: currentTransform.scale,
                    }
                  : {
                      y: currentTransform.y,
                      rotate: currentTransform.rotate,
                      scale: currentTransform.scale,
                    }
              }
              transition={
                enableFloatingMotion
                  ? {
                      repeat: Infinity,
                      duration: 4,
                      ease: "easeInOut",
                    }
                  : { duration: 0.3, ease: "easeOut" }
              }
              className="relative flex h-full w-full items-center justify-center px-4"
            >
              <img
                src={activeProduct.image}
                alt={activeProduct.name}
                className="max-h-[90%] w-auto max-w-full object-contain select-none pointer-events-none rounded-2xl drop-shadow-2xl"
                loading="eager"
              />

              {/* Surface Floor Reflection */}
              {enableReflection && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-10 left-1/2 h-16 w-3/4 -translate-x-1/2 opacity-25 blur-[1px] overflow-hidden rounded-2xl"
                  style={{
                    maskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
                  }}
                >
                  <img
                    src={activeProduct.image}
                    alt=""
                    className="w-full h-full object-contain scale-y-[-1] opacity-70"
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Horizontal Thumbnail Selector */}
      <div className="relative z-10 px-3 pb-4 sm:px-6 sm:pb-6 pt-2">
        <div
          role="tablist"
          aria-label="Sneaker product models"
          className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3"
        >
          {products.map((product, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={product.id}
                ref={(el) => {
                  thumbnailRefs.current[index] = el;
                }}
                role="tab"
                id={`tab-${product.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${product.id}`}
                tabIndex={isActive ? 0 : -1}
                type="button"
                onClick={() => handleSelect(index)}
                onMouseEnter={() => handleSelect(index)}
                onFocus={() => handleSelect(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={cn(
                  "group relative flex flex-col items-center justify-between rounded-xl p-2 sm:p-2.5 transition-[color,background-color,border-color,transform,box-shadow] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white cursor-pointer",
                  isActive
                    ? "bg-white dark:bg-neutral-800 shadow-xl border border-neutral-300 dark:border-neutral-700 -translate-y-2 sm:-translate-y-3 z-20"
                    : "bg-neutral-200/50 dark:bg-neutral-900/60 hover:bg-white dark:hover:bg-neutral-800 border border-neutral-200/40 dark:border-neutral-800/60 translate-y-0"
                )}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute -top-1 left-3 right-3 h-0.5 rounded-full"
                    style={{
                      backgroundColor: activeAccent,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}

                {/* Sneaker Thumbnail Profile Image */}
                <div className="relative flex h-14 sm:h-16 w-full items-center justify-center overflow-hidden rounded-lg py-1">
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className={cn(
                      "h-full w-auto object-cover rounded-md transition-opacity duration-200",
                      isActive
                        ? "opacity-100 scale-105"
                        : "opacity-85 group-hover:opacity-100"
                    )}
                    loading="lazy"
                  />
                </div>

                {/* Thumbnail Details */}
                <div className="w-full text-center mt-1">
                  <p
                    className={cn(
                      "text-[10px] sm:text-[11px] font-bold uppercase tracking-tight truncate",
                      isActive
                        ? "text-neutral-900 dark:text-white"
                        : "text-neutral-700 dark:text-neutral-300"
                    )}
                  >
                    {product.name}
                  </p>
                  <p
                    className={cn(
                      "text-[9px] sm:text-[10px] font-medium tabular-nums",
                      isActive
                        ? "text-neutral-600 dark:text-neutral-300"
                        : "text-neutral-500 dark:text-neutral-400"
                    )}
                  >
                    {typeof product.price === "number"
                      ? `$${product.price.toFixed(2)}`
                      : product.price}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProductHoverShowcase;
