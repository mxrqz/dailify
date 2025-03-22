import { Timestamp } from "firebase/firestore";

export interface TaskProps {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    duration: string,
    priority: number,
    repeat: string | { Weekly: string[] | undefined },
    date: Date | Timestamp,
    tags?: string[],
}

export interface DailyTasksProps {
    day: Date
}

export interface SelectDayProps {
    onSelectedDay: (selectedDate: Date) => void
}

export interface DatePickerProps {
    onSelectedDate: (selectedDate: Date) => void;
    id: string;
    currentSelectedDate: Date;
}

export interface TimePickerProps {
    onSelectedTime: (selectedTime: Date) => void;
    selectedDate: Date
}

export interface DurationPickerProps {
    onSelectedDuration: (selectedDuration: string) => void;
}

export interface PriorityPickerProps {
    onSelectedPriority: (selectedPriority: number) => void;
}

export interface TagsPickerProps {
    onSelectedTags: (selectedTags: string[]) => void;
}

export interface RepeatPickerProps {
    onSelectedRepeat: (selectedRepeat: string | { Weekly: string[] | undefined }) => void;
}

export interface NewTaskProps {
    onNewTask: (newTask: TaskProps) => void;
    // currentSelectedDate: Date,
}

export interface FormDataValues {
    firstName: string;
    lastName: string;
    username: string;
};