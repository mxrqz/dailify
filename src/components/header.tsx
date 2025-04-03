import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ModeToggle } from "./mode-toggle";
import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import React from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Header = React.memo(() => {
    const { user } = useUser()
    const { signOut } = useAuth()
    const navigate = useNavigate()

    return (
        <header className="sticky top-0 h-24 py-3 inline-flex justify-between items-center w-full bg-background/70 backdrop-blur z-10">
            <h1 className="font-bold text-2xl cursor-pointer" onClick={() => navigate('/')}>Dailify</h1>

            <div className="inline-flex gap-2 items-center">

                <ModeToggle />

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar className="size-9">
                            <AvatarImage src={user?.imageUrl} alt={`${user?.firstName} profile picture`} />
                            <AvatarFallback>{user?.firstName?.slice(0, 1)}{user?.lastName?.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" >
                        <DropdownMenuItem onClick={(e) => {e.preventDefault; navigate('/profile')}}>
                            <UserIcon />
                            <span>Profile</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                            <SettingsIcon />
                            <span>Settings</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => signOut()}>
                            <LogOutIcon />
                            <span>LogOut</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
})

export default Header