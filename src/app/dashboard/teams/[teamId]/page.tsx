import { getTeam } from "@/app/actions/teams";
import { TeamDetails } from "@/components/dashboard/teams/TeamDetails";
import { LoadingScreen } from "@/components/LoadingScreen";

export default async function TeamDetailsPage({
  params,
}: {
  params: { teamId: string };
}) {
  const result = await getTeam(params.teamId);

  if (!result.success || !result.team) {
    return (
      <div className="min-h-[calc(100vh-5rem)] p-4 md:p-8 flex items-center justify-center">
        <p className="text-muted-foreground">
          {result.error?.message || "Équipe non trouvée"}
        </p>
      </div>
    );
  }

  return <TeamDetails team={result.team} />;
} 