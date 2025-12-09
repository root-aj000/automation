"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/component/theme-toggle";

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-background/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm'
                : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 lg:h-20">
                    <div className="flex items-center">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                                Automation
                            </span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:ml-10 md:flex md:space-x-1">
                            {[
                                { href: "/", label: "Home" },
                                { href: "/blogs", label: "Blog" },
                                { href: "/about-us", label: "About Us" },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-300 group"
                                >
                                    {link.label}
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full group-hover:w-1/2 transition-all duration-300" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        {/* CTA Button - Desktop */}
                        <a
                            href="#"
                            className="hidden sm:inline-flex btn-primary items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
                        >
                            Get Started
                        </a>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-foreground hover:text-primary hover:bg-surface transition-colors duration-300"
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
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                <div className="px-4 pt-2 pb-4 space-y-1 bg-background/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800">
                    {[
                        { href: "/", label: "Home" },
                        { href: "/blogs", label: "Blog" },
                        { href: "/about-us", label: "About Us" },
                    ].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="block px-4 py-3 rounded-xl text-base font-medium text-foreground hover:text-primary hover:bg-surface transition-colors duration-300"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {/* CTA Button - Mobile */}
                    <a
                        href="#"
                        className="block mt-2 btn-primary rounded-xl px-4 py-3 text-center text-base font-semibold text-white"
                    >
                        Get Started
                    </a>
                </div>
            </div>
        </nav>
    );
}
