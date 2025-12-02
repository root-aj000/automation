"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/component/theme-toggle";

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <nav className="bg-background border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="text-2xl font-bold text-primary">
                                Automation
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                href="/"
                                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                href="/blogs"
                                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                            >
                                Blog
                            </Link>
                            <Link
                                href="/about-us"
                                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                            >
                                About Us
                            </Link>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <ThemeToggle />
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary ml-2"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`${isOpen ? "block" : "hidden"} sm:hidden`}>
                <div className="pt-2 pb-3 space-y-1">
                    <Link
                        href="/"
                        className="bg-primary/10 border-l-4 border-primary text-primary block pl-3 pr-4 py-2 text-base font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        href="/blogs"
                        className="border-l-4 border-transparent text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 hover:text-primary block pl-3 pr-4 py-2 text-base font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        Blog
                    </Link>
                    <Link
                        href="/about-us"
                        className="border-l-4 border-transparent text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 hover:text-primary block pl-3 pr-4 py-2 text-base font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        About Us
                    </Link>
                </div>
            </div>
        </nav>
    );
}
