import Header from "./header";
import SelectDay from "./select-day";
import DailyTasks from "./daily-tasks";
import { useDailify } from "./dailifyContext";
import { CalendarView } from "./calendar-view";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { getTasksForMonth } from "@/functions/firebase";
import { isSameMonth } from "date-fns";

export default function Home() {
    const { selectedDay, isCalendar, setTasks, setIsLoading, newTask, setCurrentMonth, currentMonth } = useDailify()
    const { user } = useUser()

    const getTasks = async () => {
        if (!user) return
        const tasks = await getTasksForMonth(user.id, selectedDay)
        setTasks(tasks)
        setIsLoading(false)
    }

    useEffect(() => {
        if (!currentMonth) {
            setCurrentMonth(selectedDay)
            getTasks()
        }

        if (currentMonth && !isSameMonth(currentMonth, selectedDay)) {
            setCurrentMonth(selectedDay)
            getTasks()
        }
    }, [selectedDay, newTask])

    return (
        <main className="h-full max-h-full overflow-hidden flex flex-col gap-5 py-5 px-[clamp(1rem,5vw,6rem)] relative" id="main">
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