import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useCallback, useState } from "react";
import { format } from 'date-fns';
import { enUS, ptBR } from "date-fns/locale";

export default function SelectDay({ onSelectedDay }: { onSelectedDay: (selectedDate: Date) => void }) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const language = navigator.language.startsWith("pt") ? ptBR : enUS;
    const formattedDate = format(selectedDate, "PPP", { locale: language });

    const changeDay = useCallback(
        (days: number) => {
            setSelectedDate((prevDate) => {
                const newDate = days === 0 ? new Date() : new Date(prevDate);
                if (days !== 0) newDate.setDate(newDate.getDate() + days);

                onSelectedDay(newDate);
                return newDate;
            });
        },
        [onSelectedDay]
    );

    return (
        <section className="flex flex-col items-center w-full">
            <div className="w-full inline-flex gap-5 justify-center items-center">
                <Button variant={"outline"} size={"icon"} onClick={() => changeDay(-1)}>
                    <ArrowLeftIcon />
                </Button>

                <Button variant={"outline"} onClick={() => changeDay(0)}>
                    Today
                </Button>

                <Button variant={"outline"} size={"icon"} onClick={() => changeDay(1)}>
                    <ArrowRightIcon />
                </Button>
            </div>

            <div>
                <span>{formattedDate}</span>
            </div>
        </section>
    )
}