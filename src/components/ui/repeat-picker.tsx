import { RepeatPickerProps } from "@/types/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { useEffect, useState } from "react";

export default function RepeatPicker({ onSelectedRepeat }: RepeatPickerProps) {
    const [repeat, setRepeat] = useState<string>("Off")

    useEffect(() => {
        if (!repeat) return
        onSelectedRepeat(repeat)
    }, [repeat])
    
    return (
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
    )
}