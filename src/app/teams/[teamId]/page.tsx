import { getTeam } from "@/app/actions/teams";
import { TeamDetailsSection } from "@/components/sections/TeamDetailsSection";
import { IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function TeamPage({
  params,
}: {
  params: { teamId: string };
}) {
  const { success, team } = await getTeam(params.teamId);

  if (!success || !team) {
    return (
      <main className="min-h-screen pt-16">
        <div className="px-4 md:px-8">
          <h1 className="text-2xl md:text-3xl font-bold">Équipe non trouvée</h1>
        </div>
      </main>
    );
  }

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
        <TeamDetailsSection team={team} />
      </div>
    </main>
  );
} 