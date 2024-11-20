import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Team, convertFirestoreDataToTeam } from '@/types/team';

export function useTeam(teamId: string) {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const teamDoc = await getDoc(doc(db, 'teams', teamId));
        if (teamDoc.exists()) {
          setTeam(convertFirestoreDataToTeam(teamDoc.id, teamDoc.data()));
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    if (teamId) {
      fetchTeam();
    }
  }, [teamId]);

  return { team, loading, error };
} 