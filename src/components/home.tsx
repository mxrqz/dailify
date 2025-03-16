import { useState } from "react";
import Header from "./header";
import SelectDay from "./select-day";
import DailyTasks from "./daily-tasks";

export default function Home() {
    const [selectedDay, setSelectedDay] = useState<Date>(new Date())
    
    return (
        <main className="h-full flex flex-col gap-5 py-5 px-[clamp(1rem,5vw,6rem)]">
            <Header />

            <SelectDay onSelectedDay={setSelectedDay} />

            {selectedDay && (
                <DailyTasks day={selectedDay} />
            )}
        </main>
    )
}