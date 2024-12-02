import { Team } from "@/types/team";
import { StatsSection } from "./stats-section";
import { IconUsers } from "@tabler/icons-react";
import { teamsColumns } from "@/config/table-columns";

interface TeamsSectionProps {
  teams: Team[];
  seasonName: string;
}

interface TeamStats {
  id: string;
  name: string;
  membersCount: number;
  totalGoals: number;
  totalAssists: number;
}

export function TeamsSection({ teams, seasonName }: TeamsSectionProps) {
  // Transform teams data to include calculated stats
  const teamsData: TeamStats[] = teams.map(team => ({
    id: team.id,
    name: team.name,
    membersCount: team.members.length,
    totalGoals: team.members.reduce((sum, member) => sum + (member.stats.goals || 0), 0),
    totalAssists: team.members.reduce((sum, member) => sum + (member.stats.assists || 0), 0),
  }));

  // Sort teams by total goals
  const sortedTeamsData = [...teamsData].sort((a, b) => b.totalGoals - a.totalGoals);

  return (
    <StatsSection
      header={{
        title: "Équipes",
        subtitle: `Saison ${seasonName}`,
        icon: <IconUsers className="h-5 w-5 md:h-6 md:w-6" />
      }}
      data={sortedTeamsData}
      columns={teamsColumns}
      teams={teams}
      showSearch={true}
      searchStatKey="name"
      searchStatLabel="Équipe"
    />
  );
} 