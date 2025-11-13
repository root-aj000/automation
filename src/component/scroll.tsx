"use client";

import { useEffect, useState } from "react";
import { calculateScrollProgress } from "@/utils/scroll";

interface ScrollProgressProps {
  color?: string;
  height?: string;
}

export default function ScrollProgressBar({
  color = "bg-orange-500",
  height = "h-2.5",
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
    <div className={`fixed top-16 left-1/2 -translate-x-1/2 w-full max-w-5xl bg-gray-200 rounded-full h-2.5 mb-4" ${height} `}>
      <div
        className={`${color} ${height} rounded-full transition-all duration-100`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
