import { getCurrentSeason } from "@/app/actions/seasons";
import { getTeams } from "@/app/actions/teams";
import { IconTarget } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NEXT_REVALIDATE_TIME } from "@/constants/next_revalidat_time";
import { Metadata } from "next";
import { calculateTopScorers } from "@/lib/stats";

export const revalidate = NEXT_REVALIDATE_TIME;

export async function generateMetadata(): Promise<Metadata> {
  const { success: seasonSuccess, season } = await getCurrentSeason();
  const { success: teamsSuccess, teams } = await getTeams();

  if (!seasonSuccess || !season || !teamsSuccess || !teams) {
    return {
      title: "Meilleurs Buteurs | Match Champions",
      description: "Découvrez les meilleurs buteurs du championnat.",
    };
  }

  const topScorers = calculateTopScorers(season, teams);
  const topFiveScorers = topScorers.slice(0, 5).map((scorer) => {
    const team = teams.find((t) => t.id === scorer.teamId);
    return {
      name: scorer.playerName,
      goals: scorer.goals,
      team,
    };
  });

  const topFiveText = topFiveScorers
    .map((scorer) => `${scorer.name} (${scorer.goals} buts)`)
    .join(", ");

  // Get team logos for OpenGraph image
  const teamLogos = topFiveScorers
    .map((scorer) => scorer.team?.logo)
    .filter(Boolean);

  const ogImageUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/api/og`);
  ogImageUrl.searchParams.set("title", `Meilleurs Buteurs ${season.name}`);
  ogImageUrl.searchParams.set("subtitle", topFiveText);
  if (teamLogos.length > 0) {
    ogImageUrl.searchParams.set(
      "logos",
      encodeURIComponent(JSON.stringify(teamLogos))
    );
  }

  return {
    title: `Meilleurs Buteurs ${season.name} | Match Champions`,
    description: `Découvrez les meilleurs buteurs du championnat ${season.name}. Top 5 : ${topFiveText}.`,
    keywords: [
      "buteurs",
      "statistiques",
      "football",
      season.name,
      ...topScorers.map((scorer) => scorer.playerName),
    ],
    openGraph: {
      title: `Meilleurs Buteurs ${season.name} | Match Champions`,
      description: `Top 5 des buteurs : ${topFiveText}`,
      type: "website",
      locale: "fr_FR",
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: `Meilleurs Buteurs ${season.name}`,
        },
      ],
    },
  };
}

export default async function TopScorersPage() {
  const { success: seasonSuccess, season } = await getCurrentSeason();
  const { success: teamsSuccess, teams } = await getTeams();

  if (!seasonSuccess || !season || !teamsSuccess || !teams) {
    return (
      <main className="min-h-screen pt-16">
        <div className="px-4 md:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              Données non disponibles
            </h1>
            <p className="text-muted-foreground">
              Les statistiques des buteurs ne sont pas disponibles pour le moment.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16">
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex h-16 md:h-20 items-center px-4 md:px-8">
          <div className="flex items-center gap-2 font-bold">
            <IconTarget className="h-5 w-5 md:h-6 md:w-6" />
            <h1 className="text-lg md:text-2xl">Classement des Buteurs</h1>
          </div>
          <span className="ml-auto text-sm md:text-base text-muted-foreground">
            Saison {season.name}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Pos</TableHead>
                  <TableHead>Joueur</TableHead>
                  <TableHead>Équipe</TableHead>
                  <TableHead className="text-center">Buts</TableHead>
                  <TableHead className="text-center">Passes D.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculateTopScorers(season, teams).map((scorer, index) => {
                  const team = teams.find((t) => t.id === scorer.teamId);
                  return (
                    <TableRow key={`${scorer.playerName}-${scorer.teamId}`} className={index < 3 ? "font-medium" : undefined}>
                      <TableCell className={`font-medium ${index < 3 ? "text-primary" : ""}`}>
                        {index + 1}
                      </TableCell>
                      <TableCell>{scorer.playerName}</TableCell>
                      <TableCell>{team?.name || "Équipe inconnue"}</TableCell>
                      <TableCell className="text-center">{scorer.goals}</TableCell>
                      <TableCell className="text-center">{scorer.assists}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}