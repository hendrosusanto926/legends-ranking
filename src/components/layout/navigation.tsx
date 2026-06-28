"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Trophy, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./theme-switcher";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/#dashboard" },
  { label: "Rankings", href: "/#rankings" },
  { label: "Statistics", href: "/#statistics" },
  { label: "Comparison", href: "/#comparison" },
  { label: "About", href: "/about" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("/#")) {
      const el = document.querySelector(href.substring(1));
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#111111]/80 backdrop-blur-xl dark:bg-[#111111]/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold text-white"
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
                {item.href.startsWith("/#") ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleClick(item.href)}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    {item.label}
                  </Button>
                ) : (
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      {item.label}
                    </Button>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <ThemeSwitcher />
            <Link href="/favorites" className="hidden md:inline-flex">
              <Button
                variant="ghost"
                size="icon"
                className="text-white/60 hover:text-red-400"
                aria-label="Favorites"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </Link>
            <button
              className="md:hidden p-2 text-white"
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
            className="md:hidden border-t border-white/10 bg-[#111111]/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  {item.href.startsWith("/#") ? (
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                      onClick={() => handleClick(item.href)}
                    >
                      {item.label}
                    </Button>
                  ) : (
                    <Link href={item.href} onClick={() => setIsOpen(false)}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                      >
                        {item.label}
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
              <Link href="/favorites" onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Favorites
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
