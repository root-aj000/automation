import React from "react";
import Image from "next/image";

interface TestimonialProps {
    testimonial: {
        quote: string;
        author: string;
        role: string;
        company: string;
        avatar?: string;
    };
}

export default function TestimonialSection({ testimonial }: TestimonialProps) {
    if (!testimonial) {
        return null;
    }

    return (
        <section className="py-16 md:py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-surface via-background to-primary/5" />

            <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8">
                <div className="relative p-8 md:p-12 rounded-3xl bg-surface-elevated border border-gray-200 dark:border-gray-800 shadow-xl">
                    {/* Decorative quote marks */}
                    <div className="absolute top-6 left-8 md:left-12">
                        <svg className="w-12 h-12 md:w-16 md:h-16 text-primary/10" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                    </div>

                    <div className="text-center pt-8 md:pt-12">
                        {/* Badge */}
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Customer Story
                        </span>

                        {/* Quote */}
                        <blockquote className="text-2xl md:text-3xl lg:text-4xl font-medium text-foreground leading-relaxed mb-8 max-w-4xl mx-auto">
                            "{testimonial.quote}"
                        </blockquote>

                        {/* Author */}
                        <div className="flex items-center justify-center gap-4">
                            {testimonial.avatar ? (
                                <Image
                                    src={testimonial.avatar}
                                    alt={testimonial.author}
                                    width={64}
                                    height={64}
                                    className="rounded-full ring-4 ring-primary/10"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-xl ring-4 ring-primary/10">
                                    {testimonial.author.charAt(0)}
                                </div>
                            )}
                            <div className="text-left">
                                <div className="text-lg font-semibold text-foreground">
                                    {testimonial.author}
                                </div>
                                <div className="text-muted">
                                    {testimonial.role} at {testimonial.company}
                                </div>
                            </div>
                        </div>

                        {/* Company logo placeholder or stars */}
                        <div className="mt-8 flex items-center justify-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
