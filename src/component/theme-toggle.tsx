"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Avoid hydration mismatch - only render after mount
    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Show placeholder while mounting to prevent hydration issues in Edge
    if (!mounted) {
        return (
            <button
                className="relative p-2.5 rounded-xl bg-surface hover:bg-surface-elevated border border-gray-200 dark:border-gray-800 transition-all duration-300"
                aria-label="Toggle theme"
            >
                <div className="w-5 h-5" />
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
            className="relative p-2.5 rounded-xl bg-surface hover:bg-surface-elevated border border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-all duration-300 group"
            aria-label="Toggle theme"
        >
            {/* Sun icon - visible in light mode */}
            <Sun
                className={`w-5 h-5 text-foreground transition-all duration-300 ${resolvedTheme === 'dark'
                        ? 'rotate-90 scale-0 opacity-0 absolute'
                        : 'rotate-0 scale-100 opacity-100'
                    }`}
            />
            {/* Moon icon - visible in dark mode */}
            <Moon
                className={`w-5 h-5 text-foreground transition-all duration-300 ${resolvedTheme === 'dark'
                        ? 'rotate-0 scale-100 opacity-100'
                        : '-rotate-90 scale-0 opacity-0 absolute'
                    }`}
            />
            <span className="sr-only">Toggle theme</span>
        </button>
    );
}
