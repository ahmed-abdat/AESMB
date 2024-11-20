import { getAllTeams } from "@/app/actions/teams";
import { TeamsPageContent } from "@/components/dashboard/teams/TeamsPageContent";

export default async function TeamsPage() {
  const result = await getAllTeams();

  if (!result.success) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          {result.error?.message || "Erreur lors du chargement des équipes"}
        </p>
      </div>
    );
  }

  return <TeamsPageContent initialTeams={result.teams} />;
}
