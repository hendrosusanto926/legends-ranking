"use client";

export function Footer() {
  return (
    <footer id="about" className="border-t border-[var(--border-color)] bg-[var(--bg-nav)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-bold text-[var(--text-primary)]">
              <span className="flex items-center justify-center h-6 w-6 rounded bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-[10px] font-black text-white">FRL</span>
              Football Legends Ranking
            </div>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              A premium football analytics platform ranking the greatest players
              in football history based on achievements.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-[var(--text-primary)]">Copyright</h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              &copy; 2026 Hendro Susanto. All rights reserved.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-[var(--text-primary)]">Features</h3>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <li>Interactive Rankings</li>
              <li>Dynamic Charts</li>
              <li>Responsive Design</li>
              <li>Modern Football Analytics Dashboard</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[var(--border-color)] pt-8 text-center">
          <p className="text-xs leading-relaxed max-w-3xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Football opinions are inherently subjective. This ranking represents
            the creator&apos;s personal evaluation based on achievements and is
            intended to encourage discussion rather than define an absolute
            measure of greatness.
          </p>
        </div>
      </div>
    </footer>
  );
}
