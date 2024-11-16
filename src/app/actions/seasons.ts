'use server'

import { db } from "@/config/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  Timestamp,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
  getDoc
} from "firebase/firestore";
import { SeasonFormData, SeasonFirestore, DEFAULT_POINTS_SYSTEM } from "@/types/season";
import { isAfter, isBefore, startOfToday } from "date-fns";
import { Team } from "@/types/team";
import { convertFirestoreDataToTeam } from "@/types/team";

export async function createSeason(data: SeasonFormData) {
  try {
    // Create the season document data
    const seasonData: Omit<SeasonFirestore, 'createdAt'> = {
      name: data.name,
      startDate: Timestamp.fromDate(new Date(data.startDate)),
      endDate: Timestamp.fromDate(new Date(data.endDate)),
      status: isBefore(startOfToday(), new Date(data.startDate)) 
        ? "upcoming" 
        : isAfter(startOfToday(), new Date(data.endDate)) 
          ? "completed" 
          : "ongoing",
      pointsSystem: DEFAULT_POINTS_SYSTEM,
      teams: [],
      rounds: [],
    };

    // Check if season exists
    const seasonsRef = collection(db, "seasons");
    const seasonQuery = await getDocs(
      query(seasonsRef, where("name", "==", data.name))
    );

    if (!seasonQuery.empty) {
      throw new Error("Une saison avec ce nom existe déjà");
    }

    // Create the season document
    const docRef = await addDoc(collection(db, "seasons"), {
      ...seasonData,
      createdAt: serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating season:", error);
    throw error;
  }
}

export async function deleteSeason(seasonId: string) {
  try {
    const seasonRef = doc(db, "seasons", seasonId);
    await deleteDoc(seasonRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting season:", error);
    throw error;
  }
}

export async function updateSeason(seasonId: string, data: SeasonFormData) {
  try {
    const seasonRef = doc(db, "seasons", seasonId);

    // Check if another season exists with the same name
    const seasonsRef = collection(db, "seasons");
    const seasonQuery = await getDocs(
      query(
        seasonsRef, 
        where("name", "==", data.name),
        where("__name__", "!=", seasonId)
      )
    );

    if (!seasonQuery.empty) {
      throw new Error("Une saison avec ce nom existe déjà");
    }

    // Calculate status based on new dates
    const today = startOfToday();
    let status: SeasonFirestore['status'] = "upcoming";

    if (isBefore(today, new Date(data.startDate))) {
      status = "upcoming";
    } else if (isAfter(today, new Date(data.endDate))) {
      status = "completed";
    } else {
      status = "ongoing";
    }

    const seasonData = {
      name: data.name,
      startDate: Timestamp.fromDate(new Date(data.startDate)),
      endDate: Timestamp.fromDate(new Date(data.endDate)),
      status,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(seasonRef, seasonData);

    return { success: true };
  } catch (error) {
    console.error("Error updating season:", error);
    throw error;
  }
}

export async function getSeasonTeams(seasonId: string) {
  try {
    const teamsRef = collection(db, "teams");
    const teamsQuery = query(
      teamsRef,
      where("seasons", "array-contains", seasonId)
    );
    const querySnapshot = await getDocs(teamsQuery);

    const teams = querySnapshot.docs.map((doc) =>
      convertFirestoreDataToTeam(doc.id, doc.data())
    );

    return { success: true, teams };
  } catch (error) {
    console.error("Error fetching season teams:", error);
    return {
      success: false,
      error: {
        message: "Erreur lors du chargement des équipes",
        code: "unknown" as const,
      },
      teams: []
    };
  }
}

export async function addRound(seasonId: string, roundNumber: number) {
  try {
    const seasonRef = doc(db, "seasons", seasonId);
    const seasonDoc = await getDoc(seasonRef);

    if (!seasonDoc.exists()) {
      return {
        success: false,
        error: {
          message: "Saison non trouvée",
          code: "not_found" as const,
        },
      };
    }

    const season = seasonDoc.data();
    const rounds = season.rounds || [];

    // Check if round number already exists
    if (rounds.some((r: any) => r.number === roundNumber)) {
      return {
        success: false,
        error: {
          message: "Une journée avec ce numéro existe déjà",
          code: "duplicate_number" as const,
        },
      };
    }

    const newRound = {
      id: crypto.randomUUID(),
      number: roundNumber,
      matches: [],
    };

    await updateDoc(seasonRef, {
      rounds: [...rounds, newRound],
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding round:", error);
    return {
      success: false,
      error: {
        message: "Erreur lors de l'ajout de la journée",
        code: "unknown" as const,
      },
    };
  }
}

interface AddMatchData {
  homeTeamId: string;
  awayTeamId: string;
  date: Date;
}

export async function addMatch(seasonId: string, roundId: string, data: AddMatchData) {
  try {
    const seasonRef = doc(db, "seasons", seasonId);
    const seasonDoc = await getDoc(seasonRef);

    if (!seasonDoc.exists()) {
      return {
        success: false,
        error: {
          message: "Saison non trouvée",
          code: "not_found" as const,
        },
      };
    }

    const season = seasonDoc.data();
    const rounds = season.rounds || [];
    const roundIndex = rounds.findIndex((r: any) => r.id === roundId);

    if (roundIndex === -1) {
      return {
        success: false,
        error: {
          message: "Journée non trouvée",
          code: "not_found" as const,
        },
      };
    }

    // Check if teams are different
    if (data.homeTeamId === data.awayTeamId) {
      return {
        success: false,
        error: {
          message: "Les équipes doivent être différentes",
          code: "invalid_teams" as const,
        },
      };
    }

    // Get participating teams
    const teamsRef = collection(db, "teams");
    const teamsQuery = query(
      teamsRef,
      where("seasons", "array-contains", seasonId)
    );
    const teamsSnapshot = await getDocs(teamsQuery);
    const participatingTeamIds = teamsSnapshot.docs.map(doc => doc.id);

    // Check if teams are in the season
    if (!participatingTeamIds.includes(data.homeTeamId) || !participatingTeamIds.includes(data.awayTeamId)) {
      return {
        success: false,
        error: {
          message: "Les équipes sélectionnées ne participent pas à cette saison",
          code: "invalid_teams" as const,
        },
      };
    }

    const newMatch = {
      id: crypto.randomUUID(),
      homeTeamId: data.homeTeamId,
      awayTeamId: data.awayTeamId,
      homeScore: null,
      awayScore: null,
      date: data.date.toISOString(),
      status: 'scheduled' as const,
    };

    rounds[roundIndex].matches.push(newMatch);

    await updateDoc(seasonRef, { rounds });

    return { success: true };
  } catch (error) {
    console.error("Error adding match:", error);
    return {
      success: false,
      error: {
        message: "Erreur lors de l'ajout du match",
        code: "unknown" as const,
      },
    };
  }
} 

interface UpdateMatchData {
  homeTeamId: string;
  awayTeamId: string;
  date: Date;
}

export async function updateMatch(seasonId: string, roundId: string, matchId: string, data: UpdateMatchData) {
  try {
    const seasonRef = doc(db, "seasons", seasonId);
    const seasonDoc = await getDoc(seasonRef);

    if (!seasonDoc.exists()) {
      return {
        success: false,
        error: {
          message: "Saison non trouvée",
          code: "not_found" as const,
        },
      };
    }

    const season = seasonDoc.data();
    const rounds = season.rounds || [];
    const roundIndex = rounds.findIndex((r: any) => r.id === roundId);
    const matchIndex = rounds[roundIndex].matches.findIndex((m: any) => m.id === matchId);

    if (roundIndex === -1 || matchIndex === -1) {
      return {
        success: false,
        error: {
          message: "Match non trouvé",
          code: "not_found" as const,
        },
      };
    }

    // Check if teams are different
    if (data.homeTeamId === data.awayTeamId) {
      return {
        success: false,
        error: {
          message: "Les équipes doivent être différentes",
          code: "invalid_teams" as const,
        },
      };
    }

    // Get participating teams
    const teamsRef = collection(db, "teams");
    const teamsQuery = query(
      teamsRef,
      where("seasons", "array-contains", seasonId)
    );
    const teamsSnapshot = await getDocs(teamsQuery);
    const participatingTeamIds = teamsSnapshot.docs.map(doc => doc.id);

    // Check if teams are in the season
    if (!participatingTeamIds.includes(data.homeTeamId) || !participatingTeamIds.includes(data.awayTeamId)) {
      return {
        success: false,
        error: {
          message: "Les équipes sélectionnées ne participent pas à cette saison",
          code: "invalid_teams" as const,
        },
      };
    }

    const updatedMatch = {
      ...rounds[roundIndex].matches[matchIndex],
      homeTeamId: data.homeTeamId,
      awayTeamId: data.awayTeamId,
      date: data.date.toISOString(),
    };

    rounds[roundIndex].matches[matchIndex] = updatedMatch;

    await updateDoc(seasonRef, { rounds });

    return { success: true };
  } catch (error) {
    console.error("Error updating match:", error);
    return {
      success: false,
      error: {
        message: "Erreur lors de la mise à jour du match",
        code: "unknown" as const,
      },
    };
  }
}

export async function deleteMatch(seasonId: string, roundId: string, matchId: string) {
  try {
    const seasonRef = doc(db, "seasons", seasonId);
    const seasonDoc = await getDoc(seasonRef);

    if (!seasonDoc.exists()) {
      return {
        success: false,
        error: {
          message: "Saison non trouvée",
          code: "not_found" as const,
        },
      };
    }

    const season = seasonDoc.data();
    const rounds = season.rounds || [];
    const roundIndex = rounds.findIndex((r: any) => r.id === roundId);

    if (roundIndex === -1) {
      return {
        success: false,
        error: {
          message: "Journée non trouvée",
          code: "not_found" as const,
        },
      };
    }

    // Filter out the match to delete
    rounds[roundIndex].matches = rounds[roundIndex].matches.filter(
      (m: any) => m.id !== matchId
    );

    await updateDoc(seasonRef, { rounds });

    return { success: true };
  } catch (error) {
    console.error("Error deleting match:", error);
    return {
      success: false,
      error: {
        message: "Erreur lors de la suppression du match",
        code: "unknown" as const,
      },
    };
  }
}

export async function deleteRound(seasonId: string, roundId: string) {
  try {
    const seasonRef = doc(db, "seasons", seasonId);
    const seasonDoc = await getDoc(seasonRef);

    if (!seasonDoc.exists()) {
      return {
        success: false,
        error: {
          message: "Saison non trouvée",
          code: "not_found" as const,
        },
      };
    }

    const season = seasonDoc.data();
    const rounds = season.rounds || [];
    
    // Filter out the round to delete (this will also remove all its matches)
    const updatedRounds = rounds.filter((r: any) => r.id !== roundId);

    await updateDoc(seasonRef, { rounds: updatedRounds });

    return { success: true };
  } catch (error) {
    console.error("Error deleting round:", error);
    return {
      success: false,
      error: {
        message: "Erreur lors de la suppression de la journée",
        code: "unknown" as const,
      },
    };
  }
}

interface UpdateMatchResultData {
  homeScore: number;
  awayScore: number;
  stats: {
    homeTeam: {
      possession: number;
      shots: number;
      shotsOnTarget: number;
      corners: number;
      fouls: number;
    };
    awayTeam: {
      possession: number;
      shots: number;
      shotsOnTarget: number;
      corners: number;
      fouls: number;
    };
  };
  status: 'completed';
}

export async function updateMatchResult(
  seasonId: string, 
  roundId: string, 
  matchId: string, 
  data: UpdateMatchResultData
) {
  try {
    const seasonRef = doc(db, "seasons", seasonId);
    const seasonDoc = await getDoc(seasonRef);

    if (!seasonDoc.exists()) {
      return {
        success: false,
        error: {
          message: "Saison non trouvée",
          code: "not_found" as const,
        },
      };
    }

    const season = seasonDoc.data();
    const rounds = season.rounds || [];
    const roundIndex = rounds.findIndex((r: any) => r.id === roundId);
    const matchIndex = rounds[roundIndex].matches.findIndex((m: any) => m.id === matchId);

    if (roundIndex === -1 || matchIndex === -1) {
      return {
        success: false,
        error: {
          message: "Match non trouvé",
          code: "not_found" as const,
        },
      };
    }

    // Update match result
    const updatedMatch = {
      ...rounds[roundIndex].matches[matchIndex],
      result: {
        homeScore: data.homeScore,
        awayScore: data.awayScore,
        stats: data.stats,
        status: data.status,
      },
    };

    rounds[roundIndex].matches[matchIndex] = updatedMatch;

    await updateDoc(seasonRef, { rounds });

    return { success: true };
  } catch (error) {
    console.error("Error updating match result:", error);
    return {
      success: false,
      error: {
        message: "Erreur lors de la mise à jour du résultat",
        code: "unknown" as const,
      },
    };
  }
}

export async function resetMatchResult(seasonId: string, roundId: string, matchId: string) {
  try {
    const seasonRef = doc(db, "seasons", seasonId);
    const seasonDoc = await getDoc(seasonRef);

    if (!seasonDoc.exists()) {
      return {
        success: false,
        error: {
          message: "Saison non trouvée",
          code: "not_found" as const,
        },
      };
    }

    const season = seasonDoc.data();
    const rounds = season.rounds || [];
    const roundIndex = rounds.findIndex((r: any) => r.id === roundId);
    const matchIndex = rounds[roundIndex].matches.findIndex((m: any) => m.id === matchId);

    if (roundIndex === -1 || matchIndex === -1) {
      return {
        success: false,
        error: {
          message: "Match non trouvé",
          code: "not_found" as const,
        },
      };
    }

    // Reset match result by removing the result property
    const { result, ...matchWithoutResult } = rounds[roundIndex].matches[matchIndex];
    rounds[roundIndex].matches[matchIndex] = matchWithoutResult;

    await updateDoc(seasonRef, { rounds });

    return { success: true };
  } catch (error) {
    console.error("Error resetting match result:", error);
    return {
      success: false,
      error: {
        message: "Erreur lors de la réinitialisation du résultat",
        code: "unknown" as const,
      },
    };
  }
} 