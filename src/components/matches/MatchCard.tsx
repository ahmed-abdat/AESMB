"use client";

import { Card } from "../ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTeam } from "@/hooks/useTeam";
import Image from "next/image";
import { IconPhotoOff } from "@tabler/icons-react";
import { useState } from "react";

interface MatchCardProps {
  homeTeamId: string;
  awayTeamId: string;
  matchDate: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
}

function TeamLogo({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-12 h-12">
      {imageError ? (
        <div className="w-12 h-12 bg-muted flex items-center justify-center rounded-md">
          <IconPhotoOff className="w-6 h-6 text-muted-foreground" />
        </div>
      ) : (
        <Image
          src={src || '/placeholder-team.png'}
          alt={alt}
          fill
          sizes="(max-width: 48px) 100vw, 48px"
          className="object-contain"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
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
            <TeamLogo src={homeTeam.logo} alt={homeTeam.name} />
            <span className="text-sm md:text-base font-semibold">{homeTeam.name}</span>
          </div>
          <span className="text-sm md:text-base">vs</span>
          <div className="flex items-center space-x-2 md:space-x-3">
            <span className="text-sm md:text-base font-semibold">{awayTeam.name}</span>
            <TeamLogo src={awayTeam.logo} alt={awayTeam.name} />
          </div>
        </div>
        <div className="text-xs md:text-sm text-muted-foreground text-center">
          {format(matchDate, "d MMMM yyyy 'à' HH'h'mm", { locale: fr })}
        </div>
      </div>
    </Card>
  );
}
