import React from "react";

interface ResultsSectionProps {
  results: string;
}

export default function ResultsSection({ results }: ResultsSectionProps) {
  if (!results) {
    return null;
  }

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">
            Results
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Achieved outcomes
          </p>
        </div>

        <div className="mt-10 prose prose-lg text-gray-500 mx-auto">
          <p>{results}</p>
        </div>
      </div>
    </div>
  );
}
