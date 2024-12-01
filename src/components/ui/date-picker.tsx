"use client";

import * as React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DayPicker } from "react-day-picker";

interface DatePickerProps {
  date?: Date;
  onChange: (date?: Date) => void;
}

export function DatePicker({ date, onChange }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "d MMMM yyyy", { locale: fr }) : <span>Sélectionner une date</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 w-auto [&>button]:hidden">
        <div className="flex justify-end p-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </Button>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            onChange(newDate);
            setOpen(false);
          }}
          locale={fr}
          className="rounded-md"
          ISOWeek
          formatters={{ 
            formatCaption: (date: Date, options) => {
              return (
                <div className="flex items-center justify-center text-sm font-medium">
                  {format(date, "MMMM yyyy", { locale: fr })}
                </div>
              );
            },
            formatWeekdayName: (date: Date) => format(date, "EEEEE", { locale: fr }).toLowerCase()
          }}
          classNames={{
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground cursor-pointer",
            day_today: "bg-accent text-accent-foreground",
            head_cell: "text-muted-foreground font-normal text-[0.8rem] w-9",
            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            caption: "relative h-10 flex items-center justify-center text-sm font-medium px-8",
            caption_label: "text-sm font-medium",
            caption_dropdowns: "flex justify-center gap-1",
            vhidden: "hidden",
          }}
        />
      </DialogContent>
    </Dialog>
  );
} 