
import { Button } from "@/components/ui/button";
import { IconFilter } from "@tabler/icons-react";


export default function ResultsPage() {
  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="w-full mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Match Results</h1>
          <Button variant="outline" className="gap-2">
            <IconFilter className="w-4 h-4" />
            Filter Results
          </Button>
        </div>

      </div>
    </main>
  );
} 