import React from "react";

interface ChallengeItem {
  title: string;
  description: string;
  icon?: string;
}

interface ChallengesSectionProps {
  challenges: string[] | ChallengeItem[];
  title?: string;
  subtitle?: string;
}

export default function ChallengesSection({
  challenges,
  title = "The Challenges You Face",
  subtitle = "Common pain points that slow down your business"
}: ChallengesSectionProps) {
  if (!challenges || challenges.length === 0) {
    return null;
  }

  const isObjectArray = (arr: unknown[]): arr is ChallengeItem[] => {
    return arr.length > 0 && typeof arr[0] === 'object';
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-50/50 to-background dark:from-red-950/10 dark:to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Without Automation
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {title}
            </h2>
            <p className="text-lg text-muted">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Timeline-style challenges */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-red-500 via-red-300 to-transparent hidden md:block" />

          <div className="space-y-6">
            {isObjectArray(challenges) ? (
              challenges.map((challenge, index) => (
                <div
                  key={challenge.title || index}
                  className="relative flex gap-6 group"
                >
                  {/* Timeline dot */}
                  <div className="hidden md:flex flex-shrink-0 w-16 items-start justify-center pt-6">
                    <div className="w-4 h-4 rounded-full bg-red-500 ring-4 ring-red-100 dark:ring-red-900/50 group-hover:scale-125 transition-transform" />
                  </div>

                  {/* Card */}
                  <div className="flex-1 p-6 rounded-2xl bg-surface-elevated border border-gray-200 dark:border-gray-800 hover:border-red-300 dark:hover:border-red-800 transition-colors shadow-sm hover:shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        {challenge.icon ? (
                          <div className="w-6 h-6 text-red-600 dark:text-red-400" dangerouslySetInnerHTML={{ __html: challenge.icon }} />
                        ) : (
                          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {challenge.title}
                        </h3>
                        <p className="text-muted leading-relaxed">
                          {challenge.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              (challenges as string[]).map((challenge, index) => (
                <div
                  key={index}
                  className="relative flex gap-6 group"
                >
                  {/* Timeline dot */}
                  <div className="hidden md:flex flex-shrink-0 w-16 items-start justify-center pt-6">
                    <div className="w-4 h-4 rounded-full bg-red-500 ring-4 ring-red-100 dark:ring-red-900/50 group-hover:scale-125 transition-transform" />
                  </div>

                  {/* Card */}
                  <div className="flex-1 p-6 rounded-2xl bg-surface-elevated border border-gray-200 dark:border-gray-800 hover:border-red-300 dark:hover:border-red-800 transition-colors shadow-sm hover:shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <span className="text-red-600 dark:text-red-400 font-bold">{index + 1}</span>
                      </div>
                      <p className="text-lg text-foreground leading-relaxed pt-1">
                        {challenge}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
