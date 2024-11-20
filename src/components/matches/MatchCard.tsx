"use client";

import { Card } from "../ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTeam } from "@/hooks/useTeam";
import Image from "next/image";

interface MatchCardProps {
  homeTeamId: string;
  awayTeamId: string;
  matchDate: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export function MatchCard({ homeTeamId, awayTeamId, matchDate, status }: MatchCardProps) {
  const { team: homeTeam } = useTeam(homeTeamId);
  const { team: awayTeam } = useTeam(awayTeamId);

  if (!homeTeam || !awayTeam) {
    return null; // or loading state
  }

  return (
    <Card className="p-3 md:p-4">
      <div className="flex flex-col space-y-3 md:space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="relative w-6 h-6 md:w-8 md:h-8">
              <Image
                src={homeTeam.logo}
                alt={homeTeam.name}
                fill
                sizes="(max-width: 768px) 24px, 32px"
                className="object-contain"
                priority
              />
            </div>
            <span className="text-sm md:text-base font-semibold">{homeTeam.name}</span>
          </div>
          <span className="text-sm md:text-base">vs</span>
          <div className="flex items-center space-x-2 md:space-x-3">
            <span className="text-sm md:text-base font-semibold">{awayTeam.name}</span>
            <div className="relative w-6 h-6 md:w-8 md:h-8">
              <Image
                src={awayTeam.logo}
                alt={awayTeam.name}
                fill
                sizes="(max-width: 768px) 24px, 32px"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
        <div className="text-xs md:text-sm text-muted-foreground text-center">
          {format(matchDate, "d MMMM yyyy 'à' HH'h'mm", { locale: fr })}
        </div>
      </div>
    </Card>
  );
}
