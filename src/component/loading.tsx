import React from "react";

export const Loading: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto py-8" role="status">
      <div className="animate-pulse space-y-4">
        {/* Header skeleton */}
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-full w-3/4" />

        {/* Content lines */}
        <div className="space-y-3">
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-full" />
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-full w-5/6" />
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-full w-4/5" />
        </div>

        {/* Card skeleton */}
        <div className="mt-6 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-surface-elevated">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-full w-2/3" />
              <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-full w-1/2" />
            </div>
          </div>
        </div>
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
};
