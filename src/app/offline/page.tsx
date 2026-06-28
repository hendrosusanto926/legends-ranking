import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-6xl mb-4">📡</div>
        <h1 className="text-2xl font-bold text-white mb-2">
          You&apos;re Offline
        </h1>
        <p className="text-white/50 mb-6 max-w-md">
          Please check your internet connection and try again.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-[#FFD700] text-[#111111] font-medium hover:bg-[#FFD700]/90 transition-colors"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}
