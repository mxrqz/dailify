import { Timestamp } from "firebase/firestore";

export interface TaskProps {
    id: string;
    title: string;
    description: string;
    completed: Date[] | Timestamp[];
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
    task?: TaskProps
}

export interface DurationPickerProps {
    onSelectedDuration: (selectedDuration: string) => void;
    task?: TaskProps
}

export interface PriorityPickerProps {
    onSelectedPriority: (selectedPriority: number) => void;
    task?: TaskProps
}

export interface TagsPickerProps {
    onSelectedTags: (selectedTags: string[]) => void;
    task?: TaskProps
}

export interface RepeatPickerProps {
    onSelectedRepeat: (selectedRepeat: string | { Weekly: string[] | undefined }) => void;
    task?: TaskProps
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