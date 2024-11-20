import { getAllSeasons } from "@/app/actions/seasons";
import { SeasonsPageContent } from "@/components/dashboard/seasons/SeasonsPageContent";

export default async function SeasonsPage() {
  const result = await getAllSeasons();

  if (!result.success) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          {result.error?.message || "Erreur lors du chargement des saisons"}
        </p>
      </div>
    );
  }

  return <SeasonsPageContent initialSeasons={result.seasons} />;
} 