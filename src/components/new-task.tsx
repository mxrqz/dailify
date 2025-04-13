import { PlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useEffect, useRef, useState } from "react";
import PriorityPicker from "./ui/priority-picker";
import TagsPicker from "./ui/tags-picker";
import RepeatPicker from "./ui/repeat-picker";
import { Button } from "./ui/button";
import { nanoid } from 'nanoid';
import { TaskProps } from "@/types/types";
import { useUser } from "@clerk/clerk-react";
import { useDailify } from "./dailifyContext";
import { DatetimePicker } from "./ui/datetime-picker";
import { DateInput, TimeField } from "@/components/ui/timefield";
import { TimeValue } from "react-aria-components";

export default function NewTask({ className }: { className: string }) {
    const { selectedDay, setNewTask } = useDailify()

    const titleRef = useRef<HTMLInputElement>(null)
    const descriptionRef = useRef<HTMLTextAreaElement>(null)
    const [selectedDate, setSelectedDate] = useState<Date>(selectedDay)
    const [selectedDuration, setSelectedDuration] = useState<string>('10m')
    const [priority, setPriority] = useState<number>(0)
    const [tags, setTags] = useState<string[]>()
    const [repeat, setRepeat] = useState<string | { Weekly: string[] | undefined }>()
    const { user } = useUser()

    const handleDurationChange = (e: TimeValue) => {
        const { hour, minute } = e
        const finalMessage = `${hour && hour !== 0 ? hour + "h" : ''}${minute && minute !== 0 ? minute + "m" : ''}`
        setSelectedDuration(finalMessage)
    }

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
            completed: [],
            duration: selectedDuration,
            tags: tags,
            priority,
            repeat
        }

        console.log(taskData)

        // await saveTask(userId, taskData)
        // setNewTask(taskData)
    }

    useEffect(() => {
        setSelectedDate(selectedDay)
    }, [selectedDay])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size={"icon"}
                    className={className}
                >
                    <PlusIcon />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[calc(100%-2rem)] overflow-hidden flex flex-col">
                <DialogHeader className="text-start">
                    <DialogTitle>New Task</DialogTitle>
                    <DialogDescription>Create a new task</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 scrollbar-floating">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="title">Title</Label>
                        <Input ref={titleRef} id="title" type="text" placeholder="Task title" className="focus-visible:ring-0" required />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="description">Description</Label>
                        <Textarea ref={descriptionRef} id="description" className="resize-none focus-visible:ring-0" rows={3} maxLength={250} placeholder="Task description" />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="date">Date</Label>

                            <DatetimePicker className="border-1" onChange={(e) => e && setSelectedDate(e)} format={[
                                ["months", "days", "years"],
                                ["hours", "minutes", "am/pm"]
                            ]} />
                        </div>

                        <div className="w-full">
                            <TimeField aria-label="Duration" id="duration" defaultValue={{ hour: 0, millisecond: 0, minute: 10, second: 0 } as TimeValue} onChange={(e) => e && handleDurationChange(e)} className="flex flex-col gap-1 w-full rounded-md">
                                <Label htmlFor="duration">Duration</Label>

                                <div className="flex gap-1 border rounded-md items-center px-2 focus-within:border-primary">
                                    <DateInput className={"border-0 h-9 data-[focus-within]:ring-0 data-[focus-within]:ring-offset-0 p-0"} />
                                    <span>{selectedDuration}</span>
                                </div>
                            </TimeField>
                        </div>
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

                {/* <DialogClose asChild> */}
                <Button variant={"outline"} className="w-full"
                    onClick={() => addNewTask()}
                >
                    <PlusIcon />
                </Button>
                {/* </DialogClose> */}
            </DialogContent>
        </Dialog>
    )
}