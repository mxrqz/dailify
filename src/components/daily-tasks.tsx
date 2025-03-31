import { TaskProps } from "@/types/types";
import { ClockIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

import { motion } from 'framer-motion';
import { priorityTextColor, priorityBgColor, priorityBorderColor, priorityText, tagsBgColors2, variants, childVariants } from "@/conts/conts";
import { Timestamp } from "firebase/firestore";
import { getTime } from "@/functions/functions";
import { format } from "date-fns";
import { useDailify } from "./dailifyContext";

import { EditTask, EditTaskContent, EditTaskTrigger } from "./edit-task";

export default function DailyTasks() {
    const { selectedDay, newTask, tasks, isCalendar } = useDailify()
    const [dayTasks, setDayTasks] = useState<TaskProps[]>()

    useEffect(() => {
        if (!newTask) return

        const taskDate = format((newTask.date as Date), 'PPP')
        const currentSelectedDay = format(selectedDay, 'PPP')

        if (taskDate === currentSelectedDay) {
            setDayTasks((prev) => {
                if (!prev) return [newTask];
                const existingTaskIndex = prev.findIndex(task => task.id === newTask.id);
                if (existingTaskIndex !== -1) {
                    const updatedTasks = [...prev];
                    updatedTasks[existingTaskIndex] = newTask;
                    return updatedTasks;
                }

                return [...prev, newTask];
            });
        }
    }, [newTask])

    useEffect(() => {
        if (!tasks) return
        const todayTasks = tasks?.filter(task => (task.date as Timestamp).toDate().getDate() === selectedDay.getDate())
        setDayTasks(todayTasks)
    }, [tasks, selectedDay, isCalendar])

    // function isAfterTime(time: Timestamp | Date): boolean {
    //     const { hours, minutes } = getTime(time, "{hours, minutes}")
    //     const now = new Date();
    //     const nowMinutes = now.getHours() * 60 + now.getMinutes();
    //     const targetMinutes = hours * 60 + minutes;

    //     return nowMinutes > targetMinutes;
    // }

    if (!dayTasks) return

    const groupedTasks = Object.values(
        dayTasks.reduce((acc, task) => {
            const time = getTime(task.date, "HH:MM")

            if (!acc[time]) {
                acc[time] = { time: time, tasks: [] };
            }
            acc[time].tasks.push(task);
            return acc;
        }, {} as Record<string, { time: string; tasks: typeof dayTasks }>)
    ).sort((a, b) => {
        const timeA = a.time.split(":").map(Number);
        const timeB = b.time.split(":").map(Number);
        return timeA[0] - timeB[0] || timeA[1] - timeB[1];
    });

    return (

        // <section className="w-full h-full max-h-full overflow-hidden flex flex-col gap-3 justify-between">
        //     <motion.ul className="w-full h-full flex flex-col gap-5 overflow-y-scroll scrollbar-floating "

        <section className="w-full h-full max-h-full flex flex-col gap-3 justify-between">
            <motion.ul className="w-full h-full flex flex-col gap-5"
                variants={variants}
                initial="hidden"
                animate="visible"
            >
                <span className="text-3xl font-bold">Today's Tasks</span>
                
                {groupedTasks.map((group) => (
                    <motion.li key={group.time} className="flex flex-col gap-2"
                        variants={childVariants}
                    >
                        <div className="flex items-center gap-2">
                            <ClockIcon className="size-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">{group.time}</span>
                            <Separator className="shrink" />
                        </div>

                        <motion.ul className="flex flex-col gap-2" role="list"
                            variants={variants}
                            initial="hidden"
                            animate="visible"
                        >
                            {group.tasks.map((task, index) => (
                                <EditTask key={index}>
                                    <EditTaskTrigger>
                                        <motion.li key={task.id}
                                            className={`border rounded-md p-2 shadow flex flex-col gap-2 w-full cursor-pointer text-start
                                                `
                                                // ${task.completed && "border-green-500 bg-green-500/5"}
                                                // ${isAfterTime(task.date) && !task.completed && 'bg-red-500/5 border-red-500'}
                                            }
                                            variants={childVariants}
                                        >
                                            <div className="flex flex-col w-full">
                                                <div className="flex w-full justify-between items-center">
                                                    <span className="text-sm font-medium">{task.title}</span>
                                                    <Badge variant={"outline"} className="text-xs">{task.duration}</Badge>
                                                </div>

                                                <p className="text-sm text-muted-foreground">{task.description}</p>
                                            </div>

                                            <motion.ul className="w-full flex flex-wrap gap-1"
                                                variants={variants}
                                                initial="hidden"
                                                animate="visible"
                                            >
                                                {task.repeat && (
                                                    <li className="shrink-0">
                                                        <Badge variant={"outline"}>
                                                            {typeof task.repeat === "string" ? task.repeat : "Weekly"}
                                                        </Badge>
                                                    </li>
                                                )}

                                                <li className="shrink-0">
                                                    <Badge variant={"secondary"}
                                                        className={`${priorityTextColor[task.priority]} ${priorityBgColor[task.priority]} ${priorityBorderColor[task.priority]}`}>
                                                        {priorityText[task.priority]}
                                                    </Badge>
                                                </li>

                                                {task.tags && task.tags.length > 0 && task.tags.map((tag, index) => (
                                                    <li key={index}>
                                                        <Badge variant={"secondary"} className={`${tagsBgColors2[index]} dark:text-background`}>
                                                            {tag}
                                                        </Badge>
                                                    </li>
                                                ))}
                                            </motion.ul>
                                        </motion.li>
                                    </EditTaskTrigger>

                                    <EditTaskContent task={task} />
                                </EditTask>
                            ))}
                        </motion.ul>
                    </motion.li>
                ))}
            </motion.ul>

            {/* <NewTask /> */}
        </section>
    )
}