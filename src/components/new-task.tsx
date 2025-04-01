import { PlusIcon } from "lucide-react";
import { DatePicker } from "./ui/date-picker";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useEffect, useRef, useState } from "react";
import TimePicker from "./ui/time-picker";
import DurationPicker from "./ui/duration-picker";
import PriorityPicker from "./ui/priority-picker";
import TagsPicker from "./ui/tags-picker";
import RepeatPicker from "./ui/repeat-picker";
import { Button } from "./ui/button";
import { nanoid } from 'nanoid';
import { TaskProps } from "@/types/types";
import { saveTask } from "@/functions/firebase";
import { useUser } from "@clerk/clerk-react";
import { useDailify } from "./dailifyContext";

export default function NewTask() {
    const { selectedDay, setNewTask, isCalendar } = useDailify()

    const titleRef = useRef<HTMLInputElement>(null)
    const descriptionRef = useRef<HTMLTextAreaElement>(null)
    const [selectedDate, setSelectedDate] = useState<Date>(selectedDay)
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
        const id = nanoid(6)

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
        setNewTask(taskData)
    }

    useEffect(() => {
        setSelectedDate(selectedDay)
    }, [selectedDay])

    return (
        <Dialog>
            <DialogTrigger className={`${isCalendar ? "size-9" : 'w-full'} h-full bg-primary rounded-md flex items-center justify-center`}>
                {/* <Button
                    size={"icon"}
                    className={`${isCalendar ? "" : 'w-full'} h-full`}
                > */}
                    <PlusIcon />
                {/* </Button> */}
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