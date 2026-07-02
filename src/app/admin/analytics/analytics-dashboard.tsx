"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Background } from "@/components/layout/background";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";

interface Visitor {
  id: string;
  city: string;
  region: string;
  country: string;
  browser: string;
  os: string;
  device: string;
  visitedAt: string;
}

interface Stats {
  total: number;
  today: number;
  countries: [string, number][];
  cities: [string, number][];
  browsers: [string, number][];
  os: [string, number][];
  devices: [string, number][];
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-sm font-medium text-white/60">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-1">
        <p className="text-2xl font-bold text-[#FFD700]">{value}</p>
      </CardContent>
    </Card>
  );
}

function BreakdownCard({
  title,
  data,
  limit = 5,
}: {
  title: string;
  data: [string, number][];
  limit?: number;
}) {
  const items = data.slice(0, limit);
  const maxCount = items[0]?.[1] || 1;

  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-sm font-medium text-white/60">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-white/40">No data</p>
        ) : (
          items.map(([key, count]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-white/80 truncate">{key}</span>
                <span className="text-white/60 shrink-0 ml-2">{count}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] transition-all"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
        {data.length > limit && (
          <p className="text-xs text-white/40 pt-1">
            +{data.length - limit} more
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function AnalyticsDashboard({
  visitors,
  stats,
}: {
  visitors: Visitor[];
  stats: Stats;
}) {
  const [search, setSearch] = useState("");

  const filteredVisitors = useMemo(() => {
    if (!search.trim()) return visitors;
    const q = search.toLowerCase();
    return visitors.filter(
      (v) =>
        v.country.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.region.toLowerCase().includes(q) ||
        v.browser.toLowerCase().includes(q) ||
        v.os.toLowerCase().includes(q) ||
        v.device.toLowerCase().includes(q)
    );
  }, [visitors, search]);

  return (
    <div className="min-h-screen">
      <Background />
      <Navigation />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2">
              Analytics{" "}
              <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-[var(--text-secondary)]">
              Visitor insights and statistics
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard title="Total Visitors" value={stats.total} />
            <StatCard title="Today" value={stats.today} />
            <StatCard title="Countries" value={stats.countries.length} />
            <StatCard title="Cities" value={stats.cities.length} />
            <StatCard title="Browsers" value={stats.browsers.length} />
            <StatCard title="Devices" value={stats.devices.length} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <BreakdownCard title="Countries" data={stats.countries} />
            <BreakdownCard title="Cities" data={stats.cities} />
            <BreakdownCard title="Browsers" data={stats.browsers} />
            <BreakdownCard title="Operating Systems" data={stats.os} />
            <BreakdownCard title="Devices" data={stats.devices} />
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                Visitor Log
              </h2>
              <div className="sm:ml-auto w-full sm:w-72">
                <Input
                  placeholder="Search by country, city, browser..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <Th>Time</Th>
                      <Th>Country</Th>
                      <Th>Region</Th>
                      <Th>City</Th>
                      <Th>Browser</Th>
                      <Th>OS</Th>
                      <Th>Device</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVisitors.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-12 text-center text-white/40"
                        >
                          {search
                            ? "No visitors match your search"
                            : "No visitors yet"}
                        </td>
                      </tr>
                    ) : (
                      filteredVisitors.map((v) => (
                        <tr
                          key={v.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <Td>
                            {new Date(v.visitedAt).toLocaleString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Td>
                          <Td>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD700]/10 px-2.5 py-0.5 text-xs font-medium text-[#FFD700]">
                              {v.country}
                            </span>
                          </Td>
                          <Td>{v.region}</Td>
                          <Td>{v.city}</Td>
                          <Td>{v.browser}</Td>
                          <Td>{v.os}</Td>
                          <Td>{v.device}</Td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-xs text-white/30 text-right">
              {filteredVisitors.length} of {visitors.length} records
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider whitespace-nowrap">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-4 py-3 text-sm text-white/80 whitespace-nowrap">
      {children}
    </td>
  );
}
