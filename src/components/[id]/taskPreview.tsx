import { format } from "date-fns"
import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { toPng } from 'html-to-image'

export default function TaskPreview() {
    const [searchParams] = useSearchParams()

    const mainRef = useRef<HTMLDivElement>(null)

    const [date, setDate] = useState<Date>()
    const [task, setTask] = useState<string>()
    const [time, setTime] = useState<string>()

    const [image, setImage] = useState<string>()

    useEffect(() => {
        const date = searchParams.get("date")
        const task = searchParams.get("task")
        const time = searchParams.get("time")

        if (!date || !task || !time) return
        const newDate = new Date(date)
        setDate(newDate)
        setTask(task)
        setTime(time)
    }, [searchParams])

    const getPng = async () => {
        if (!mainRef.current) return
        const png = await toPng(mainRef.current)
        setImage(png)
    }

    useEffect(() => {
        if (!mainRef.current) return
        getPng()
    }, [mainRef, date, time, task])

    return (
        date && task && time && (
            <>
                <div ref={mainRef} className="w-fit text-center flex flex-col gap-2 py-2 px-5 border rounded-md bg-white from-[#ff5e62] from-35% to-[#ff9966] text-black">
                    <span className="font-semibold text-lg">🗓️ {format(date, 'EEEE, PPP')}</span>

                    <div className="h-[2px] w-full bg-black/10 rounded-full" />

                    <div className="w-full flex justify-between font-medium">
                        <span>{task}</span>
                        <span>{time}</span>
                    </div>
                </div>

                <img src={image} id="image" alt="" />
            </>
        )
    )
}