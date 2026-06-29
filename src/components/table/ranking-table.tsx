"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  Trophy,
  Medal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { slugify } from "@/lib/players";
import type { Player } from "@/types/player";

const columnHelper = createColumnHelper<Player>();

const MEDAL_ICONS = [
  <Trophy key={1} className="h-4 w-4 text-[#FFD700]" />,
  <Medal key={2} className="h-4 w-4 text-[#C0C0C0]" />,
  <Medal key={3} className="h-4 w-4 text-[#CD7F32]" />,
];

const RANK_COLORS = [
  "text-[#FFD700]",
  "text-[#C0C0C0]",
  "text-[#CD7F32]",
];

interface RankingTableProps {
  players: Player[];
  onPlayerClick: (player: Player) => void;
}

// @react-no-memo-disable - TanStack Table returns non-memoizable functions

export function RankingTable({ players, onPlayerClick }: RankingTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "score", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "rank",
        header: "#",
        cell: ({ row }) => {
          const rank = row.index + 1;
          return (
            <div className="flex items-center justify-center w-10">
              {rank <= 3 ? (
                <span className={cn("font-bold", RANK_COLORS[rank - 1])}>
                  {MEDAL_ICONS[rank - 1]}
                </span>
              ) : (
                <span className="text-white/50 font-mono text-xs">
                  {rank}
                </span>
              )}
            </div>
          );
        },
        size: 50,
      }),
      columnHelper.accessor("name", {
        header: "Player",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">
              {row.original.name}
            </span>
            {row.index + 1 <= 3 && (
              <Badge variant="gold" className="text-[10px] px-1.5 py-0">
                #{row.index + 1}
              </Badge>
            )}
          </div>
        ),
        size: 200,
      }),
      columnHelper.accessor("nationality", {
        header: "Nationality",
        cell: (info) => (
          <span className="text-white/70 text-xs">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("position", {
        header: "Pos",
        cell: (info) => (
          <Badge variant="secondary" className="text-xs">
            {info.getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor("continentalClub", {
        header: "Cont. Club",
        cell: (info) => (
          <span className="text-white/70">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("continentalNational", {
        header: "Cont. Nat.",
        cell: (info) => (
          <span className="text-white/70">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("worldCup", {
        header: "World Cup",
        cell: (info) => (
          <span className="font-semibold text-white">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("domesticLeague", {
        header: "Dom. League",
        cell: (info) => (
          <span className="text-white/70">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("ballonDor", {
        header: "Ballon d'Or",
        cell: (info) => (
          <span className="font-semibold text-[#FFD700]">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("worldCupRunnerUp", {
        header: "WC RU",
        cell: (info) => (
          <span className="text-white/70">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("worldCupThirdPlace", {
        header: "WC 3rd",
        cell: (info) => (
          <span className="text-white/70">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("continentalRunnerUp", {
        header: "Cont. RU",
        cell: (info) => (
          <span className="text-white/70">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("score", {
        header: "Score",
        cell: (info) => (
          <span className="font-bold text-[#FFD700] text-base">
            {info.getValue().toFixed(2)}
          </span>
        ),
        size: 80,
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Link
            href={`/players/${slugify(row.original.name)}`}
            className="inline-flex items-center gap-1 text-xs text-[#FFD700] hover:text-[#FFD700]/80 transition-colors whitespace-nowrap"
            onClick={(e) => e.stopPropagation()}
          >
            View
            <ExternalLink className="h-3 w-3" />
          </Link>
        ),
        size: 70,
      }),
    ],
    []
  );

  const table = useReactTable({
    data: players,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  });

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/50">
            Showing {table.getRowModel().rows.length} of {players.length} players
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs text-white/60">
                <Eye className="h-3.5 w-3.5 mr-1" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table.getAllColumns().map((column) => {
                if (column.id === "rank") return null;
                return (
                  <DropdownMenuItem
                    key={column.id}
                    onClick={() =>
                      column.toggleVisibility(!column.getIsVisible())
                    }
                    className="flex items-center gap-2"
                  >
                    <div
                      className={cn(
                        "w-3.5 h-3.5 rounded border border-white/30 flex items-center justify-center",
                        column.getIsVisible() && "bg-[#FFD700] border-[#FFD700]"
                      )}
                    >
                      {column.getIsVisible() && (
                        <EyeOff className="h-2 w-2 text-[#111111]" />
                      )}
                    </div>
                    <span className="capitalize">{column.id.replace(/([A-Z])/g, " $1")}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <table className="w-full min-w-[900px]">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-white/10">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50 cursor-pointer select-none hover:text-white/80 transition-colors sticky top-0 bg-[#111111]/95 backdrop-blur-xl z-10"
                      style={{ width: header.getSize() }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </div>
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={cn(
                          "absolute right-0 top-0 h-full w-1 cursor-col-resize bg-white/10 opacity-0 hover:opacity-100",
                          header.column.getIsResizing() && "opacity-100 bg-[#FFD700]"
                        )}
                      />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-16"
                    >
                      <div className="flex flex-col items-center gap-3 text-white/40">
                        <Trophy className="h-12 w-12" />
                        <p className="text-lg font-medium">No players found</p>
                        <p className="text-sm">
                          Try adjusting your filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row, i) => (
                    <motion.tr
                      key={row.original.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      onClick={() => onPlayerClick(row.original)}
                      className={cn(
                        "border-b border-white/5 cursor-pointer transition-all duration-200",
                        i % 2 === 0 ? "bg-white/[0.02]" : "bg-white/[0.05]",
                        "hover:bg-white/10"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-3 py-2.5"
                          style={{ width: cell.column.getSize() }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-white/60">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="rounded-md border border-white/20 bg-white/5 px-2 py-1 text-sm text-white"
            aria-label="Rows per page"
          >
            {[5, 10, 20, 30].map((size) => (
              <option key={size} value={size} className="bg-[#111111]">
                {size} rows
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center pt-2">
          <Link href="/methodology">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-white/50 hover:text-white/80 gap-1.5"
            >
              <BookOpen className="h-3.5 w-3.5" />
              View Ranking Methodology
            </Button>
          </Link>
        </div>
      </div>
    </TooltipProvider>
  );
}
