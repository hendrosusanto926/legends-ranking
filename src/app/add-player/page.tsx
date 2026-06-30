"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, CheckCircle, AlertCircle, KeyRound } from "lucide-react";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Background } from "@/components/layout/background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { COUNTRIES } from "@/lib/countries";
import Link from "next/link";

const POSITIONS = [
  "GK", "CB", "LB", "RB", "DM", "CM",
  "AM", "RM", "LM", "RW", "LW", "CF", "SS",
] as const;

interface FormData {
  authKey: string;
  name: string;
  nationality: string;
  position: string;
  continentalClub: string;
  continentalNational: string;
  worldCup: string;
  domesticLeague: string;
  ballonDor: string;
  worldCupRunnerUp: string;
  worldCupThirdPlace: string;
  continentalRunnerUp: string;
}

const INITIAL_FORM: FormData = {
  authKey: "",
  name: "",
  nationality: "",
  position: "",
  continentalClub: "0",
  continentalNational: "0",
  worldCup: "0",
  domesticLeague: "0",
  ballonDor: "0",
  worldCupRunnerUp: "0",
  worldCupThirdPlace: "0",
  continentalRunnerUp: "0",
};

export default function AddPlayerPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authKey: form.authKey,
          name: form.name,
          nationality: form.nationality,
          position: form.position,
          continentalClub: parseFloat(form.continentalClub) || 0,
          continentalNational: parseFloat(form.continentalNational) || 0,
          worldCup: parseFloat(form.worldCup) || 0,
          domesticLeague: parseFloat(form.domesticLeague) || 0,
          ballonDor: parseFloat(form.ballonDor) || 0,
          worldCupRunnerUp: parseFloat(form.worldCupRunnerUp) || 0,
          worldCupThirdPlace: parseFloat(form.worldCupThirdPlace) || 0,
          continentalRunnerUp: parseFloat(form.continentalRunnerUp) || 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add player");
      }

      setStatus("success");
      setForm(INITIAL_FORM);
      setTimeout(() => router.push("/?action=player-added"), 1500);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen">
      <Background />
      <Navigation />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>

            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2">
              Add{" "}
              <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                Player
              </span>
            </h1>
            <p className="text-[var(--text-secondary)]">
              Input a new football legend to the ranking database
            </p>
          </motion.div>

          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 flex items-center gap-3 mb-6"
            >
              <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
              <p className="text-green-300 text-sm">
                Player added successfully!{" "}
                <Link href="/" className="underline hover:text-green-200">
                  Go back to dashboard
                </Link>{" "}
                to see the updated rankings.
              </p>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center gap-3 mb-6"
            >
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
              <p className="text-red-300 text-sm">{errorMsg}</p>
            </motion.div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Player Details</CardTitle>
              <CardDescription>
                Fill in the achievements below. The score is calculated automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-xl border border-[#FFD700]/20 bg-[#FFD700]/[0.03] p-4 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                    <KeyRound className="h-4 w-4 text-[#FFD700]" />
                    Authentication Key
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter your authentication key"
                    value={form.authKey}
                    onChange={(e) => updateField("authKey", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-primary)]">
                      Player Name
                    </label>
                    <Input
                      placeholder="e.g. Johan Cruyff"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-primary)]">
                      Nationality
                    </label>
                    <Combobox
                      options={COUNTRIES}
                      value={form.nationality}
                      onChange={(v) => updateField("nationality", v)}
                      placeholder="Type to search country..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-primary)]">
                      Position
                    </label>
                    <Select
                      value={form.position}
                      onValueChange={(v) => updateField("position", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {POSITIONS.map((pos) => (
                          <SelectItem key={pos} value={pos}>
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                    Achievement Counts
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { key: "continentalClub" as const, label: "Continental Club" },
                      { key: "continentalNational" as const, label: "Continental National" },
                      { key: "worldCup" as const, label: "World Cup" },
                      { key: "domesticLeague" as const, label: "Domestic League" },
                      { key: "ballonDor" as const, label: "Ballon d'Or" },
                      { key: "worldCupRunnerUp" as const, label: "World Cup Runner-up" },
                      { key: "worldCupThirdPlace" as const, label: "World Cup 3rd Place" },
                      { key: "continentalRunnerUp" as const, label: "Continental Runner-up" },
                    ].map(({ key, label }) => (
                      <div key={key} className="space-y-2">
                        <label className="text-sm text-[var(--text-secondary)]">
                          {label}
                        </label>
                        <Input
                          type="number"
                          step="0.5"
                          min="0"
                          value={form[key]}
                          onChange={(e) => updateField(key, e.target.value)}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={status === "submitting"}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {status === "submitting" ? "Adding..." : "Add Player"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
