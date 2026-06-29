"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Globe,
  Star,
  Award,
  Medal,
  Earth,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Flag } from "@/lib/flags";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ACHIEVEMENT_CONFIG, slugify } from "@/lib/players";
import type { Player } from "@/types/player";

const ICON_MAP: Record<string, React.ElementType> = {
  Trophy,
  Earth,
  Globe,
  Award,
  Star,
  Medal,
};

interface PlayerModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PlayerModal({ player, isOpen, onClose }: PlayerModalProps) {
  if (!player) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{player.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/10 ring-2 ring-[#FFD700]/30">
                <Trophy className="h-8 w-8 text-[#FFD700]" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white">{player.name}</h2>
              <div className="flex items-center justify-center gap-3 mt-1">
                <Badge variant="secondary"><Flag country={player.nationality} /> {player.nationality}</Badge>
                <Badge variant="gold">{player.position}</Badge>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="pt-2"
            >
              <div className="text-4xl font-bold text-[#FFD700]">
                {player.score}
                <span className="text-lg font-normal text-white/40 ml-1">
                  pts
                </span>
              </div>
              <p className="text-xs text-white/40 mt-1">Overall Score</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <a
                href={`/players/${slugify(player.name)}`}
                onClick={onClose}
              >
                <Button variant="outline" size="sm" className="gap-1.5 mt-2">
                  <ExternalLink className="h-4 w-4" />
                  View Full Profile
                </Button>
              </a>
            </motion.div>
          </div>

          <Separator className="bg-white/10" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Achievements
            </h3>

            <div className="space-y-3">
              {ACHIEVEMENT_CONFIG.map((achievement, i) => {
                const IconComponent = ICON_MAP[achievement.icon] || Trophy;
                const value = player[achievement.key] as number;
                const percentage = Math.min(
                  (value / achievement.maxValue) * 100,
                  100
                );

                return (
                  <motion.div
                    key={achievement.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent
                          className="h-3.5 w-3.5"
                          style={{ color: achievement.color }}
                        />
                        <span className="text-sm text-white/70">
                          {achievement.label}
                        </span>
                      </div>
                      <span
                        className="text-sm font-bold"
                        style={{ color: achievement.color }}
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
                          delay: 0.2 + 0.1 * i,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full transition-all"
                        style={{ backgroundColor: achievement.color }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
