import { Calendar1Icon, CheckIcon, ClipboardListIcon, Clock12Icon, ClockIcon, HomeIcon, PlusIcon, SunIcon } from "lucide-react";
import Header from "../components/header";
import { Button } from "../components/ui/button";
import Calendar3 from "@/components/ui/calendar3";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {

    return (
        <main className="flex flex-col gap-10 w-full px-[clamp(1rem,5vw,24rem)]">
            <Header />

            <section className="w-full grid md:grid-cols-2 gap-10 md:gap-36 items-center">
                <div className="flex flex-col gap-5 shrink text-pretty">
                    <h1 className="text-5xl sm:text-6xl font-bold leading-none">
                        Organize your daily tasks <span className="text-primary">effortlessly</span>
                    </h1>

                    <p className="text-xl text-foreground/70">
                        Dailify helps you manage your day-to-day tasks with a simple, intuitive interface. Stay organized, focused, and productive.
                    </p>

                    <div className="flex gap-5 w-full">
                        <Button size="lg" className="bg-primary shrink border cursor-pointer">
                            Get Started — It's Free
                        </Button>

                        <Button size="lg" className="shrink bg-background hover:bg-background/70 cursor-pointer text-foreground border">
                            See how it works
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border p-3 bg-background">
                    <div className="flex justify-between items-center">
                        <ul className="flex gap-2">
                            <li className="size-3 rounded-full bg-red-500" />
                            <li className="size-3 rounded-full bg-yellow-500" />
                            <li className="size-3 rounded-full bg-green-500" />
                        </ul>

                        <div className="flex gap-3">
                            <Button variant={"outline"} className="size-7">
                                <SunIcon />
                            </Button>

                            <div className="rounded-full size-7 aspect-square bg-muted-foreground/30" />
                        </div>
                    </div>

                    <Calendar3 />

                    <div className="flex gap-5">
                        <Button className="w-full shrink border">
                            <PlusIcon />
                        </Button>

                        <Button className="w-full shrink bg-background hover:bg-background/90 text-foreground border">
                            <Calendar1Icon />
                        </Button>
                    </div>

                    <div className="bg-background w-full flex flex-col items-center gap-3 p-3 border rounded-md h-full">
                        <span className="text- font-bold">Upcoming Task</span>

                        <div className="w-full border border-primary rounded-md p-2 flex flex-col">
                            <span className="text-lg font-bold">Dailify</span>
                            <span className="text-sm text-muted-foreground">12:00 PM</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <span className="text-xl font-bold">Today's Tasks</span>

                        <div className="flex items-center gap-1">
                            <ClockIcon className="size-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground text-nowrap">06:00 AM</span>
                            <Separator className="shrink" />
                        </div>

                        <div className="flex flex-col gap-2 bg-background rounded-md border p-3 shadow">
                            <div className="flex flex-col w-full">
                                <div className="flex w-full justify-between items-center">
                                    <span className="text-base font-semibold">task.title</span>

                                    <div className="flex items-center gap-2">
                                        <Badge variant={"outline"} className="">1h</Badge>
                                    </div>
                                </div>

                                <p className="text-sm font-medium text-muted-foreground">task.description</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <ClockIcon className="size-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground text-nowrap">09:00 AM</span>
                            <Separator className="shrink" />
                        </div>

                        <div className="flex flex-col gap-2 bg-background rounded-md border p-3 shadow">
                            <div className="flex flex-col w-full">
                                <div className="flex w-full justify-between items-center">
                                    <span className="text-base font-semibold">task.title 2</span>

                                    <div className="flex items-center gap-2">
                                        <Badge variant={"outline"} className="">1h</Badge>
                                    </div>
                                </div>

                                <p className="text-sm font-medium text-muted-foreground">task.description</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full flex flex-col gap-10 items-center">
                <div className="max-w-3xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold">Everything you need to stay organized</h2>

                    <p className="text-xl text-gray-600">
                        Dailify combines simplicity with powerful features to help you manage your tasks effectively.
                    </p>
                </div>

                <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <li className="bg-background rounded-xl p-6 shadow border">
                        <div className="mb-4 p-3 bg-red-500/10 text-primary rounded-lg inline-block"><Calendar1Icon /></div>
                        <h3 className="text-xl font-semibold mb-2">Simple Calendar View</h3>
                        <p className="text-gray-600">See all your tasks in a clean, intuitive calendar interface. Plan your days, weeks, and months with ease.</p>
                    </li>

                    <li className="bg-background rounded-xl p-6 shadow border">
                        <div className="mb-4 p-3 bg-red-500/10 text-primary rounded-lg inline-block"><ClockIcon /></div>
                        <h3 className="text-xl font-semibold mb-2">Time-Based Tasks</h3>
                        <p className="text-gray-600">Organize your tasks by time to create a structured daily schedule that keeps you on track.</p>
                    </li>

                    <li className="bg-background rounded-xl p-6 shadow border">
                        <div className="mb-4 p-3 bg-red-500/10 text-primary rounded-lg inline-block"><CheckIcon /></div>
                        <h3 className="text-xl font-semibold mb-2">Task Prioritization</h3>
                        <p className="text-gray-600">Mark tasks as high, medium, or low priority to focus on what matters most.</p>
                    </li>

                    <li className="bg-background rounded-xl p-6 shadow border">
                        <div className="mb-4 p-3 bg-red-500/10 text-primary rounded-lg inline-block"><ClipboardListIcon /></div>
                        <h3 className="text-xl font-semibold mb-2">Custom Categories</h3>
                        <p className="text-gray-600">Create your own task categories and tags to organize your tasks in a way that makes sense for you.</p>
                    </li>

                    <li className="bg-background rounded-xl p-6 shadow border">
                        <div className="mb-4 p-3 bg-red-500/10 text-primary rounded-lg inline-block"><Clock12Icon /></div>
                        <h3 className="text-xl font-semibold mb-2">Recurring Tasks</h3>
                        <p className="text-gray-600">Set up tasks that repeat daily, weekly, or monthly to maintain your routine without extra effort.</p>
                    </li>

                    <li className="bg-background rounded-xl p-6 shadow border">
                        <div className="mb-4 p-3 bg-red-500/10 text-primary rounded-lg inline-block"><HomeIcon /></div>
                        <h3 className="text-xl font-semibold mb-2">Smart Notifications</h3>
                        <p className="text-gray-600">Get timely reminders for upcoming tasks so you never miss an important deadline.</p>
                    </li>
                </ul>

            </section>
        </main>
    )
}