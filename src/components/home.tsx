import Header from "./header";
import SelectDay from "./select-day";
import DailyTasks from "./daily-tasks";
import { useDailify } from "./dailifyContext";
import { CalendarView } from "./calendar-view";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { getTasksForMonth } from "@/functions/firebase";

export default function Home() {
    const { selectedDay, isCalendar, setTasks, setIsLoading, newTask } = useDailify()
    const { user } = useUser()

    const getTasks = async () => {
        if (!user) return
        const tasks = await getTasksForMonth(user.id, selectedDay)
        setTasks(tasks)
        setIsLoading(false)
    }

    useEffect(() => {
        getTasks()
    }, [selectedDay, newTask])
    // const [selectedDay, setSelectedDay] = useState<Date>(new Date())
    // const [calendarPosition, setCalendarPosition] = useState<{ top: string, left: string, width: string, height: string }>()



    // useEffect(() => {
    //     const calendar = document.getElementById("calendar")
    //     const calendarPopup = document.getElementById("calendar-popup")

    //     if (calendar && calendarPopup) {
    //         const rect = calendar.getBoundingClientRect();
    //         setCalendarPosition({ top: `${rect.top}px`, left: `${rect.left}px`, width: `${rect.width}px`, height: `${rect.height}px` })
    //     }
    // }, [])

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