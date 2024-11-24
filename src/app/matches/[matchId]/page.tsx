import { getCurrentSeason } from "@/app/actions/seasons";
import { getTeams } from "@/app/actions/teams";
import { MatchDetailsSection } from "@/components/sections/MatchDetailsSection";
import { IconBallFootball } from "@tabler/icons-react";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface MatchPageProps {
  params: {
    matchId: string;
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { matchId } = params;
  const { success: seasonSuccess, season } = await getCurrentSeason();
  const { success: teamsSuccess, teams } = await getTeams();

  if (!seasonSuccess || !season || !teamsSuccess || !teams) {
    return notFound();
  }

  // Find the match in the season
  const match = season.rounds.flatMap(round => 
    round.matches.map(match => ({
      ...match,
      roundNumber: round.number
    }))
  ).find(match => match.id === matchId);

  if (!match) {
    return notFound();
  }

  return (
    <main className="min-h-screen pt-16">
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex h-16 md:h-20 items-center px-4 md:px-8">
          <div className="flex items-center gap-2 font-bold">
            <IconBallFootball className="h-5 w-5 md:h-6 md:w-6" />
            <h1 className="text-lg md:text-2xl">Détails du Match</h1>
          </div>
          <span className="ml-auto text-sm md:text-base text-muted-foreground">
            Journée {match.roundNumber}
          </span>
        </div>
      </div>

      <div className="py-4 md:py-8 px-4 md:px-8">
        <MatchDetailsSection match={match} teams={teams} />
      </div>
    </main>
  );
} 