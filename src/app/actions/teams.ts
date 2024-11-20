'use server'

import { db } from "@/config/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  Timestamp,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { TeamFormData, TeamUpdateData, TeamMemberFormData, convertFirestoreDataToTeam } from "@/types/team";
import { uploadImage, deleteImage } from "@/lib/uploadImage";
import { ActionError, TeamActionError } from "@/types/errors";

interface CreateTeamData {
  name: string;
  logoUrl: string;
  seasons: string[];
}

export async function createTeam(data: CreateTeamData) {
  try {
    if (!data.name.trim()) {
      return { 
        success: false, 
        error: { 
          message: "Le nom de l'équipe est requis",
          code: 'unknown' as const
        }
      };
    }

    // Check if team exists
    const teamsRef = collection(db, "teams");
    const teamQuery = await getDocs(
      query(teamsRef, where("name", "==", data.name.trim()))
    );

    if (!teamQuery.empty) {
      return { 
        success: false, 
        error: {
          message: "Une équipe avec ce nom existe déjà",
          code: 'duplicate_name' as const
        }
      };
    }

    // Create the team document data
    const teamData = {
      name: data.name.trim(),
      logo: data.logoUrl,
      seasons: data.seasons || [],
      createdAt: serverTimestamp()
    };

    // Create the team document
    const docRef = await addDoc(teamsRef, teamData);

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating team:", error);
    return { 
      success: false, 
      error: {
        message: "Erreur lors de la création de l'équipe",
        code: 'unknown' as const
      }
    };
  }
}

export async function deleteTeam(teamId: string) {
  try {
    if (!teamId) {
      return { success: false, error: {
        message: "ID de l'équipe manquant",
        code: 'unknown' as const
      }};
    }

    const teamRef = doc(db, "teams", teamId);
    const teamDoc = await getDoc(teamRef);

    if (!teamDoc.exists()) {
      return { success: false, error: {
        message: "Équipe non trouvée",
        code: 'not_found' as const
      }};
    }

    const team = teamDoc.data();
    if (team?.seasons?.length > 0) {
      return { success: false, error: {
        message: "Cette équipe ne peut pas être supprimée car elle participe à une ou plusieurs saisons",
        code: 'team_in_use' as const
      }};
    }

    // Don't try to delete the logo when deleting team
    await deleteDoc(teamRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting team:", error);
    return { success: false, error: {
      message: "Erreur lors de la suppression de l'équipe",
      code: 'unknown' as const
    }};
  }
}

export async function updateTeam(teamId: string, data: TeamUpdateData) {
  try {
    if (!teamId) {
      return { success: false, error: {
        message: "ID de l'équipe manquant",
        code: 'unknown' as const
      }};
    }

    if (!data.name.trim()) {
      return { success: false, error: {
        message: "Le nom de l'équipe est requis",
        code: 'unknown' as const
      }};
    }

    const teamRef = doc(db, "teams", teamId);
    const teamDoc = await getDoc(teamRef);
    const currentTeam = teamDoc.data();

    const teamData: any = {
      name: data.name.trim(),
      seasons: data.seasons || [],
      updatedAt: serverTimestamp(),
    };

    // Handle logo update
    if (data.logoUrl !== undefined) {
      // Don't try to delete old logo, just update to new one
      teamData.logo = data.logoUrl;
    }

    await updateDoc(teamRef, teamData);
    return { success: true };
  } catch (error) {
    console.error("Error updating team:", error);
    return { 
      success: false, 
      error: {
        message: "Erreur lors de la mise à jour de l'équipe",
        code: 'unknown' as const
      }
    };
  }
}

export async function addTeamMember(teamId: string, data: TeamMemberFormData) {
  try {
    const teamRef = doc(db, "teams", teamId);
    const teamDoc = await getDoc(teamRef);

    if (!teamDoc.exists()) {
      return {
        success: false,
        error: {
          message: "Équipe non trouvée",
          code: "not_found" as const,
        },
      };
    }

    const team = teamDoc.data();
    const members = team.members || [];

    // Check if number or name is already taken
    if (members.some((m: any) => m.number === data.number)) {
      return {
        success: false,
        error: {
          message: "Ce numéro est déjà utilisé",
          code: "duplicate_number" as const,
        },
      };
    }

    if (members.some((m: any) => m.name.toLowerCase() === data.name.toLowerCase())) {
      return {
        success: false,
        error: {
          message: "Ce nom est déjà utilisé",
          code: "duplicate_name" as const,
        },
      };
    }

    const newMember = {
      id: crypto.randomUUID(),
      name: data.name,
      number: data.number,
      createdAt: new Date().toISOString(),
    };

    await updateDoc(teamRef, {
      members: [...members, newMember],
    });

    return { 
      success: true,
      error: undefined
    };
  } catch (error) {
    console.error("Error adding team member:", error);
    return {
      success: false,
      error: {
        message: "Erreur lors de l'ajout du joueur",
        code: "unknown" as const,
      },
    };
  }
}

export async function updateTeamMember(teamId: string, memberId: string, data: TeamMemberFormData) {
  try {
    const teamRef = doc(db, "teams", teamId);
    const teamDoc = await getDoc(teamRef);

    if (!teamDoc.exists()) {
      return {
        success: false,
        error: {
          message: "Équipe non trouvée",
          code: "not_found" as const,
        },
      };
    }

    const team = teamDoc.data();
    const members = team.members || [];
    const memberIndex = members.findIndex((m: any) => m.id === memberId);

    if (memberIndex === -1) {
      return {
        success: false,
        error: {
          message: "Joueur non trouvé",
          code: "not_found" as const,
        },
      };
    }

    // Check if number or name is already taken by other members
    if (members.some((m: any) => m.id !== memberId && m.number === data.number)) {
      return {
        success: false,
        error: {
          message: "Ce numéro est déjà utilisé",
          code: "duplicate_number" as const,
        },
      };
    }

    if (members.some((m: any) => m.id !== memberId && m.name.toLowerCase() === data.name.toLowerCase())) {
      return {
        success: false,
        error: {
          message: "Ce nom est déjà utilisé",
          code: "duplicate_name" as const,
        },
      };
    }

    const updatedMember = {
      ...members[memberIndex],
      name: data.name,
      number: data.number,
    };

    members[memberIndex] = updatedMember;

    await updateDoc(teamRef, { members });

    return { success: true };
  } catch (error) {
    console.error("Error updating team member:", error);
    return {
      success: false,
      error: {
        message: "Erreur lors de la mise à jour du joueur",
        code: "unknown" as const,
      },
    };
  }
}

export async function deleteTeamMember(teamId: string, memberId: string) {
  try {
    const teamRef = doc(db, "teams", teamId);
    const teamDoc = await getDoc(teamRef);

    if (!teamDoc.exists()) {
      return {
        success: false,
        error: {
          message: "Équipe non trouvée",
          code: "not_found" as const,
        },
      };
    }

    const team = teamDoc.data();
    const members = team.members || [];
    const updatedMembers = members.filter((m: any) => m.id !== memberId);

    await updateDoc(teamRef, { members: updatedMembers });

    return { success: true };
  } catch (error) {
    console.error("Error deleting team member:", error);
    return {
      success: false,
      error: {
        message: "Erreur lors de la suppression du joueur",
        code: "unknown" as const,
      },
    };
  }
}

export async function getTeam(teamId: string) {
  try {
    const teamDoc = await getDoc(doc(db, "teams", teamId));
    if (!teamDoc.exists()) {
      return {
        success: false,
        error: {
          message: "Équipe non trouvée",
          code: "not_found" as const,
        },
      };
    }

    const data = teamDoc.data();
    const members = (data.members || []).map((member: any) => ({
      ...member,
      createdAt: member.createdAt instanceof Timestamp 
        ? member.createdAt.toDate().toISOString()
        : member.createdAt,
    }));

    const team = {
      ...convertFirestoreDataToTeam(teamDoc.id, data),
      members,
    };

    return { 
      success: true, 
      team,
      error: undefined
    };
  } catch (error) {
    console.error("Error fetching team:", error);
    return {
      success: false,
      error: {
        message: "Erreur lors du chargement de l'équipe",
        code: "unknown" as const,
      },
    };
  }
}

export async function getTeams() {
  try {
    const teamsRef = collection(db, "teams");
    const querySnapshot = await getDocs(teamsRef);
    
    const teams = querySnapshot.docs.map(doc => 
      convertFirestoreDataToTeam(doc.id, doc.data())
    );

    return { success: true, teams };
  } catch (error) {
    console.error("Error fetching teams:", error);
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