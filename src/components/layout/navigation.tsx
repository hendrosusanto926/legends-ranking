"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./theme-switcher";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/#dashboard" },
  { label: "Rankings", href: "/#rankings" },
  { label: "Statistics", href: "/#statistics" },
  { label: "Comparison", href: "/#comparison" },
  { label: "About", href: "/about" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleHashClick = useCallback((e: React.MouseEvent, href: string) => {
    if (!href.startsWith("/#")) return;
    setIsOpen(false);
    const id = href.replace("/#", "");
    if (pathname !== "/") return; // Let the browser handle hash navigation on new page
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [pathname]);

  const close = useCallback(() => setIsOpen(false), []);

  const renderLink = (item: typeof NAV_ITEMS[number], mobile?: boolean) => {
    const base = "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10";
    const classes = mobile ? `w-full justify-start ${base}` : base;

    if (item.href.startsWith("/#")) {
      return (
        <a
          href={item.href}
          onClick={(e) => handleHashClick(e, item.href)}
          className={`inline-flex items-center justify-center h-9 rounded-md px-3 text-sm font-medium transition-colors ${classes}`}
        >
          {item.label}
        </a>
      );
    }
    return (
      <Link href={item.href} onClick={close}>
        <Button variant="ghost" size={mobile ? undefined : "sm"} className={classes}>
          {item.label}
        </Button>
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-nav)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold text-[var(--text-primary)]"
            >
              <Trophy className="h-6 w-6 text-[#FFD700]" />
              <span className="hidden sm:inline">Football Legends Ranking</span>
              <span className="sm:hidden">FLR</span>
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * i }}
              >
                {renderLink(item)}
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <ThemeSwitcher />
            <button
              className="md:hidden p-2 text-[var(--text-primary)]"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[var(--border-color)] bg-[var(--bg-nav)] backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  {renderLink(item, true)}
                </div>
              ))}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
