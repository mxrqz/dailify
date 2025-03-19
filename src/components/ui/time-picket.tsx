import { TimePickerProps } from "@/types/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import { useEffect, useState } from "react";

export default function TimePicker({ onSelectedTime, selectedDate }: TimePickerProps) {
    const [hour, setHour] = useState<string>("09")
    const [minute, setMinute] = useState<string>("00")
    const [time, setTime] = useState<string>("am")

    useEffect(() => {
        if (!hour || !minute || !time || !selectedDate) return
        const hourNumber = time === "am" ? Number(hour) : Number(hour) + 12
        const minuteNumber = Number(minute)
        const addTime = selectedDate.setHours(hourNumber, minuteNumber, 0)
        const finalDate = new Date(addTime)
        onSelectedTime(finalDate)
    }, [hour, minute, time])

    return (
        <div className="flex gap-2 w-full" id="time">
            <Select defaultValue="09" onValueChange={setHour}>
                <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Hour" />
                </SelectTrigger>

                <SelectContent position="item-aligned">
                    {Array.from({ length: 12 }, (_, i) => {
                        const index = time === "am" ? i : i + 1
                        return (
                            <SelectItem key={index} value={index.toString().padStart(2, "0")}>
                                {index.toString().padStart(2, "0")}
                            </SelectItem>
                        )
                    })}
                </SelectContent>
            </Select>

            <Select defaultValue="00" onValueChange={setMinute}>
                <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Min" />
                </SelectTrigger>

                <SelectContent position="item-aligned">
                    {Array.from({ length: 60 }).map((_, index) => (
                        <SelectItem key={index} value={String(index).padStart(2, "0")}>
                            {String(index).padStart(2, "0")}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <ToggleGroup type="single" className="flex flex-col border w-full" onValueChange={setTime} defaultValue="am">
                <ToggleGroupItem value="am" className="text-xs font-semibold first:rounded-l-none">AM</ToggleGroupItem>
                <ToggleGroupItem value="pm" className="text-xs font-semibold border-t rounded-none last:rounded-r-none">PM</ToggleGroupItem>
            </ToggleGroup>
        </div>
    )
}