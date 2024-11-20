import { Timestamp } from "firebase/firestore";

export interface TeamMember {
  id: string;
  name: string;
  stats: {
    goals: number;
    assists: number;
  };
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  seasons: string[];
  members: TeamMember[];
  createdAt: string;
  updatedAt?: string;
}

export interface TeamFirestore {
  name: string;
  logo: string;
  seasons: string[];
  members: TeamMember[];
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface TeamFormData {
  name: string;
  logo: File;
  seasons: string[];
}

export interface TeamUpdateData {
  name: string;
  seasons: string[];
  logoUrl?: string;
  shouldDeleteLogo?: boolean;
}

export interface TeamMemberFormData {
  name: string;
}

export function convertFirestoreDataToTeam(id: string, data: any): Team {
  return {
    id,
    name: data.name,
    logo: data.logo,
    seasons: data.seasons || [],
    members: data.members || [],
    createdAt: data.createdAt instanceof Timestamp 
      ? data.createdAt.toDate().toISOString()
      : data.createdAt,
    updatedAt: data.updatedAt instanceof Timestamp 
      ? data.updatedAt.toDate().toISOString()
      : data.updatedAt,
  };
}
