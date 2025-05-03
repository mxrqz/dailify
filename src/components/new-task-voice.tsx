"use client"

import { MicIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Waveform from "./wave-form";
import { useEffect, useState } from "react";
import { TaskProps } from "@/types/types";
import { TaskDetailView } from "./task-preview";
import { useDailify } from "./dailifyContext";
import { toast } from "sonner";
import { format } from "date-fns";

export default function NewTaskVoice() {
    const [response, setResponse] = useState<TaskProps[]>()
    const { setNewTask } = useDailify()

    useEffect(() => {
        if (response) {
            response.forEach(task => {
                setNewTask(task)

                toast.message('Event has been created', {
                    description: format(new Date(task.date as any as string), 'cccc PPPpp'),
                })
            })
        }
    }, [response])

    return (
        <Dialog onOpenChange={(e) => !e && setResponse(undefined)}>
            <DialogTrigger asChild>
                <Button
                    size={"icon"}
                    className={"w-full aspect-square shrink md:h-full border cursor-pointer bg-foreground text-background hover:bg-foreground/90"}
                >
                    <MicIcon />
                    <span className="sr-only">Create task by voice</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-background">
                <DialogHeader>
                    <DialogTitle>Create task by voice</DialogTitle>

                    <DialogDescription>
                        Record your voice to create a new task. Clearly speak the title, date, time and other details of the task.
                    </DialogDescription>
                </DialogHeader>

                <Waveform onResponse={setResponse} />

                {response && response.map((task, index) => (
                    <TaskDetailView task={task} key={index} />
                ))}
            </DialogContent>
        </Dialog>
    )
}