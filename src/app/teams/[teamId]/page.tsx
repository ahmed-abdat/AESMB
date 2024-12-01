import { getTeam } from "@/app/actions/teams";
import { getAllSeasons } from "@/app/actions/seasons";
import { TeamDetailsSection } from "@/components/sections/TeamDetailsSection";
import { IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NEXT_REVALIDATE_TIME } from "@/constants/next_revalidat_time";
import { Season } from "@/types/season";
import { Metadata } from "next";

export const revalidate = NEXT_REVALIDATE_TIME;

export async function generateMetadata({
  params,
}: {
  params: { teamId: string };
}): Promise<Metadata> {
  const { success, team } = await getTeam(params.teamId);

  if (!success || !team) {
    return {
      title: "Équipe non trouvée | Match Champions",
      description: "Cette équipe n'existe pas ou a été supprimée.",
    };
  }

  return {
    title: `${team.name} | Match Champions`,
    description: `Découvrez les statistiques, les résultats et l'historique de ${team.name} dans le championnat. Suivez les performances de l'équipe match après match.`,
    openGraph: {
      title: `${team.name} | Match Champions`,
      description: `Statistiques et résultats de ${team.name} dans le championnat`,
      images: [
        {
          url: team.logo,
          width: 300,
          height: 300,
          alt: `Logo de ${team.name}`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `${team.name} | Match Champions`,
      description: `Statistiques et résultats de ${team.name}`,
      images: [{ url: team.logo, alt: `Logo de ${team.name}` }],
    },
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
