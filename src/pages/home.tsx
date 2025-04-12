import Header from "../components/header";
import SelectDay from "../components/select-day";
import DailyTasks from "../components/daily-tasks";
import { useDailify } from "../components/dailifyContext";
import { CalendarView } from "../components/calendar-view";
// import { useEffect } from "react";
// import { useUser } from "@clerk/clerk-react";
// import { getTasksForMonth } from "@/functions/firebase";
// import { isSameMonth } from "date-fns";

export default function Home() {
    const { selectedDay, isCalendar } = useDailify()

    return (
        <main className="h-full flex flex-col gap-5 px-[clamp(1rem,5vw,24rem)] relative" id="main">
            <Header />

            {!isCalendar ? (
                <>
                    <SelectDay />
                    {selectedDay && (<DailyTasks />)}
                </>
            ) : (
                <CalendarView />
            )}

        </main>
    )
}