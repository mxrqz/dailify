"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DatePickerProps } from "@/types/types"

export function DatePicker({ onSelectedDate, id, currentSelectedDate }: DatePickerProps) {
  const [date, setDate] = React.useState<Date>(currentSelectedDate)

  const handleDateChange = (selectedDate: Date | undefined) => {
    const hour = currentSelectedDate?.getHours()
    const minutes = currentSelectedDate?.getMinutes()

    if (!hour || minutes === null) return

    const newDate = selectedDate?.setHours(hour, minutes)
    if (!newDate) return
    setDate(new Date(newDate))
    onSelectedDate(new Date(newDate))
  }

  React.useEffect(() => {
    setDate(currentSelectedDate)
  }, [currentSelectedDate])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" id={id}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}