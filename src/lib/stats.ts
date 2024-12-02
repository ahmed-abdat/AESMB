import { Season, MatchResult, Goal } from "@/types/season";
import { Team } from "@/types/team";

export interface PlayerStats {
  playerName: string;
  teamId: string;
  goals: number;
  assists: number;
}

export function calculateTopScorers(season: Season, teams: Team[]): PlayerStats[] {
  const playerStats = new Map<string, PlayerStats>();

  // Process each match in each round
  season.rounds.forEach(round => {
    round.matches.forEach(match => {
      if (match.status === "completed" && match.result) {
        // Process home team goals
        match.result.goals.home.forEach(goal => {
          if (goal.type === "regular" && goal.scorerId) {
            const homeTeam = teams.find(team => team.id === match.homeTeamId);
            const scorer = homeTeam?.members.find(member => member.id === goal.scorerId);
            if (scorer) {
              const key = `${scorer.name}-${match.homeTeamId}`;
              const existingStats = playerStats.get(key) || {
                playerName: scorer.name,
                teamId: match.homeTeamId,
                goals: 0,
                assists: 0,
              };
              existingStats.goals += 1;
              playerStats.set(key, existingStats);
            }
          }

          if (goal.assistId) {
            const homeTeam = teams.find(team => team.id === match.homeTeamId);
            const assister = homeTeam?.members.find(member => member.id === goal.assistId);
            if (assister) {
              const key = `${assister.name}-${match.homeTeamId}`;
              const existingStats = playerStats.get(key) || {
                playerName: assister.name,
                teamId: match.homeTeamId,
                goals: 0,
                assists: 0,
              };
              existingStats.assists += 1;
              playerStats.set(key, existingStats);
            }
          }
        });

        // Process away team goals
        match.result.goals.away.forEach(goal => {
          if (goal.type === "regular" && goal.scorerId) {
            const awayTeam = teams.find(team => team.id === match.awayTeamId);
            const scorer = awayTeam?.members.find(member => member.id === goal.scorerId);
            if (scorer) {
              const key = `${scorer.name}-${match.awayTeamId}`;
              const existingStats = playerStats.get(key) || {
                playerName: scorer.name,
                teamId: match.awayTeamId,
                goals: 0,
                assists: 0,
              };
              existingStats.goals += 1;
              playerStats.set(key, existingStats);
            }
          }

          if (goal.assistId) {
            const awayTeam = teams.find(team => team.id === match.awayTeamId);
            const assister = awayTeam?.members.find(member => member.id === goal.assistId);
            if (assister) {
              const key = `${assister.name}-${match.awayTeamId}`;
              const existingStats = playerStats.get(key) || {
                playerName: assister.name,
                teamId: match.awayTeamId,
                goals: 0,
                assists: 0,
              };
              existingStats.assists += 1;
              playerStats.set(key, existingStats);
            }
          }
        });
      }
    });
  });

  // Convert to array and sort by goals
  return Array.from(playerStats.values())
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists);
}

export function calculateTopAssisters(season: Season, teams: Team[]): PlayerStats[] {
  // We can reuse the same calculation and just sort differently
  return calculateTopScorers(season, teams)
    .sort((a, b) => b.assists - a.assists || b.goals - a.goals);
} 