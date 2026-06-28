"use client";

import { Download, FileSpreadsheet, FileText, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Player } from "@/types/player";

function formatCSV(players: Player[]): string {
  const headers = [
    "Rank",
    "Name",
    "Nationality",
    "Position",
    "Contribution Club",
    "Contribution National",
    "World Cup",
    "Domestic League",
    "Ballon d'Or",
    "WC Runner-up",
    "WC Third Place",
    "Continental RU",
    "Score",
  ];
  const rows = players.map((p, i) => [
    i + 1,
    p.name,
    p.nationality,
    p.position,
    p.contributionClub,
    p.contributionNational,
    p.worldCup,
    p.domesticLeague,
    p.ballonDor,
    p.worldCupRunnerUp,
    p.worldCupThirdPlace,
    p.continentalRunnerUp,
    p.score,
  ]);
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function exportExcel(players: Player[]) {
  const XLSX = await import("xlsx");
  const data = players.map((p, i) => ({
    Rank: i + 1,
    Name: p.name,
    Nationality: p.nationality,
    Position: p.position,
    "Contribution Club": p.contributionClub,
    "Contribution National": p.contributionNational,
    "World Cup": p.worldCup,
    "Domestic League": p.domesticLeague,
    "Ballon d'Or": p.ballonDor,
    "WC Runner-up": p.worldCupRunnerUp,
    "WC 3rd Place": p.worldCupThirdPlace,
    "Continental RU": p.continentalRunnerUp,
    Score: p.score,
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Rankings");
  XLSX.writeFile(wb, "football-legends-ranking.xlsx");
}

async function exportPDF(players: Player[]) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(18);
  doc.setTextColor(255, 215, 0);
  doc.text("Football Legends Ranking", 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

  const headers = [
    "Rank",
    "Name",
    "Nationality",
    "Pos",
    "Cont. Club",
    "Cont. Nat.",
    "World Cup",
    "Dom. League",
    "Ballon d'Or",
    "WC RU",
    "WC 3rd",
    "Cont. RU",
    "Score",
  ];

  const data = players.map((p, i) => [
    String(i + 1),
    p.name,
    p.nationality,
    p.position,
    String(p.contributionClub),
    String(p.contributionNational),
    String(p.worldCup),
    String(p.domesticLeague),
    String(p.ballonDor),
    String(p.worldCupRunnerUp),
    String(p.worldCupThirdPlace),
    String(p.continentalRunnerUp),
    String(p.score),
  ]);

  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 38,
    styles: {
      fontSize: 7,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [255, 215, 0],
      textColor: [17, 17, 17],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  });

  doc.save("football-legends-ranking.pdf");
}

interface ExportButtonProps {
  players: Player[];
}

export function ExportButton({ players }: ExportButtonProps) {
  const handleExport = async (format: string) => {
    try {
      if (format === "csv") {
        downloadFile(
          formatCSV(players),
          "football-legends-ranking.csv",
          "text/csv"
        );
      } else if (format === "xlsx") {
        await exportExcel(players);
      } else if (format === "pdf") {
        await exportPDF(players);
      }
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileText className="h-4 w-4 mr-2 text-blue-400" />
          Export CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("xlsx")}>
          <FileSpreadsheet className="h-4 w-4 mr-2 text-green-400" />
          Export Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <FileDown className="h-4 w-4 mr-2 text-red-400" />
          Export PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
