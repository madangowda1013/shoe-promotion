"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, Transition } from "framer-motion";
import { cn } from "@/lib/utils";

interface RandomLetterSwapProps {
  label: string;
  className?: string;
  staggerDuration?: number;
  transition?: Transition;
  onClick?: () => void;
  reverse?: boolean;
}

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

export function RandomLetterSwap({
  label,
  className,
  staggerDuration = 0.025,
  onClick,
}: RandomLetterSwapProps) {
  const [displayText, setDisplayText] = useState(label);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setDisplayText(label);
  }, [label]);

  const startScramble = () => {
    setIsHovered(true);
    let iteration = 0;
    const maxIterations = label.length * 3;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return label
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration / 3) {
              return label[index];
            }
            return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          })
          .join("");
      });

      iteration += 1;
      if (iteration > maxIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(label);
      }
    }, staggerDuration * 1000);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayText(label);
  };

  return (
    <motion.span
      className={cn(
        "inline-flex items-center select-none font-mono tracking-wider transition-colors duration-200",
        className
      )}
      onMouseEnter={startScramble}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {displayText}
    </motion.span>
  );
}

export default RandomLetterSwap;
