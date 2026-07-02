"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    fetch("/api/visitor", { method: "POST" }).catch(() => {});
  }, [pathname]);

  return null;
}
