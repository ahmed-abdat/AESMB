import { IconClock } from "@tabler/icons-react";
import { Card } from "../ui/card";
import Image from "next/image";
import { clubs } from "@/types/tournament-data";

interface MatchCardProps {
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  matchTime: string;
  matchDate: string;
}

export function MatchCard({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  matchTime,
  matchDate,
}: MatchCardProps) {
  const isUpcoming = homeScore === undefined && awayScore === undefined;
  const homeTeamData = clubs.find((club) => club.id === homeTeam);
  const awayTeamData = clubs.find((club) => club.id === awayTeam);

  if (!homeTeamData || !awayTeamData) return null;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>AESMB League</span>
          <div className="flex items-center gap-1">
            <IconClock className="w-4 h-4" />
            <span>{matchTime || "21:00"}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="relative w-12 h-12">
              <Image
                src={homeTeamData.logo}
                alt={homeTeamData.name}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <span className="font-semibold text-sm text-center">
              {homeTeamData.name}
            </span>
          </div>

          <div className="px-4 py-2 bg-muted rounded-xl min-w-[80px] text-center mx-4">
            {isUpcoming ? (
              <span className="text-sm font-medium">VS</span>
            ) : (
              <span className="font-bold text-lg">{`${homeScore} - ${awayScore}`}</span>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="relative w-12 h-12">
              <Image
                src={awayTeamData.logo}
                alt={awayTeamData.name}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <span className="font-semibold text-sm text-center">
              {awayTeamData.name}
            </span>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground border-t pt-2">
          {matchDate}
        </div>
      </div>
    </Card>
  );
}
