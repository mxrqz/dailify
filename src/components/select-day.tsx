import { Calendar1Icon } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import { useDailify } from "./dailifyContext";
import NewTask from "./new-task";
import { TaskProps } from "@/types/types";
import { Timestamp } from "firebase/firestore";
import Calendar2 from "./ui/calendar2";

// function getNextTask(tasks: TaskProps[], selectedDay: Date): TaskProps | undefined {
//     const todayTasks = tasks
//         .filter(task => {
//             const taskDate = (task.date as Timestamp).toDate();
//             return taskDate.toDateString() === selectedDay.toDateString();
//         })
//         .sort((a, b) => {
//             const aDate = (a.date as Timestamp).toDate().getTime();
//             const bDate = (b.date as Timestamp).toDate().getTime();
//             return aDate - bDate;
//         });

//     const now = new Date();

//     const nextTask = todayTasks.find(task => {
//         const taskTime = (task.date as Timestamp).toDate().getTime();
//         return taskTime > now.getTime()
//     })

//     return nextTask
// }

function getNextTask(tasks: TaskProps[], selectedDay: Date) {
    const now = new Date()
    const todayTasks = tasks?.filter(task => (task.date as Timestamp).toDate().getDate() === selectedDay.getDate())

    const nextTask = todayTasks.find(task => {
        const taskTime = format((task.date as Timestamp).toDate(), "hhmm");
        return Number(taskTime) > Number(format(now, 'hhmm'))
    })

    return nextTask
}

export default function SelectDay() {
    const {selectedDay, tasks, setIsCalendar, isCalendar } = useDailify()
    const [nextTask, setNextTask] = useState<TaskProps>()

    useEffect(() => {
        if (tasks) {
            const task = getNextTask(tasks, selectedDay)
            setNextTask(task)
        }
    }, [tasks])

    return (
        <section className='flex flex-col md:flex-row gap-5 w-full'>
            <Calendar2 />

            <div className="flex flex-col w-full gap-3">
                <div className="flex w-full gap-3 h-full">
                    <NewTask className="w-full shrink md:h-full border cursor-pointer" />

                    <Button
                        size={"icon"}
                        id="calendar"
                        onClick={() => setIsCalendar(!isCalendar)}
                        className="w-full shrink md:h-full bg-background border text-foreground hover:bg-background/5 cursor-pointer"
                    >
                        <Calendar1Icon />
                    </Button>
                </div>

                <div className="bg-background w-full flex flex-col justify-between items-center gap-3 p-3 border rounded-md h-full">
                    <span className="text-2xl font-bold">Upcoming Task</span>

                    {nextTask && (
                        <div className="w-full border border-primary rounded-md p-2 flex flex-col">
                            <span className="text-lg font-bold">{nextTask?.title}</span>
                            <span className="text-muted-foreground">{format((nextTask?.date as Timestamp).toDate(), "PPP")}</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}