import { getCurrentSeason } from "@/app/actions/seasons";
import { getTeams } from "@/app/actions/teams";
import { ResultsSection } from "@/components/sections/ResultsSection";
import { IconCalendarStats, IconTrophy, IconUsers } from "@tabler/icons-react";
import { Suspense } from "react";
import { NEXT_REVALIDATE_TIME } from "@/constants/next_revalidat_time";
import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";

export const revalidate = NEXT_REVALIDATE_TIME;

export async function generateMetadata(): Promise<Metadata> {
  const { success: seasonSuccess, season } = await getCurrentSeason();
  const { success: teamsSuccess, teams } = await getTeams();

  if (!seasonSuccess || !season || !teamsSuccess || !teams) {
    return {
      title: "Résultats | Match Champions",
      description: "Consultez les résultats des matchs du championnat.",
    };
  }

  // Get latest results
  const latestResults = season.rounds
    .flatMap((round) => round.matches)
    .filter((match) => match.status === "completed")
    .slice(-3)
    .map((match) => {
      const homeTeam = teams.find((t) => t.id === match.homeTeamId)?.name || "";
      const awayTeam = teams.find((t) => t.id === match.awayTeamId)?.name || "";
      return `${homeTeam} ${match.result?.homeScore}-${match.result?.awayScore} ${awayTeam}`;
    })
    .join(", ");

  return {
    title: `Résultats ${season.name} | Match Champions`,
    description: `Consultez tous les résultats du championnat ${season.name}. Derniers résultats : ${latestResults}`,
    keywords: [
      "résultats",
      "matchs",
      "scores",
      "championnat",
      season.name,
      ...teams.map((team) => team.name),
    ],
    openGraph: {
      title: `Résultats ${season.name} | Match Champions`,
      description: `Derniers résultats : ${latestResults}`,
      type: "website",
      locale: "fr_FR",
      images: [
        {
          url: `/logo.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function ResultsPage() {
  const { success: seasonSuccess, season: fetchedSeason } =
    await getCurrentSeason();
  const { success: teamsSuccess, teams } = await getTeams();

  if (!seasonSuccess || !fetchedSeason || !teamsSuccess || !teams) {
    return (
      <main className="min-h-screen pt-16">
        <div className="px-4 md:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              Données non disponibles
            </h1>
            <p className="text-muted-foreground">
              Les résultats ne sont pas disponibles pour le moment. Veuillez
              réessayer plus tard.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Calculate some stats for the overview cards
  const completedMatches = fetchedSeason.rounds
    .flatMap((round) => round.matches)
    .filter((match) => match.status === "completed").length;

  const totalMatches = fetchedSeason.rounds.flatMap(
    (round) => round.matches
  ).length;

  const totalGoals = fetchedSeason.rounds
    .flatMap((round) => round.matches)
    .filter((match) => match.status === "completed")
    .reduce((total, match) => {
      return (
        total + (match.result?.homeScore || 0) + (match.result?.awayScore || 0)
      );
    }, 0);

  return (
    <main className="min-h-screen pt-16">
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-16 md:h-20 items-center px-4 md:px-8">
            <div className="flex items-center gap-2 font-bold">
              <IconCalendarStats className="h-5 w-5 md:h-6 md:w-6" />
              <h1 className="text-lg md:text-2xl">Résultats</h1>
            </div>
            <span className="ml-auto text-sm md:text-base text-muted-foreground">
              Saison {fetchedSeason.name}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 md:px-8">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <IconCalendarStats className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Matchs Joués
                  </p>
                  <p className="text-2xl font-bold">
                    {completedMatches} / {totalMatches}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <IconTrophy className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Buts
                  </p>
                  <p className="text-2xl font-bold">{totalGoals}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <IconUsers className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Équipes
                  </p>
                  <p className="text-2xl font-bold">{teams.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Suspense
          fallback={
            <div className="text-center py-8">Chargement des résultats...</div>
          }
        >
          <ResultsSection season={fetchedSeason} teams={teams} />
        </Suspense>
      </div>
    </main>
  );
}
