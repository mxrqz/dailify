import { PlusIcon } from "lucide-react";
import { DatePicker } from "./ui/date-picker";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useEffect, useRef, useState } from "react";
import TimePicker from "./ui/time-picket";
import DurationPicker from "./ui/duration-picker";
import PriorityPicker from "./ui/priority-picker";
import TagsPicker from "./ui/tags-picker";
import RepeatPicker from "./ui/repeat-picker";
import { Button } from "./ui/button";

import { v4 as uuidv4 } from 'uuid';
import { NewTaskProps, TaskProps } from "@/types/types";
import { saveTask } from "@/functions/firebase";
import { useUser } from "@clerk/clerk-react";

export default function NewTask({ onNewTask, currentSelectedDate }: NewTaskProps) {
    const titleRef = useRef<HTMLInputElement>(null)
    const descriptionRef = useRef<HTMLTextAreaElement>(null)
    const [selectedDate, setSelectedDate] = useState<Date>(currentSelectedDate)
    // const [fullDate, setFullDate] = useState<Date | undefined>()
    const [selectedDuration, setSelectedDuration] = useState<string>()
    const [priority, setPriority] = useState<number>(0)
    const [tags, setTags] = useState<string[]>()
    const [repeat, setRepeat] = useState<string | { Weekly: string[] | undefined }>()
    const { user } = useUser()

    const addNewTask = async () => {
        if (!user || !titleRef.current || !descriptionRef.current || !selectedDate || !selectedDuration || priority === null || !repeat) return

        const userId = user.id
        const title = titleRef.current.value
        const desc = descriptionRef.current.value
        const id = uuidv4()

        const taskData: TaskProps = {
            date: selectedDate,
            id: id,
            title,
            description: desc,
            completed: false,
            duration: selectedDuration,
            tags: tags,
            priority,
            repeat
        }

        await saveTask(userId, taskData)
        onNewTask(taskData)
    }

    useEffect(() => {
        setSelectedDate(currentSelectedDate)
    }, [currentSelectedDate])

    return (
        <Dialog>
            <DialogTrigger className="border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 px-4 py-2 has-[>svg]:px-3">
                <PlusIcon />
            </DialogTrigger>

            <DialogContent className="max-h-[calc(100%-2rem)] overflow-hidden flex flex-col">
                <DialogHeader className="text-start">
                    <DialogTitle>New Task</DialogTitle>
                    <DialogDescription>Create a new task</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 scrollbar-floating">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="title">Title</Label>
                        <Input ref={titleRef} id="title" type="text" placeholder="Task title" required />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="description">Description</Label>
                        <Textarea ref={descriptionRef} id="description" className="resize-none" rows={3} maxLength={250} placeholder="Task description" />
                    </div>

                    <div className="w-full flex items-center gap-3">
                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor="date">Date</Label>
                            <DatePicker id="date" onSelectedDate={setSelectedDate} currentSelectedDate={selectedDate} />
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                            <Label htmlFor="time">Time</Label>
                            <TimePicker
                                onSelectedTime={setSelectedDate}
                                selectedDate={selectedDate}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="duration">Duration</Label>
                        <DurationPicker onSelectedDuration={setSelectedDuration} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="priority">Priority</Label>
                        <PriorityPicker onSelectedPriority={setPriority} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="tags">Tags</Label>
                        <TagsPicker onSelectedTags={setTags} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="repeat">Repeat</Label>
                        <RepeatPicker onSelectedRepeat={setRepeat} />
                    </div>
                </div>

                <DialogClose asChild>
                    <Button variant={"outline"} className="w-full"
                        onClick={() => addNewTask()}
                    >
                        <PlusIcon />
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}