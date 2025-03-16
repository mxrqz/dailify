import { format } from "date-fns"
import { enUS, ptBR } from "date-fns/locale"

export const returnFractedDate = (date: Date) => {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return { day, month, year }
}

export const getTasksByDate = (tasks: any, year: number, month: number, day: number) => {
    const yearStr = year.toString()
    const monthStr = month.toString().padStart(2, "0")
    const dayStr = day.toString().padStart(2, "0")

    return tasks?.[yearStr]?.[monthStr]?.[dayStr] || {}
}

export const formatDateByLocale = (date: Date, locale: string) => {
    const dateLocale = locale.startsWith("pt") ? ptBR : enUS;
    return format(date, "PPPP", { locale: dateLocale });
};