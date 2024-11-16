"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { IconCalendar, IconClock } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateTimePickerProps {
  date?: Date;
  setDate: (date: Date) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);
  const [selectedHour, setSelectedHour] = React.useState<string>(
    date ? format(date, "HH") : "12"
  );
  const [selectedMinute, setSelectedMinute] = React.useState<string>(
    date ? format(date, "mm") : "00"
  );

  // Update parent state when any selection changes
  React.useEffect(() => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(selectedHour), parseInt(selectedMinute));
      setDate(newDate);
    }
  }, [selectedDate, selectedHour, selectedMinute, setDate]);

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <IconCalendar className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "d MMMM yyyy", { locale: fr })
            ) : (
              <span>Sélectionnez une date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-2">
        <IconClock className="h-4 w-4 text-muted-foreground" />
        <Select
          value={selectedHour}
          onValueChange={setSelectedHour}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder="Heure" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
              <SelectItem
                key={hour}
                value={hour.toString().padStart(2, "0")}
              >
                {hour.toString().padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>:</span>
        <Select
          value={selectedMinute}
          onValueChange={setSelectedMinute}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder="Minute" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
              <SelectItem
                key={minute}
                value={minute.toString().padStart(2, "0")}
              >
                {minute.toString().padStart(2, "0")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 