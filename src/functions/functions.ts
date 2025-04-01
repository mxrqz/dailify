import { format } from "date-fns"
import { enUS, ptBR } from "date-fns/locale"
import { Timestamp } from "firebase/firestore"

export const returnFractedDate = (date: Date) => {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return { day, month, year }
}

export function getTime(time: Timestamp | Date, format: "{hours, minutes}"): { hours: number; minutes: number };
export function getTime(time: Timestamp | Date, format: "HH:MM"): string;
export function getTime(time: Timestamp | Date, format: "{hours, minutes}" | "HH:MM") {
    const hours = time instanceof Timestamp ? time.toDate().getHours() : time.getHours();
    const minutes = time instanceof Timestamp ? time.toDate().getMinutes() : time.getMinutes();

    if (format === "{hours, minutes}") return { hours, minutes };
    if (format === "HH:MM") {
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
    };

    return "";
};

export const getTasksByDate = (tasks: any, year: number, month: number, day: number) => {
    const yearStr = year.toString()
    const monthStr = month.toString().padStart(2, "0")
    const dayStr = day.toString().padStart(2, "0")

    return tasks?.[yearStr]?.[monthStr]?.[dayStr] || {}
};

export const formatDateByLocale = (date: Date, locale: string) => {
    const dateLocale = locale.startsWith("pt") ? ptBR : enUS;
    return format(date, "PPPP", { locale: dateLocale });
};