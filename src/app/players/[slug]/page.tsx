"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Trophy,
  Globe,
  Star,
  Award,
  Medal,
  Earth,
  Pencil,
  Trash2,
  KeyRound,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Background } from "@/components/layout/background";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ShareButton } from "@/components/share/share-button";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  getPlayers,
  slugify,
  ACHIEVEMENT_CONFIG,
} from "@/lib/players";
import { COUNTRIES } from "@/lib/countries";
import { Flag } from "@/lib/flags";
import type { Player } from "@/types/player";

const POSITIONS = [
  "GK", "CB", "LB", "RB", "DM", "CM",
  "AM", "RM", "LM", "RW", "LW", "CF", "SS",
] as const;

const ICON_MAP: Record<string, React.ElementType> = {
  Trophy,
  Earth,
  Globe,
  Award,
  Star,
  Medal,
};

export default function PlayerPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [player, setPlayer] = useState<Player | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editAuthKey, setEditAuthKey] = useState("");
  const [deleteAuthKey, setDeleteAuthKey] = useState("");
  const [editStatus, setEditStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [editError, setEditError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [editForm, setEditForm] = useState({
    name: "",
    nationality: "",
    position: "",
    continentalClub: "",
    continentalNational: "",
    worldCup: "",
    domesticLeague: "",
    ballonDor: "",
    worldCupRunnerUp: "",
    worldCupThirdPlace: "",
    continentalRunnerUp: "",
    score: "",
    description: "",
  });

  const [generatingDesc, setGeneratingDesc] = useState(false);

  const fetchData = async () => {
    const data = await getPlayers();
    const sorted = data.sort((a, b) => b.score - a.score);
    setAllPlayers(sorted);
    const found = sorted.find((p) => slugify(p.name) === slug);
    setPlayer(found || null);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  const similarPlayers = useMemo(() => {
    if (!player) return [];
    return allPlayers
      .filter(
        (p) =>
          p.id !== player.id &&
          (p.position === player.position ||
            Math.abs(p.score - player.score) < 3)
      )
      .slice(0, 4);
  }, [player, allPlayers]);

  const radarData = useMemo(() => {
    if (!player) return [];
    return ACHIEVEMENT_CONFIG.map((config) => ({
      stat: config.label,
      value: player[config.key],
      maxValue: config.maxValue,
    }));
  }, [player]);

  const openEdit = () => {
    if (!player) return;
    setEditForm({
      name: player.name,
      nationality: player.nationality,
      position: player.position,
      continentalClub: String(player.continentalClub),
      continentalNational: String(player.continentalNational),
      worldCup: String(player.worldCup),
      domesticLeague: String(player.domesticLeague),
      ballonDor: String(player.ballonDor),
      worldCupRunnerUp: String(player.worldCupRunnerUp),
      worldCupThirdPlace: String(player.worldCupThirdPlace),
      continentalRunnerUp: String(player.continentalRunnerUp),
      score: String(player.score),
      description: player.description || "",
    });
    setEditAuthKey("");
    setEditStatus("idle");
    setEditError("");
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!player) return;
    setEditStatus("submitting");
    setEditError("");

    try {
      const res = await fetch(`/api/players/${player.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authKey: editAuthKey,
          name: editForm.name,
          nationality: editForm.nationality,
          position: editForm.position,
          continentalClub: parseFloat(editForm.continentalClub) || 0,
          continentalNational: parseFloat(editForm.continentalNational) || 0,
          worldCup: parseFloat(editForm.worldCup) || 0,
          domesticLeague: parseFloat(editForm.domesticLeague) || 0,
          ballonDor: parseFloat(editForm.ballonDor) || 0,
          worldCupRunnerUp: parseFloat(editForm.worldCupRunnerUp) || 0,
          worldCupThirdPlace: parseFloat(editForm.worldCupThirdPlace) || 0,
          continentalRunnerUp: parseFloat(editForm.continentalRunnerUp) || 0,
          score: parseFloat(editForm.score) || 0,
          description: editForm.description || "",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update player");
      }

      setEditStatus("success");
      setTimeout(() => router.push("/?action=player-updated"), 1500);
    } catch (err) {
      setEditStatus("error");
      setEditError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!player) return;
    setDeleteStatus("submitting");
    setDeleteError("");

    try {
      const res = await fetch(`/api/players/${player.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authKey: deleteAuthKey, playerName: player.name }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete player");
      }

      setDeleteStatus("success");
      setTimeout(() => router.push("/?action=player-deleted"), 1500);
    } catch (err) {
      setDeleteStatus("error");
      setDeleteError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Background />
        <Navigation />
        <div className="pt-24 px-4 max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-16 w-96" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Background />
        <Navigation />
        <div className="text-center pt-24">
          <Trophy className="h-16 w-16 mx-auto text-white/20 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Player Not Found</h1>
          <p className="text-white/50 mb-6">The player you&apos;re looking for doesn&apos;t exist.</p>
          <Button variant="default" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Background />
      <Navigation />

      <main className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-white/50 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-8 sm:p-10"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-[#FFD700]/5 to-transparent rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-[#FFD700]/20 to-[#1B5E20]/20 flex items-center justify-center ring-2 ring-[#FFD700]/30">
                  <Trophy className="h-14 w-14 sm:h-20 sm:w-20 text-[#FFD700]" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                      {player.name}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                      <Badge variant="secondary"><Flag country={player.nationality} /> {player.nationality}</Badge>
                      <Badge variant="gold">{player.position}</Badge>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="gap-1.5"
                      onClick={openEdit}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => {
                        setDeleteAuthKey("");
                        setDeleteStatus("idle");
                        setDeleteError("");
                        setDeleteOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                    <ShareButton
                      title={`${player.name} - Football Legends Ranking`}
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center md:justify-start gap-8">
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl font-bold text-[#FFD700]">
                      {player.score}
                    </div>
                    <div className="text-xs text-white/40 mt-1">
                      Overall Score
                    </div>
                  </div>
                  <Separator orientation="vertical" className="h-12" />
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-white">
                      {ACHIEVEMENT_CONFIG.reduce(
                        (sum, c) => sum + player[c.key],
                        0
                      )}
                    </div>
                    <div className="text-xs text-white/40 mt-1">
                      Total Trophies
                    </div>
                  </div>
                </div>

                <div className="flex md:hidden items-center justify-center gap-4 mt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-1.5"
                    onClick={openEdit}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => {
                      setDeleteAuthKey("");
                      setDeleteStatus("idle");
                      setDeleteError("");
                      setDeleteOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                  <ShareButton
                    title={`${player.name} - Football Legends Ranking`}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {player.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 to-white/[0.02] backdrop-blur-xl p-6 relative overflow-hidden"
            >
              <div className="absolute -top-6 -left-6 text-[#FFD700]/10">
                <Quote className="h-16 w-16" />
              </div>
              <div className="relative z-10">
                <p className="text-white/80 text-base leading-relaxed italic pl-4 border-l-2 border-[#FFD700]/40">
                  {player.description}
                </p>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-6">
                Achievements
              </h2>
              <div className="space-y-4">
                {ACHIEVEMENT_CONFIG.map((config, i) => {
                  const Icon = ICON_MAP[config.icon] || Trophy;
                  const value = player[config.key];
                  const percentage = Math.min(
                    (value / config.maxValue) * 100,
                    100
                  );

                  return (
                    <motion.div
                      key={config.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon
                            className="h-3.5 w-3.5"
                            style={{ color: config.color }}
                          />
                          <span className="text-sm text-white/70">
                            {config.label}
                          </span>
                        </div>
                        <span
                          className="text-sm font-bold"
                          style={{ color: config.color }}
                        >
                          {value}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{
                            duration: 0.8,
                            delay: 0.1 + 0.05 * i,
                            ease: "easeOut",
                          }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: config.color }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-6">
                Performance Radar
              </h2>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis
                    dataKey="stat"
                    tick={{
                      fill: "rgba(255,255,255,0.5)",
                      fontSize: 10,
                    }}
                  />
                  <Radar
                    name="Achievements"
                    dataKey="value"
                    stroke="#FFD700"
                    fill="#FFD700"
                    fillOpacity={0.2}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1a1a2e",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "white" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {similarPlayers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <h2 className="text-lg font-semibold text-white mb-4">
                Similar Players
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {similarPlayers.map((p) => (
                  <motion.button
                    key={p.id}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => router.push(`/players/${slugify(p.name)}`)}
                    className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 text-center hover:bg-white/10 transition-all"
                  >
                    <div className="text-sm font-semibold text-white mb-1">
                      {p.name}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-white/50 mb-2">
                      <span><Flag country={p.nationality} /> {p.nationality}</span>
                      <span className="text-white/20">|</span>
                      <span>{p.position}</span>
                    </div>
                    <div className="text-lg font-bold text-[#FFD700]">
                      {p.score}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
            <DialogDescription>
              Update the player&apos;s details and achievements.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-xl border border-[#FFD700]/20 bg-[#FFD700]/[0.03] p-4 space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-white">
                <KeyRound className="h-4 w-4 text-[#FFD700]" />
                Authentication Key
              </label>
              <Input
                type="password"
                placeholder="Enter authentication key"
                value={editAuthKey}
                onChange={(e) => setEditAuthKey(e.target.value)}
                required
              />
            </div>

            {editStatus === "success" && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                <p className="text-green-300 text-sm">Player updated successfully!</p>
              </div>
            )}

            {editStatus === "error" && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <p className="text-red-300 text-sm">{editError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-white/60">Name</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-white/60">Nationality</label>
                <Combobox
                  options={COUNTRIES}
                  value={editForm.nationality}
                  onChange={(v) => setEditForm((f) => ({ ...f, nationality: v }))}
                  placeholder="Type to search country..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-white/60">Position</label>
                <Select
                  value={editForm.position}
                  onValueChange={(v) => setEditForm((f) => ({ ...f, position: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POSITIONS.map((pos) => (
                      <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-white/60">Score</label>
                <Input
                  type="number"
                  step="0.25"
                  value={editForm.score}
                  onChange={(e) => setEditForm((f) => ({ ...f, score: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-white/60 mb-2">Achievement Counts</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { key: "continentalClub", label: "Cont. Club" },
                  { key: "continentalNational", label: "Cont. National" },
                  { key: "worldCup", label: "World Cup" },
                  { key: "domesticLeague", label: "Dom. League" },
                  { key: "ballonDor", label: "Ballon d'Or" },
                  { key: "worldCupRunnerUp", label: "WC RU" },
                  { key: "worldCupThirdPlace", label: "WC 3rd" },
                  { key: "continentalRunnerUp", label: "Cont. RU" },
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-1">
                    <label className="text-xs text-white/50">{label}</label>
                    <Input
                      type="number"
                      step="0.5"
                      min="0"
                      value={(editForm as Record<string, string>)[key]}
                      onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white/60">Description</label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 gap-1 text-xs text-[#FFD700] hover:text-[#FFD700]/80"
                  disabled={generatingDesc}
                  onClick={async () => {
                    if (!editForm.name) return;
                    setGeneratingDesc(true);
                    try {
                      const res = await fetch("/api/players/generate-description", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          authKey: editAuthKey,
                          name: editForm.name,
                          nationality: editForm.nationality,
                          position: editForm.position,
                          achievements: ACHIEVEMENT_CONFIG.map((c) => ({
                            label: c.label,
                            value: parseFloat((editForm as Record<string, string>)[c.key]) || 0,
                          })),
                        }),
                      });
                      if (res.ok) {
                        const data = await res.json();
                        setEditForm((f) => ({ ...f, description: data.description }));
                      }
                    } catch {
                      // silently fail
                    } finally {
                      setGeneratingDesc(false);
                    }
                  }}
                >
                  <Sparkles className="h-3 w-3" />
                  {generatingDesc ? "Generating..." : "Generate with AI"}
                </Button>
              </div>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Iconic description, nickname, playing style, achievements..."
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#FFD700]/50 resize-none"
              />
            </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={editStatus === "submitting"}
            >
              {editStatus === "submitting" ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Player</DialogTitle>
            <DialogDescription>
              This will permanently remove <strong className="text-white">{player.name}</strong> from the ranking.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.03] p-4 space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-white">
                <KeyRound className="h-4 w-4 text-red-400" />
                Authentication Key
              </label>
              <Input
                type="password"
                placeholder="Enter authentication key"
                value={deleteAuthKey}
                onChange={(e) => setDeleteAuthKey(e.target.value)}
                required
              />
            </div>

            {deleteStatus === "success" && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                <p className="text-green-300 text-sm">Redirecting to dashboard...</p>
              </div>
            )}

            {deleteStatus === "error" && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <p className="text-red-300 text-sm">{deleteError}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteStatus === "submitting"}
            >
              {deleteStatus === "submitting" ? "Deleting..." : "Delete Player"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
