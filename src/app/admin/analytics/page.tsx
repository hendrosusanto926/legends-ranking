import { cookies } from "next/headers";
import { getVisitors, type Visitor } from "@/lib/visitors";
import { AnalyticsDashboard } from "./analytics-dashboard";
import { AdminLogin } from "./admin-login";

export const dynamic = "force-dynamic";

interface Stats {
  total: number;
  today: number;
  countries: [string, number][];
  cities: [string, number][];
  browsers: [string, number][];
  os: [string, number][];
  devices: [string, number][];
}

function computeStats(visitors: Visitor[]): Stats {
  const todayPrefix = new Date().toISOString().split("T")[0];

  const countMap = (key: keyof Visitor) => {
    const map = new Map<string, number>();
    for (const v of visitors) {
      const val = String(v[key]);
      map.set(val, (map.get(val) || 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  };

  return {
    total: visitors.length,
    today: visitors.filter((v) => v.visitedAt.startsWith(todayPrefix)).length,
    countries: countMap("country"),
    cities: countMap("city"),
    browsers: countMap("browser"),
    os: countMap("os"),
    devices: countMap("device"),
  };
}

export default async function AdminAnalyticsPage() {
  if (process.env.NEXT_PUBLIC_ENABLE_VISITOR_TRACKING !== "true") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">Visitor analytics is currently disabled.</p>
      </div>
    );
  }
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (token?.value !== "authenticated") {
    return <AdminLogin />;
  }

  const visitors = await getVisitors();
  const stats = computeStats(visitors);

  return <AnalyticsDashboard visitors={visitors} stats={stats} />;
}
