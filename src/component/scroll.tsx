"use client";

import { useEffect, useState } from "react";
import { calculateScrollProgress } from "@/utils/scroll";

interface ScrollProgressProps {
  color?: string;
  height?: string;
}

export default function ScrollProgressBar({
  color = "gradient-primary",
  height = "h-1",
}: ScrollProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const value = calculateScrollProgress();
      setProgress(value);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`fixed top-16 lg:top-20 left-0 right-0 z-40 ${height} bg-gray-200/50 dark:bg-gray-800/50 backdrop-blur-sm`}>
      <div
        className={`${color} ${height} transition-all duration-150 ease-out relative overflow-hidden`}
        style={{ width: `${progress}%` }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}
