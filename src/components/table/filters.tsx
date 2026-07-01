"use client";

import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FilterState } from "@/types/player";

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  nationalities: string[];
  positions: string[];
}

export function Filters({
  filters,
  onFilterChange,
  nationalities,
  positions,
}: FiltersProps) {
  const update = (key: keyof FilterState, value: string | number) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const reset = () => {
    onFilterChange({
      search: "",
      nationality: "",
      position: "",
      minScore: 0,
      maxScore: 0,
    });
  };

  const hasFilters = !!(
    filters.search ||
    filters.nationality ||
    filters.position ||
    filters.minScore ||
    filters.maxScore
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            placeholder="Search players..."
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
            className="pl-10"
            aria-label="Search players by name"
          />
        </div>

        <div className="hidden sm:flex gap-3">
          <Select
            value={filters.nationality}
            onValueChange={(v) => update("nationality", v === "all" ? "" : v)}
          >
            <SelectTrigger className="w-[160px]" aria-label="Filter by nationality">
              <SelectValue placeholder="Nationality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Nationalities</SelectItem>
              {nationalities.map((n) => (
                <SelectItem key={n} value={n}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.position}
            onValueChange={(v) => update("position", v === "all" ? "" : v)}
          >
            <SelectTrigger className="w-[140px]" aria-label="Filter by position">
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              {positions.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Min Score"
            value={filters.minScore || ""}
            onChange={(e) =>
              update("minScore", e.target.value ? Number(e.target.value) : 0)
            }
            className="w-[120px]"
            aria-label="Minimum score"
          />

          <Input
            type="number"
            placeholder="Max Score"
            value={filters.maxScore || ""}
            onChange={(e) =>
              update("maxScore", e.target.value ? Number(e.target.value) : 0)
            }
            className="w-[120px]"
            aria-label="Maximum score"
          />

          {hasFilters && (
            <Button
              variant="ghost"
              size="icon"
              onClick={reset}
              aria-label="Reset filters"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Mobile filters */}
        <details className="sm:hidden group">
          <summary className="text-xs text-white/50 cursor-pointer hover:text-white/70 transition-colors list-none flex items-center gap-1 select-none">
            <svg className="h-3 w-3 transition-transform group-open:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            Filters
          </summary>
          <div className="flex flex-col gap-2 pt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
              <Input
                placeholder="Search players..."
                value={filters.search}
                onChange={(e) => update("search", e.target.value)}
                className="pl-9 h-9 text-sm"
                aria-label="Search players by name"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <Select
                value={filters.nationality}
                onValueChange={(v) => update("nationality", v === "all" ? "" : v)}
              >
                <SelectTrigger className="w-[130px] text-xs h-9" aria-label="Filter by nationality">
                  <SelectValue placeholder="Nationality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {nationalities.map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.position}
                onValueChange={(v) => update("position", v === "all" ? "" : v)}
              >
                <SelectTrigger className="w-[100px] text-xs h-9" aria-label="Filter by position">
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {positions.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Min"
                value={filters.minScore || ""}
                onChange={(e) => update("minScore", e.target.value ? Number(e.target.value) : 0)}
                className="w-[70px] h-9 text-xs"
                aria-label="Minimum score"
              />

              <Input
                type="number"
                placeholder="Max"
                value={filters.maxScore || ""}
                onChange={(e) => update("maxScore", e.target.value ? Number(e.target.value) : 0)}
                className="w-[70px] h-9 text-xs"
                aria-label="Maximum score"
              />

              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={reset} className="text-xs h-9 shrink-0">
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
