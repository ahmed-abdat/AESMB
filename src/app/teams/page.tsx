import { getTeams } from "@/app/actions/teams";
import { TeamsOverviewSection } from "@/components/sections/TeamsOverviewSection";
import { IconUsers } from "@tabler/icons-react";
import { NEXT_REVALIDATE_TIME } from '@/constants/next_revalidat_time';

export const revalidate = NEXT_REVALIDATE_TIME;

export default async function TeamsPage() {
  const { success, teams } = await getTeams();

  if (!success || !teams) {
    return (
      <main className="min-h-screen pt-16">
        <div className="px-4 md:px-8">
          <h1 className="text-2xl md:text-3xl font-bold">Données non disponibles</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16">
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex h-16 md:h-20 items-center px-4 md:px-8">
          <div className="flex items-center gap-2 font-bold">
            <IconUsers className="h-5 w-5 md:h-6 md:w-6" />
            <h1 className="text-lg md:text-2xl">Équipes</h1>
          </div>
        </div>
      </div>

      <div className="py-4 md:py-8 px-4 md:px-8">
        <TeamsOverviewSection teams={teams} />
      </div>
    </main>
  );
}
