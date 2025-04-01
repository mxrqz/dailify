import { ReactNode, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import { useDailify } from "./dailifyContext";
import { getTasksForMonth } from "@/functions/firebase";
import { isSameMonth } from "date-fns";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isSignedIn, isLoaded, user } = useUser()
    const { selectedDay, setTasks,  setIsLoading, isLoading, newTask, setCurrentMonth, currentMonth } = useDailify()

    const getTasks = async () => {
        setIsLoading(true)
        if (!user) return
        const tasks = await getTasksForMonth(user.id, selectedDay)
        setTasks(tasks)
        setIsLoading(false)
    }

    useEffect(() => {
        if (!currentMonth && isLoaded) {
            setCurrentMonth(selectedDay)
            getTasks()
        }

        if (currentMonth && !isSameMonth(currentMonth, selectedDay) && isLoaded) {
            setCurrentMonth(selectedDay)
            getTasks()
        }
    }, [selectedDay, newTask, isLoaded])

    if (!isLoaded || isLoading) {
        return (
            <div className="w-full h-dvh grid place-items-center bg-background">
                <Loader2Icon className="size-12 text-foreground animate-spin" />
            </div>
        )
    }

    if (!isSignedIn && isLoaded) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}