import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { DurationPickerProps } from "@/types/types";

export default function DurationPicker({onSelectedDuration}: DurationPickerProps) {
    const [durationHour, setDurationHour] = useState<string>("")
    const [durationMinute, setDurationMinute] = useState<string>("")

    useEffect(() => {
        if (!durationHour && !durationMinute) return
        const duration = `${durationHour && durationHour !== '0' ? durationHour + "h" : ''}${durationMinute && durationMinute !== "00" ? durationMinute + "m" : ""}`
        onSelectedDuration(duration)
    }, [durationHour, durationMinute])

    return (
        <div className="flex gap-3" id="duration">
            <Select onValueChange={setDurationHour}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="hour" />
                </SelectTrigger>

                <SelectContent position="item-aligned">
                    {Array.from({ length: 13 }).map((_, index) => (
                        <SelectItem key={index} value={(index).toString()}>
                            {index} {index <= 1 ? "hour" : "hours"}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select onValueChange={setDurationMinute}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="minute" />
                </SelectTrigger>

                <SelectContent position="item-aligned">
                    {["00", "10", "20", "30", "40", "50"].map((value, index) => (
                        <SelectItem key={value} value={(value).toString()}>
                            {value} {index === 0 ? "minute" : "minutes"}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}