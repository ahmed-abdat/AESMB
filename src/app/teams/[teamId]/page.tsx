import { getTeam } from "@/app/actions/teams";
import { getAllSeasons } from "@/app/actions/seasons";
import { TeamDetailsSection } from "@/components/sections/TeamDetailsSection";
import { IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NEXT_REVALIDATE_TIME } from "@/constants/next_revalidat_time";
import { Season } from "@/types/season";
import { Metadata } from "next";
import { TeamMember } from "@/types/team";

export const revalidate = NEXT_REVALIDATE_TIME;

export async function generateMetadata({
  params,
}: {
  params: { teamId: string };
}): Promise<Metadata> {
  const { success, team } = await getTeam(params.teamId);
  const { seasons } = await getAllSeasons();

  if (!success || !team) {
    return {
      title: "Équipe non trouvée | Match Champions",
      description: "Cette équipe n'existe pas ou a été supprimée.",
    };
  }

  // Get the team's current season
  const currentSeason = seasons.find(season => 
    team.seasons.includes(season.id) && 
    season.status === "ongoing"
  );

  // Create OpenGraph image URL
  const ogImageUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/api/og`);
  ogImageUrl.searchParams.set("title", team.name);
  ogImageUrl.searchParams.set("subtitle", currentSeason ? `Saison ${currentSeason.name}` : "Fiche d'équipe");
  ogImageUrl.searchParams.set("logos", encodeURIComponent(JSON.stringify([team.logo])));

  // Get team stats
  const totalGoals = team.members.reduce((sum: number, member: TeamMember) => 
    sum + (member.stats.goals || 0), 0
  );
  const totalAssists = team.members.reduce((sum: number, member: TeamMember) => 
    sum + (member.stats.assists || 0), 0
  );

  const description = `${team.name} - ${team.members.length} joueurs inscrits. ` +
    `Performance de l'équipe : ${totalGoals} buts marqués, ${totalAssists} passes décisives. ` +
    `Suivez les performances de l'équipe match après match.`;

  return {
    title: `${team.name} | Match Champions`,
    description,
    openGraph: {
      title: `${team.name} | Match Champions`,
      description: `Statistiques et résultats de ${team.name}`,
      type: "website",
      locale: "fr_FR",
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: `${team.name} - Fiche d'équipe`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${team.name} | Match Champions`,
      description: `Statistiques et résultats de ${team.name}`,
      images: [ogImageUrl.toString()],
    },
    keywords: [
      "football",
      "équipe",
      team.name,
      "statistiques",
      "joueurs",
      "résultats",
      currentSeason?.name,
      ...team.members.map((member: TeamMember) => member.name),
    ].filter(Boolean),
  };
}

export default async function TeamPage({
  params,
}: {
  params: { teamId: string };
}) {
  const { success, team } = await getTeam(params.teamId);
  const { seasons } = await getAllSeasons();

  if (!success || !team) {
    return (
      <main className="min-h-screen pt-16">
        <div className="px-4 md:px-8">
          <h1 className="text-2xl md:text-3xl font-bold">Équipe non trouvée</h1>
        </div>
      </main>
    );
  }

  // Filter seasons where the team has matches
  const teamSeasons = seasons.filter((season: Season) =>
    season.rounds.some((round) =>
      round.matches.some(
        (match) => match.homeTeamId === team.id || match.awayTeamId === team.id
      )
    )
  );

  return (
    <main className="min-h-screen pt-16">
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex h-16 md:h-20 items-center px-4 md:px-8">
          <Link href="/teams">
            <Button variant="ghost" size="sm" className="gap-2">
              <IconArrowLeft className="w-4 h-4" />
              Retour aux équipes
            </Button>
          </Link>
        </div>
      </div>

      <div className="py-4 md:py-8 px-4 md:px-8">
        <TeamDetailsSection team={team} seasons={teamSeasons} />
      </div>
    </main>
  );
}
