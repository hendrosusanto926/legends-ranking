"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-6xl mb-4">⚽</div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Something went wrong
        </h1>
        <p className="text-[var(--text-secondary)] mb-6 max-w-md">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-[#FFD700] text-[#111111] font-medium hover:bg-[#FFD700]/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
