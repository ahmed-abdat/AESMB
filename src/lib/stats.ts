import { Season } from "@/types/season";
import { Team } from "@/types/team";

export interface PlayerStats {
  playerName: string;
  teamId: string;
  goals: number;
}

export interface AssisterStats {
  playerName: string;
  teamId: string;
  assists: number;
}

export function calculateTopScorers(
  season: Season,
  teams: Team[]
): PlayerStats[] {
  const playerStats = new Map<string, PlayerStats>();

  // First, initialize all players with their goals from team stats
  teams.forEach((team) => {
    team.members.forEach((member) => {
      const key = `${member.name}-${team.id}`;
      playerStats.set(key, {
        playerName: member.name,
        teamId: team.id,
        goals: member.stats.goals || 0,
      });
    });
  });

  // Convert to array and sort by goals
  return Array.from(playerStats.values()).sort((a, b) => b.goals - a.goals);
}

export function calculateTopAssisters(
  season: Season,
  teams: Team[]
): AssisterStats[] {
  const assisterStats = new Map<string, AssisterStats>();

  // Initialize all players with their assists from team stats
  teams.forEach((team) => {
    team.members.forEach((member) => {
      const key = `${member.name}-${team.id}`;
      assisterStats.set(key, {
        playerName: member.name,
        teamId: team.id,
        assists: member.stats.assists || 0,
      });
    });
  });

  // Convert to array and sort by assists
  return Array.from(assisterStats.values()).sort(
    (a, b) => b.assists - a.assists
  );
}
