"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Team } from "@/types/team";

interface Column {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  className?: string;
  formatter?: (value: any) => React.ReactNode;
}

interface StatsTableProps {
  columns: Column[];
  data: any[];
  teams?: Team[];
  highlightTopThree?: boolean;
}

export function StatsTable({ columns, data, teams, highlightTopThree = false }: StatsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={column.align === "center" ? "text-center" : undefined}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={row.id || index}
              className={highlightTopThree && index < 3 ? "font-medium" : undefined}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  className={`${column.align === "center" ? "text-center" : ""} 
                    ${column.className || ""} 
                    ${highlightTopThree && index < 3 && column.key === "position" ? "text-primary" : ""}`}
                >
                  {column.formatter
                    ? column.formatter(row[column.key])
                    : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 