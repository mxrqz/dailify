import { motion } from "framer-motion";
import NewTask from "./new-task";
import { paletteColors, weekDays } from "@/conts/conts";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Calendar1Icon, ChevronLeft, ChevronRight, Loader2Icon } from "lucide-react";
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameMonth, isSameYear, isToday, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useDailify } from "./dailifyContext";
import { Timestamp } from "firebase/firestore";

export function CalendarView() {
  const { selectedDay, setSelectedDay, isCalendar, setIsCalendar, tasks, isLoading, setIsLoading } = useDailify()

  const goToPreviousMonth = () => {
    setIsLoading(true)
    setSelectedDay(subMonths(selectedDay, 1))
  }

  const goToNextMonth = () => {
    setIsLoading(true)
    setSelectedDay(addMonths(selectedDay, 1))
  }

  const goToToday = () => {
    setIsLoading(true)
    setSelectedDay(new Date())
  }

  const generateCalendarDays = () => {
    const monthStart = startOfMonth(selectedDay)
    const monthEnd = endOfMonth(selectedDay)
    const calendarStart = startOfWeek(monthStart, { locale: ptBR })
    const calendarEnd = endOfWeek(monthEnd, { locale: ptBR })

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }

  const calendarDays = generateCalendarDays()

  return (

    <motion.ul className="w-full h-full flex flex-col gap-3"
      key="box"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex w-full justify-between">
        <div className="flex gap-5">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft />
          </Button>

          <Button variant="outline" className="min-w-[100px]" onClick={goToToday}>
            {format(selectedDay, "MMMM")}{!isSameYear(selectedDay, new Date()) && ` - ${String(selectedDay.getFullYear()).slice(2, 4)}`}
          </Button>

          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight />
          </Button>
        </div>

        <div className="flex items-center gap-5">
          <NewTask />

          <Button variant={"outline"} size={"icon"} id="calendar" onClick={() => setIsCalendar(!isCalendar)}>
            <Calendar1Icon />
          </Button>
        </div>
      </div>

      <Separator />

      <ul className="grid grid-cols-7 w-full items-center justify-items-center">
        {weekDays.map((day, index) => (
          <li key={index} className="font-semibold text-muted-foreground">{day.slice(0, 3).toUpperCase()}</li>
        ))}
      </ul>

      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader2Icon className="size-12 animate-spin" />
        </div>
      ) : (
        <ul className="grid grid-cols-7 grid-rows-6 gap-1 w-full justify-items-center h-full">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, selectedDay)
            const isCurrentDay = isToday(day)

            return (
              <li key={index}
                className={`border w-full rounded-md p-2 flex flex-col
                  ${isCurrentMonth ? "bg-background" : "bg-muted"}
                  ${isCurrentDay && " border-2 border-foreground"}
                  hover:border-primary/50 cursor-pointer`}
              >
                <span className={`text-base font-semibold text-foreground ${!isCurrentMonth && "text-muted-foreground"} ${isCurrentDay && "text-primary font-bold"}`}>
                  {format(day, "d")}
                </span>

                <ul className="flex flex-col w-full gap-1">
                  {isCurrentMonth && (
                    tasks
                      ?.filter(task => (task.date as Timestamp).toDate().getDate() === day.getDate())
                      .slice(0, 3)
                      .map((task, index) => (
                        <li key={index} className={`w-full text-xs flex items-center gap-1 border rounded-md px-1`}>
                          <div className={`size-2 rounded-full shrink-0 ${paletteColors[index]}`} />
                          <span className="truncate">{task.title}</span>
                        </li>
                      ))
                  )}

                </ul>
              </li>)
          })}
        </ul>
      )}
    </motion.ul>
  )
}