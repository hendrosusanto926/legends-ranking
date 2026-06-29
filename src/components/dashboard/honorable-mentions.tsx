"use client";

import { motion } from "framer-motion";
import { Crown, Trophy, Star, Globe, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Flag } from "@/lib/flags";

const HONOREES = [
  {
    name: "Franz Beckenbauer",
    country: "Germany",
    position: "CB • Libero",
    description:
      "The legendary 'Kaiser' redefined the role of a defender with elegance, intelligence, and leadership. As captain, he led West Germany to FIFA World Cup glory, won the UEFA European Championship, and lifted the European Cup with Bayern Munich, becoming one of football's greatest leaders.",
    achievements: [
      "World Cup Winner (1974)",
      "European Championship (1972)",
      "European Cup x3 (1974, 1975, 1976)",
      "Ballon d'Or x2",
    ],
    color: "from-[#FFD700]/10 via-transparent to-transparent",
    border: "border-[#FFD700]/30",
    gradient: "from-[#FFD700]/5 to-transparent",
  },
  {
    name: "Didier Deschamps",
    country: "France",
    position: "CDM • Captain",
    description:
      "A tireless leader in midfield, Didier Deschamps captained France to FIFA World Cup and UEFA European Championship triumphs while also lifting the UEFA Champions League with Marseille, earning his place among football's most accomplished captains.",
    achievements: [
      "World Cup Winner (1998)",
      "European Championship (2000)",
      "Champions League (1993)",
      "Multiple League Titles",
    ],
    color: "from-blue-500/10 via-transparent to-transparent",
    border: "border-blue-500/30",
    gradient: "from-blue-500/5 to-transparent",
  },
  {
    name: "Iker Casillas",
    country: "Spain",
    position: "GK • Captain",
    description:
      "One of the greatest goalkeepers in football history, Iker Casillas captained Spain during its golden era to FIFA World Cup and UEFA European Championship success while also leading Real Madrid to UEFA Champions League glory.",
    achievements: [
      "World Cup Winner (2010)",
      "European Championship x2 (2008, 2012)",
      "Champions League x3 (2000, 2002, 2014)",
      "Multiple League Titles",
    ],
    color: "from-red-500/10 via-transparent to-transparent",
    border: "border-red-500/30",
    gradient: "from-red-500/5 to-transparent",
  },
];

const ICONS = [Trophy, Globe, Award];

export function HonorableMentions() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Honorable{" "}
            <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
              Mentions
            </span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base max-w-2xl mx-auto">
            Celebrating legendary captains who achieved football&apos;s rarest
            triple: winning the World Cup, Continental Championship, and
            Champions League as captain.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HONOREES.map((honoree, index) => {
            const Icon = ICONS[index];
            return (
              <motion.div
                key={honoree.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 * index }}
                whileHover={{ y: -5 }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border p-6 backdrop-blur-xl transition-all duration-500",
                  honoree.border,
                  `bg-gradient-to-b ${honoree.gradient}`,
                  "hover:shadow-2xl hover:shadow-black/30"
                )}
              >
                <div
                  className={cn(
                    "absolute top-0 right-0 w-40 h-40 opacity-30 rounded-full blur-3xl",
                    honoree.color
                  )}
                />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
                      <Flag country={honoree.country} className="w-8 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {honoree.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <span>{honoree.country}</span>
                        <span className="text-white/20">•</span>
                        <span>{honoree.position}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="gold" className="text-[10px]">
                      <Crown className="h-3 w-3 mr-1" />
                      Captain
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      <Star className="h-3 w-3 mr-1" />
                      Legend
                    </Badge>
                  </div>

                  <p className="text-sm text-white/60 leading-relaxed">
                    {honoree.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    {honoree.achievements.map((ach, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs text-white/50"
                      >
                        <Icon className="h-3 w-3 text-[#FFD700]" />
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
