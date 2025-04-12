import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ModeToggle } from "./mode-toggle";
import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import React from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const Header = React.memo(() => {
    const { user } = useUser()
    const { signOut } = useAuth()
    const navigate = useNavigate()
    const path = window.location.pathname

    return (
        <header className="sticky top-0 py-5 inline-flex justify-between items-center w-full dark:bg-zinc-900/70 bg-zinc-100/70 backdrop-blur z-10">
            <a href={path === "/" ? '/' : '/dashboard'} className="inline-flex gap-2 items-center">
                <div className="relative h-7 aspect-square">
                    <img src="./dailify_logo_2.png" alt="" className="absolute h-full w-full object-cover invert dark:invert-0" />
                </div>

                <h1 className="font-bold text-2xl cursor-pointer">
                    Dailify
                </h1>
            </a>

            <div className="inline-flex gap-5 items-center">
                <ModeToggle />

                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar className="size-9 cursor-pointer">
                                <AvatarImage src={user?.imageUrl} alt={`${user?.firstName} profile picture`} />
                                <AvatarFallback>{user?.firstName?.slice(0, 1)}{user?.lastName?.slice(0, 1)}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" >
                            <DropdownMenuItem onClick={(e) => { e.preventDefault; navigate('/profile') }} className="cursor-pointer">
                                <UserIcon />
                                <span>Profile</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={(e) => e.preventDefault()} className="cursor-pointer">
                                <SettingsIcon />
                                <span>Settings</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                                <LogOutIcon />
                                <span>LogOut</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="flex gap-5">
                        <Button className="bg-primary text-background hover:bg-primary/70 cursor-pointer" onClick={() => navigate("/login")}>
                            Login
                        </Button>
                    </div>
                )}
            </div>
        </header>
    )
})

export default Header