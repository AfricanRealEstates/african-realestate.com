"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DayPickerSingleProps } from "react-day-picker";

interface DatePickerProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  id?: string;
  minDate?: Date;
}

export function DatePicker({
  selected,
  onSelect,
  id,
  minDate,
}: DatePickerProps) {
  const handleSelect: DayPickerSingleProps["onSelect"] = (day) => {
    if (day && minDate && day < minDate) {
      return;
    }
    onSelect(day);
  };

  const isDateDisabled = (date: Date) => {
    return minDate ? date < minDate : false;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          initialFocus
          disabled={isDateDisabled}
        />
      </PopoverContent>
    </Popover>
  );
}
