export interface Column {
  key: string;
  label: string;
  align: "left" | "center" | "right";
  className?: string;
  formatter?: (value: any) => React.ReactNode;
}

export const standingsColumns: Column[] = [
  { key: "position", label: "Pos", align: "left", className: "w-12" },
  { key: "teamName", label: "Équipe", align: "left" },
  { key: "played", label: "MJ", align: "center" },
  { key: "won", label: "G", align: "center" },
  { key: "drawn", label: "N", align: "center" },
  { key: "lost", label: "P", align: "center" },
  { key: "goalsFor", label: "BP", align: "center" },
  { key: "goalsAgainst", label: "BC", align: "center" },
  { key: "goalDifference", label: "DB", align: "center" },
  { key: "points", label: "Pts", align: "center", className: "font-bold" },
];

export const scorersColumns: Column[] = [
  { key: "position", label: "Pos", align: "left", className: "w-12" },
  { key: "playerName", label: "Joueur", align: "left" },
  { key: "teamName", label: "Équipe", align: "left" },
  { key: "goals", label: "Buts", align: "center" },
];

export const assistersColumns: Column[] = [
  { key: "position", label: "Pos", align: "left", className: "w-12" },
  { key: "playerName", label: "Joueur", align: "left" },
  { key: "teamName", label: "Équipe", align: "left" },
  { key: "assists", label: "Passes D.", align: "center" },
];

export const teamsColumns: Column[] = [
  { key: "name", label: "Équipe", align: "left" },
  { 
    key: "membersCount", 
    label: "Joueurs", 
    align: "center",
    formatter: (value: number) => `${value} ${value > 1 ? "joueurs" : "joueur"}`
  },
  { key: "totalGoals", label: "Buts", align: "center" },
  { key: "totalAssists", label: "Passes D.", align: "center" },
]; 