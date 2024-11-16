import { Timestamp } from "firebase/firestore";

export interface TeamMember {
  id: string;
  name: string;
  number: number;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  seasons: string[];
  members: TeamMember[];
  createdAt: Date;
}

export interface TeamFirestore {
  name: string;
  logo: string;
  seasons: string[];
  members: TeamMember[];
  createdAt: Timestamp;
}

export interface TeamFormData {
  name: string;
  logo?: File | null;
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
  number: number;
}

export function convertFirestoreDataToTeam(id: string, data: any): Team {
  return {
    id,
    name: data.name,
    logo: data.logo,
    seasons: data.seasons || [],
    members: data.members || [],
    createdAt: data.createdAt.toDate(),
  };
}
