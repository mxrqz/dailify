import { TaskProps } from "@/types/types";
import { createContext, useContext, useState, ReactNode } from "react";

interface DailifyContextType {
    selectedDay: Date;
    setSelectedDay: (selectedDay: Date) => void;
    newTask: TaskProps | undefined;
    setNewTask: (newTask: TaskProps) => void;
    isCalendar: boolean;
    setIsCalendar: (isCalendar: boolean) => void;
    tasks: TaskProps[] | undefined;
    setTasks: (task: TaskProps[]) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    currentMonth?: Date;
    setCurrentMonth: (currentMonth: Date) => void;
}

// Criando o contexto com um valor inicial `undefined`
const DailifyContext = createContext<DailifyContextType | undefined>(undefined);

// Criando o provider
export function DailifyProvider({ children }: { children: ReactNode }) {
    const [selectedDay, setSelectedDay] = useState<Date>(new Date())
    const [newTask, setNewTask] = useState<TaskProps>()
    const [isCalendar, setIsCalendar] = useState<boolean>(false)
    const [tasks, setTasks] = useState<TaskProps[]>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [currentMonth, setCurrentMonth] = useState<Date>()

    return (
        <DailifyContext.Provider value={{
            selectedDay, setSelectedDay, newTask, setNewTask, isCalendar, setIsCalendar, tasks, setTasks, isLoading, setIsLoading, currentMonth, setCurrentMonth
        }}
        >
            {children}
        </DailifyContext.Provider>
    );
}

// Hook para usar o contexto
export function useDailify() {
    const context = useContext(DailifyContext);
    if (!context) throw new Error("useDailify must be used within a ThemeProvider");
    return context;
}
