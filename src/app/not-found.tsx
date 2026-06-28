import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-8xl font-bold text-[#FFD700]/30 mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-white/50 mb-6 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-[#FFD700] text-[#111111] font-medium hover:bg-[#FFD700]/90 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
