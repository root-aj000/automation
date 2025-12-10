"use client";
import { useState } from "react";
import { FaqProps } from "@/types/define_props";

export const Faq = ({ faq }: FaqProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    if (!faq || !faq.items || faq.items.length === 0) return null;

    return (
        <section className="relative py-16 sm:py-24 overflow-hidden bg-background">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-4">
                        {faq.title}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        {faq.description}
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="space-y-4">
                        {faq.items.map((item, index) => (
                            <div
                                key={index}
                                className={`group border border-border/50 rounded-2xl bg-card/50 backdrop-blur-sm transition-all duration-300 ${openIndex === index
                                        ? "border-primary/50 shadow-lg shadow-primary/5 ring-1 ring-primary/20"
                                        : "hover:border-primary/20 hover:bg-card/80"
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="flex items-center justify-between w-full px-6 py-5 text-left focus:outline-none"
                                >
                                    <span className={`text-lg font-semibold transition-colors duration-200 ${openIndex === index ? "text-primary" : "text-foreground"
                                        }`}>
                                        {item.question}
                                    </span>
                                    <span className={`flex-shrink-0 ml-4 p-1 rounded-full border transition-all duration-200 ${openIndex === index
                                            ? "bg-primary text-primary-foreground border-primary rotate-180"
                                            : "bg-background text-muted-foreground border-border group-hover:border-primary/30"
                                        }`}>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </button>

                                <div
                                    className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                        }`}
                                >
                                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                                        {item.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
