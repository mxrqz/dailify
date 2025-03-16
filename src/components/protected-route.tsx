import { ReactNode } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { Loader2Icon } from "lucide-react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isSignedIn, isLoaded } = useUser()

    if (!isLoaded) {
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