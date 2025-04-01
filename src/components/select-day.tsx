import { Calendar1Icon } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import { useDailify } from "./dailifyContext";
import { Calendar } from "./ui/calendar";
import NewTask from "./new-task";
import { TaskProps } from "@/types/types";
import { Timestamp } from "firebase/firestore";

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
    const { setSelectedDay, selectedDay, tasks, setIsCalendar, isCalendar } = useDailify()
    const [nextTask, setNextTask] = useState<TaskProps>()

    useEffect(() => {
        if (tasks) {
            const task = getNextTask(tasks, selectedDay)
            setNextTask(task)
        }
    }, [tasks])

    return (
        <section className={`flex flex-col gap-5 w-full`}>
            <div className="flex gap-5 w-full">
                <Calendar
                    mode="single"
                    className="border rounded-md"
                    classNames={{
                        month: 'flex flex-col gap-1',
                        row: "flex w-full mt-0",
                        caption: "flex justify-center pt-0 relative items-center w-full",
                    }}
                    selected={selectedDay}
                    onSelect={(e) => e && setSelectedDay(e)}
                />

                <div className="grid grid-rows-2 grid-cols-0 md:grid-rows-2 md:grid-cols-2 w-full h-full overflow-hidden gap-3">
                    <NewTask />

                    <Button
                        variant={"outline"}
                        size={"icon"}
                        id="calendar"
                        onClick={() => setIsCalendar(!isCalendar)}
                        className="w-full h-full"
                    >
                        <Calendar1Icon />
                    </Button>

                    <div className="hidden md:flex w-full h-full flex-col items-center gap-3 p-3 border rounded-md col-span-2">
                        <span className="text-2xl font-bold">Upcoming Task</span>

                        {nextTask && (
                            <div className="w-full h-full border border-primary rounded-md p-2 flex flex-col">
                                <span className="text-lg font-bold">{nextTask?.title}</span>
                                <span className="text-muted-foreground">{format((nextTask?.date as Timestamp).toDate(), "PPP")}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex md:hidden w-full h-full flex-col items-center gap-3 p-3 border rounded-md">
                <span className="text-2xl font-bold">Upcoming Task</span>

                {nextTask && (
                    <div className="w-full h-full border border-primary rounded-md p-2 flex flex-col">
                        <span className="text-lg font-bold">{nextTask?.title}</span>
                        <span className="text-muted-foreground">{format((nextTask?.date as Timestamp).toDate(), "PPP")}</span>
                    </div>
                )}
            </div>

            {/* <div className="w-full inline-flex gap-5 justify-center items-center">
                <Button variant={"outline"} size={"icon"} onClick={() => changeDay(-1)}>
                    <ArrowLeftIcon />
                </Button>

                <Button variant={"outline"} onClick={() => changeDay(0)}>
                    {formattedDate}
                </Button>

                <Button variant={"outline"} size={"icon"} onClick={() => changeDay(1)}>
                    <ArrowRightIcon />
                </Button>
            </div>

            <Button variant={"outline"} size={"icon"} id="calendar" onClick={() => setIsCalendar(!isCalendar)}>
                <Calendar1Icon />
            </Button> */}
        </section>
    )
}