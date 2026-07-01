"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { Player } from "@/types/player";

const PIE_COLORS = [
  "#FFD700",
  "#1B5E20",
  "#2196F3",
  "#9C27B0",
  "#FF5722",
  "#00BCD4",
  "#E91E63",
  "#4CAF50",
  "#FF9800",
  "#607D8B",
];

interface StatsChartsProps {
  players: Player[];
}

interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-white/10 bg-[#1a1a2e] p-3 shadow-xl">
        <p className="text-sm font-medium text-white">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function StatsCharts({ players }: StatsChartsProps) {
  const top10Scores = useMemo(() => {
    return players
      .slice()
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((p) => ({
        name: p.name,
        score: p.score,
        fullName: p.name,
      }));
  }, [players]);

  const positionData = useMemo(() => {
    const counts: Record<string, number> = {};
    players.forEach((p) => {
      counts[p.position] = (counts[p.position] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [players]);

  const nationalityData = useMemo(() => {
    const counts: Record<string, number> = {};
    players.forEach((p) => {
      counts[p.nationality] = (counts[p.nationality] || 0) + 1;
    });
    const sorted = Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    if (sorted.length <= 12) return sorted;
    const top = sorted.slice(0, 11);
    const others = sorted.slice(11).reduce((sum, c) => sum + c.value, 0);
    return [...top, { name: "Others", value: others }];
  }, [players]);

  const avgScoreByPosition = useMemo(() => {
    const groups: Record<string, { total: number; count: number }> = {};
    players.forEach((p) => {
      if (!groups[p.position]) {
        groups[p.position] = { total: 0, count: 0 };
      }
      groups[p.position].total += p.score;
      groups[p.position].count += 1;
    });
    return Object.entries(groups)
      .map(([name, data]) => ({
        name,
        score: Math.round((data.total / data.count) * 100) / 100,
      }))
      .sort((a, b) => b.score - a.score);
  }, [players]);

  const chartConfigs = [
    {
      title: "Top 10 Players by Score",
      subtitle: "Highest ranked legends",
      chart: (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={top10Scores} barCategoryGap="20%" margin={{ bottom: 100, left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="name"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              interval={0}
              angle={-35}
              textAnchor="end"
              height={100}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="score"
              fill="#FFD700"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            >
              {top10Scores.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? "#FFD700" : `rgba(255,215,0,${0.9 - index * 0.07})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Players by Position",
      subtitle: "Distribution across positions",
      chart: (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={positionData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={3}
              dataKey="value"
            >
              {positionData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Players by Nationality",
      subtitle: "Countries represented",
      chart: (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={nationalityData} layout="vertical" barCategoryGap="20%" margin={{ left: 10, right: 20 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              horizontal={false}
            />
            <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
            <YAxis type="category" dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} width={160} interval={0} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#1B5E20" radius={[0, 4, 4, 0]} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Average Score by Position",
      subtitle: "Performance distribution",
      chart: (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={avgScoreByPosition} barCategoryGap="20%" margin={{ bottom: 60, left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="name"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="score"
              fill="#4CAF50"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
  ];

  return (
    <section id="statistics" className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Statistics{" "}
            <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
              & Analytics
            </span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base">
            Data-driven insights into football legends performance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {chartConfigs.map((config, i) => (
            <motion.div
              key={config.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {config.title}
                </h3>
                <p className="text-xs text-white/40">{config.subtitle}</p>
              </div>
              {config.chart}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
