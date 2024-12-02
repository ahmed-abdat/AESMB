import { StatsTable } from "@/components/ui/stats-table";
import { Team } from "@/types/team";
import { Card, CardContent } from "@/components/ui/card";
import { PlayerSearch } from "@/components/PlayerSearch";

interface StatsHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

interface StatsSectionProps {
  header?: StatsHeaderProps;
  data: any[];
  columns: any[];
  teams: Team[];
  showSearch?: boolean;
  searchStatKey?: string;
  searchStatLabel?: string;
  highlightTopThree?: boolean;
}

export function StatsSection({
  header,
  data,
  columns,
  teams,
  showSearch = false,
  searchStatKey,
  searchStatLabel,
  highlightTopThree = false,
}: StatsSectionProps) {
  return (
    <div className="space-y-6">
      {header && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            {header.icon}
            <h2 className="text-lg md:text-2xl">{header.title}</h2>
          </div>
          {header.subtitle && (
            <span className="text-sm md:text-base text-muted-foreground">
              {header.subtitle}
            </span>
          )}
        </div>
      )}

      {showSearch && searchStatKey && searchStatLabel ? (
        <PlayerSearch
          players={data}
          teams={teams}
          statKey={searchStatKey}
          statLabel={searchStatLabel}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <StatsTable
              columns={columns}
              data={data}
              teams={teams}
              highlightTopThree={highlightTopThree}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
} 