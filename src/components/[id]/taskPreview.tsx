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
                {/* <div ref={mainRef} className="w-fit text-center flex flex-col gap-2 py-2 px-5 border rounded-md bg-white from-[#ff5e62] from-35% to-[#ff9966] text-black">
                    <span className="font-semibold text-lg">🗓️ {format(date, 'EEEE, PPP')}</span>

                    <div className="h-[2px] w-full bg-black/10 rounded-full" />

                    <div className="w-full flex justify-between font-medium">
                        <span>{task}</span>
                        <span>{time}</span>
                    </div>
                </div> */}


                <div ref={mainRef} className="relative flex w-fit gap-10 justify-between py-3 px-5 bg-gradient-to-br from-[#5a24d6] via-[#b92f84] via-50% to-[#fa652a] text-white rounded-lg">
                    <img
                        className="absolute top-0 left-0 w-full h-full object-cover opacity-5 mix-blend-color-dodge"
                        src="../topo_2.jpg"
                        alt=""
                    />

                    <img
                        className="absolute top-0 left-0 w-full h-full object-cover opacity-10 mix-blend-color-dodge invert"
                        src="../halftone.jpg"
                        alt=""
                    />

                    <div className="relative flex flex-col gap-3">
                        <div className="flex gap-2 items-center font-bold text-2xl">
                            {/* <CalendarCheckIcon size={28} /> */}
                            <img src="../calendar_logo_6.png" alt="Calendar" className="w-10 aspect-square" />
                            <span>Tarefa Criada</span>
                        </div>

                        <div className="flex flex-col font-medium text-lg">
                            <span>{format(date, 'PP')}</span>
                            <span>{format(date, "p")}</span>
                            <span>{task}</span>
                        </div>
                    </div>

                    <div className="relative w-36 aspect-square">
                        <img
                            className="absolute w-full h-full object-contain -scale-x-100"
                            src="../dailify_logo_2.png"
                            alt="Dailify Logo"
                        />
                    </div>
                </div>

                <img src={image} id="image" alt="" />
            </>
        )
    )
}