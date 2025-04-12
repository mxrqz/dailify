import { ReactNode, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import { useDailify } from "./dailifyContext";
import { auth, getTasksForMonth } from "@/functions/firebase";
import { isSameMonth } from "date-fns";
import { signInWithCustomToken, onAuthStateChanged } from "firebase/auth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isSignedIn, isLoaded, user } = useUser()
    const { selectedDay, setTasks, setIsLoading, isLoading, newTask, setCurrentMonth, currentMonth } = useDailify()
    const location = useLocation();
    const { getToken, userId } = useAuth()
    const [isFirebaseLogged, setIsFirebaseLogged] = useState<boolean>(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setIsFirebaseLogged(true);
            } else if (userId) {
                const token = await getToken({ template: 'integration_firebase' });
                if (!token) return;

                try {
                    const creds = await signInWithCustomToken(auth, token);
                    if (creds.user) setIsFirebaseLogged(true);
                } catch (err) {
                    console.error("Erro ao logar no Firebase:", err);
                }
            }
        });

        return () => unsubscribe();
    }, [userId]);

    const getTasks = async () => {
        setIsLoading(true)
        if (!user || !isFirebaseLogged) return
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

    useEffect(() => {
        if (isLoaded && isFirebaseLogged && user) {
            getTasks()
        }

        // const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // console.log(timezone)
    }, [isFirebaseLogged, user, isLoaded])

    if (!isLoaded || isLoading) {
        return (
            <div className="w-full h-dvh grid place-items-center bg-background">
                <Loader2Icon className="size-12 text-foreground animate-spin" />
            </div>
        )
    }

    if (!isSignedIn && isLoaded) {
        return <Navigate to={'/login'} replace state={{ from: location }} />
    }

    if (isLoaded && !isLoading) {
        return <>{children}</>
    }
}