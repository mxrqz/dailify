import { createContext, useContext, useState, ReactNode, useRef } from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { TaskProps } from "@/types/types";
import RepeatPicker from "./ui/repeat-picker";
import { Label } from "./ui/label";
import TagsPicker from "./ui/tags-picker";
import PriorityPicker from "./ui/priority-picker";
import DurationPicker from "./ui/duration-picker";
import TimePicker from "./ui/time-picker";
import { DatePicker } from "./ui/date-picker";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { useUser } from "@clerk/clerk-react";
import { Timestamp } from "firebase/firestore";
import { useDailify } from "./dailifyContext";
import { Button } from "./ui/button";
import { saveEditedTask } from "@/functions/firebase";

interface EditTaskProps {
}

const EditTaskContext = createContext<EditTaskProps | undefined>(undefined);

export function EditTask({ children }: { children: ReactNode }) {

    return (
        <EditTaskContext.Provider value={{}}>
            <Sheet>{children}</Sheet>
        </EditTaskContext.Provider>
    );
}

export function useEditTask() {
    const context = useContext(EditTaskContext);
    if (!context) {
        throw new Error("useEditTask must be used within a EditTask");
    }
    return context;
}

export function EditTaskTrigger({ children }: { children: ReactNode }) {
    return (
        <SheetTrigger>{children}</SheetTrigger>
    );
}

export function EditTaskContent({ task }: { task: TaskProps }) {
    const { setNewTask} = useDailify()

    const titleRef = useRef<HTMLInputElement>(null)
    const descriptionRef = useRef<HTMLTextAreaElement>(null)
    const [selectedDate, setSelectedDate] = useState<Date>(task.date instanceof Timestamp ? (task.date as Timestamp).toDate() : task.date as Date)
    // const [fullDate, setFullDate] = useState<Date | undefined>()
    const [selectedDuration, setSelectedDuration] = useState<string>()
    const [priority, setPriority] = useState<number>(0)
    const [tags, setTags] = useState<string[]>()
    const [repeat, setRepeat] = useState<string | { Weekly: string[] | undefined }>()
    const { user } = useUser()

    const editTask = async () => {
        if (!user || !titleRef.current || !descriptionRef.current || !selectedDate || !selectedDuration || priority === null || !repeat) return

        const userId = user.id
        const title = titleRef.current.value
        const desc = descriptionRef.current.value
        const id = task.id

        const taskData = {
            date: selectedDate,
            id,
            description: desc,
            title,
            completed: false,
            duration: selectedDuration,
            tags: tags,
            priority,
            repeat
        }

        await saveEditedTask(userId, taskData)
        setNewTask(taskData)
    }

    return (
        <SheetContent className="w-[90%] overflow-hidden">
            <SheetHeader>
                <SheetTitle>Edit Task</SheetTitle>
                <SheetDescription>Update your task details</SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-4 scrollbar-floating px-5">
                <div className="flex flex-col gap-1">
                    <Label htmlFor="title">Title</Label>
                    <Input ref={titleRef} id="title" defaultValue={task.title} type="text" placeholder="Task title" required />
                </div>

                <div className="flex flex-col gap-1">
                    <Label htmlFor="description">Description</Label>
                    <Textarea ref={descriptionRef} id="description" defaultValue={task.description} className="resize-none" rows={3} maxLength={250} placeholder="Task description" />
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
                            task={task}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <Label htmlFor="duration">Duration</Label>
                    <DurationPicker onSelectedDuration={setSelectedDuration} task={task} />
                </div>

                <div className="flex flex-col gap-1">
                    <Label htmlFor="priority">Priority</Label>
                    <PriorityPicker onSelectedPriority={setPriority} task={task} />
                </div>

                <div className="flex flex-col gap-1">
                    <Label htmlFor="tags">Tags</Label>
                    <TagsPicker onSelectedTags={setTags} task={task} />
                </div>

                <div className="flex flex-col gap-1">
                    <Label htmlFor="repeat">Repeat</Label>
                    <RepeatPicker onSelectedRepeat={setRepeat} task={task} />
                </div>
            </div>

            <SheetFooter className="flex-row justify-end">
                <Button variant={'outline'} className="cursor-pointer">
                    Cancel
                </Button>

                <Button variant={"default"} className="cursor-pointer" onClick={editTask}>
                    Save
                </Button>
            </SheetFooter>
        </SheetContent>
    )
}

