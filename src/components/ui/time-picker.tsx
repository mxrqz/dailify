import { useEffect, useState } from "react";
import { TimePickerProps } from "@/types/types";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Timestamp } from "firebase/firestore";

export default function TimePicker({ onSelectedTime, selectedDate, task }: TimePickerProps) {
    const [hour, setHour] = useState<string>(() => {
        if (task) {
            const hour = task.date instanceof Timestamp ?
                task.date.toDate().getHours() > 12 ? String(task.date.toDate().getHours() - 12) : String(task.date.toDate().getHours())
                : task.date.getHours() > 12 ? String(task.date.getHours() - 12) : String(task.date.getHours())
            return hour
        }
        return "09"
    })
    const [minute, setMinute] = useState<string>(() => {
        if (task) {
            const minute = task.date instanceof Timestamp ?
                String(task.date.toDate().getMinutes())
                : String(task.date.getMinutes());
            return minute
        }
        return "00"
    })
    const [time, setTime] = useState<string>(() => {
        if (task) {
            const time = task.date instanceof Timestamp ?
                (task.date as Timestamp).toDate().getHours() > 12 ? "pm" : "am"
                : task.date.getHours() > 12 ? "pm" : "am";
            return time
        }
        return "am"
    })

    useEffect(() => {
        if (!hour || !minute || !time || !selectedDate) return
        const hourNumber = time === "am" ? Number(hour) : (Number(hour) === 12 ? Number(hour) : Number(hour) + 12)
        const minuteNumber = Number(minute)
        const addTime = selectedDate.setHours(hourNumber, minuteNumber, 0)
        const finalDate = new Date(addTime)
        onSelectedTime(finalDate)
    }, [hour, minute, time])

    return (
        <div className="flex gap-2 w-full" id="time">
            <Select defaultValue={hour.padStart(2, "0") || "09"} onValueChange={setHour}>
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

            <Select defaultValue={minute.padStart(2, "0") || "00"} onValueChange={setMinute}>
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

            <ToggleGroup type="single" className="flex flex-col border w-full" onValueChange={setTime} defaultValue={time || "am"}>
                <ToggleGroupItem value="am" className="text-xs font-semibold first:rounded-l-none">AM</ToggleGroupItem>
                <ToggleGroupItem value="pm" className="text-xs font-semibold border-t rounded-none last:rounded-r-none">PM</ToggleGroupItem>
            </ToggleGroup>
        </div>
    )
}