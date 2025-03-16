export interface TaskProps {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    duration: string,
    priority: number,
    repeat: string,
    date: string,
    time: string
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
    id: string
}

export interface TimePickerProps {
    onSelectedTime: (selectedTime: string) => void;
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
    onSelectedRepeat: (selectedRepeat: string) => void;
}

export interface NewTaskProps {
    onNewTask: (newTask: TaskProps) => void;
}