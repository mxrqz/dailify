import { RepeatPickerProps } from "@/types/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import { weekDays } from "@/conts/conts";

export default function RepeatPicker({ onSelectedRepeat }: RepeatPickerProps) {
    const [repeat, setRepeat] = useState<string>("Off")
    const [selectedDays, setSelectedDays] = useState<string[]>()

    useEffect(() => {
        if (!repeat) return

        if (repeat === "Weekly") {
            const repeatDays = {
                [repeat]: selectedDays
            }
            onSelectedRepeat(repeatDays)
            return 
        }
        onSelectedRepeat(repeat)
    }, [repeat, selectedDays])

    return (
        <>
            <Select defaultValue="Off" onValueChange={setRepeat}>
                <SelectTrigger className="w-full">
                    <SelectValue id="repeat" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="Off">Não repetir</SelectItem>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
            </Select>

            <ToggleGroup type="multiple" variant="outline" className="w-full" disabled={repeat !== "Weekly"} onValueChange={setSelectedDays}>
                {weekDays.map((day, index) => (
                    <ToggleGroupItem key={index} value={day}>{day.slice(0, 1)}</ToggleGroupItem>
                ))}
            </ToggleGroup>
        </>
    )
}