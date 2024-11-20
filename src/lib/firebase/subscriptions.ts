import { collection, query, orderBy, onSnapshot, doc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Team, convertFirestoreDataToTeam } from "@/types/team";

export function subscribeToTeams(callback: (teams: Team[]) => void) {
  const teamsRef = collection(db, "teams");
  const teamsQuery = query(teamsRef, orderBy("createdAt", "desc"));
  
  return onSnapshot(teamsQuery, (snapshot) => {
    const teams = snapshot.docs.map((doc) =>
      convertFirestoreDataToTeam(doc.id, doc.data())
    );
    callback(teams);
  });
}

export function subscribeToTeam(teamId: string, callback: (team: Team | null) => void) {
  const teamRef = doc(db, "teams", teamId);
  
  return onSnapshot(teamRef, (snapshot) => {
    if (snapshot.exists()) {
      const team = convertFirestoreDataToTeam(snapshot.id, snapshot.data());
      callback(team);
    } else {
      callback(null);
    }
  });
} 