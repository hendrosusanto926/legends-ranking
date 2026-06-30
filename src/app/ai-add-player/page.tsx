"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle,
  AlertCircle,
  KeyRound,
  User,
  Loader2,
  Trophy,
  X,
} from "lucide-react";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Background } from "@/components/layout/background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ResearchResult {
  playerData: {
    name: string;
    nationality: string;
    position: string;
    continentalClub: number;
    continentalNational: number;
    worldCup: number;
    domesticLeague: number;
    ballonDor: number;
    worldCupRunnerUp: number;
    worldCupThirdPlace: number;
    continentalRunnerUp: number;
  };
  score: number;
}

type Step = "input" | "researching" | "preview" | "submitting" | "success" | "error";

export default function AiAddPlayerPage() {
  const router = useRouter();
  const [authKey, setAuthKey] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("researching");
    setErrorMsg("");

    try {
      const res = await fetch("/api/players/ai-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authKey,
          playerName: playerName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Research failed");
      }

      setResult(data);
      setStep("preview");
    } catch (err) {
      setStep("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleConfirm = async () => {
    if (!result) return;
    setStep("submitting");

    try {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authKey,
          ...result.playerData,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add player");
      }

      setStep("success");
    } catch (err) {
      setStep("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to save player");
    }
  };

  const reset = () => {
    setStep("input");
    setResult(null);
    setErrorMsg("");
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
              AI{" "}
              <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                Quick Add
              </span>
            </h1>
            <p className="text-[var(--text-secondary)] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#FFD700]" />
              Just type a player name — AI researches their career and calculates the score
            </p>
          </motion.div>

          {(step === "success") && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 flex items-center gap-3 mb-6"
            >
              <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
              <p className="text-green-300 text-sm">
                {result?.playerData.name} added successfully!{" "}
                <Link href="/" className="underline hover:text-green-200">
                  Go back to dashboard
                </Link>{" "}
                to see the updated rankings.
              </p>
            </motion.div>
          )}

          {(step === "error") && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center gap-3 mb-6"
            >
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
              <p className="text-red-300 text-sm">{errorMsg}</p>
            </motion.div>
          )}

          {/* Input Step */}
          {(step === "input" || step === "researching" || step === "error") && (
            <Card>
              <CardHeader>
                <CardTitle>Player Name</CardTitle>
                <CardDescription>
                  Enter the name of a football legend and let AI do the rest
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleResearch} className="space-y-6">
                  <div className="rounded-xl border border-[#FFD700]/20 bg-[#FFD700]/[0.03] p-4 space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                      <KeyRound className="h-4 w-4 text-[#FFD700]" />
                      Authentication Key
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter your authentication key"
                      value={authKey}
                      onChange={(e) => setAuthKey(e.target.value)}
                      required
                      disabled={step === "researching"}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                      <User className="h-4 w-4 text-[var(--text-secondary)]" />
                      Player Name
                    </label>
                    <Input
                      placeholder="e.g. Johan Cruyff, Zinedine Zidane, Ronaldo Nazário"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      required
                      disabled={step === "researching"}
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={step === "researching"}
                      className="gap-2"
                    >
                      {step === "researching" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Researching...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Research with AI
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/")}
                      disabled={step === "researching"}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Preview Step */}
          {(step === "preview" || step === "submitting") && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{result.playerData.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{result.playerData.nationality}</Badge>
                        <Badge variant="secondary">{result.playerData.position}</Badge>
                        <Badge className="bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30">
                          Score: {result.score}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-[#FFD700]" />
                    Achievement Counts
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { label: "Continental Club", value: result.playerData.continentalClub },
                      { label: "Continental National", value: result.playerData.continentalNational },
                      { label: "World Cup", value: result.playerData.worldCup, highlight: true },
                      { label: "Domestic League", value: result.playerData.domesticLeague },
                      { label: "Ballon d'Or", value: result.playerData.ballonDor, highlight: true },
                      { label: "WC Runner-up", value: result.playerData.worldCupRunnerUp },
                      { label: "WC 3rd Place", value: result.playerData.worldCupThirdPlace },
                      { label: "Continental Runner-up", value: result.playerData.continentalRunnerUp },
                    ].map(({ label, value, highlight }) => (
                      <div
                        key={label}
                        className={`rounded-lg border p-3 ${
                          highlight
                            ? "border-[#FFD700]/20 bg-[#FFD700]/[0.03]"
                            : "border-white/10 bg-white/[0.03]"
                        }`}
                      >
                        <p className="text-xs text-[var(--text-secondary)] mb-1">{label}</p>
                        <p className={`text-lg font-bold ${
                          highlight ? "text-[#FFD700]" : "text-[var(--text-primary)]"
                        }`}>
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-3 justify-center">
                <Button
                  onClick={handleConfirm}
                  disabled={step === "submitting"}
                  className="gap-2"
                >
                  {step === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Confirm & Add Player
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={reset}
                  disabled={step === "submitting"}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
