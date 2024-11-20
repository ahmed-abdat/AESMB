import { Timestamp } from "firebase/firestore";

export type SeasonStatus = 'upcoming' | 'ongoing' | 'completed';

export interface PointsSystem {
  win: number;
  draw: number;
  loss: number;
}

export interface SeasonFormData {
  name: string;
  startDate: Date;
  endDate: Date;
}

export interface Goal {
  id: string;
  scorerId: string;
  assistId?: string;
}

export interface MatchResult {
  homeScore: number;
  awayScore: number;
  goals: {
    home: Goal[];
    away: Goal[];
  };
}

export interface MatchStats {
  possession: number;
  shots: number;
  shotsOnTarget: number;
  corners: number;
  fouls: number;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  result?: MatchResult;
}

export interface Round {
  id: string;
  number: number;
  matches: Match[];
}

export interface TeamStats {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface Standing {
  stats: TeamStats;
  position: number;
}

export interface Season {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: SeasonStatus;
  pointsSystem: PointsSystem;
  teams: string[];
  rounds: Round[];
}

export interface SeasonFirestore {
  name: string;
  startDate: Timestamp;
  endDate: Timestamp;
  status: SeasonStatus;
  pointsSystem: PointsSystem;
  teams: string[];
  rounds: Round[];
  createdAt?: Timestamp;
}

export const DEFAULT_POINTS_SYSTEM: PointsSystem = {
  win: 3,
  draw: 1,
  loss: 0,
} as const;

export function convertFirestoreDataToSeason(id: string, data: any): Season {
  return {
    id,
    name: data.name,
    startDate: data.startDate.toDate(),
    endDate: data.endDate.toDate(),
    status: data.status,
    pointsSystem: {
      win: data.pointsSystem?.win ?? 0,
      draw: data.pointsSystem?.draw ?? 0,
      loss: data.pointsSystem?.loss ?? 0,
    },
    teams: data.teams ?? [],
    rounds: data.rounds ?? [],
  };
} 