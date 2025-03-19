import { TaskProps } from "@/types/types";
import { initializeApp } from "firebase/app";
import { arrayUnion, collection, doc, getDoc, getDocs, getFirestore, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { format, startOfDay, endOfDay } from "date-fns";
import { weekDays } from "@/conts/conts";

const firebaseConfig = {
    apiKey: "AIzaSyBjb63TKK_8X-FLpTMNrogEyTn_LZbyLX0",
    authDomain: "dailify-64dd2.firebaseapp.com",
    projectId: "dailify-64dd2",
    storageBucket: "dailify-64dd2.firebasestorage.app",
    messagingSenderId: "603576549979",
    appId: "1:603576549979:web:3c302869d9432cc034b57e"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export async function saveTask(userId: string, taskData: TaskProps) {
    await setDoc(doc(db, "users", userId, "tasks", taskData.id), taskData);

    if (taskData.repeat !== "Off" && typeof taskData.repeat === "string") {
        const taskRef = doc(db, "users", userId, "repeatTasks", taskData.repeat);
        const taskSnap = await getDoc(taskRef);

        if (taskSnap.exists()) {
            await updateDoc(taskRef, {
                id: arrayUnion(taskData.id)
            });
        } else {
            await setDoc(taskRef, {
                id: [taskData.id]
            });
        }
    } else if (typeof taskData.repeat === 'object') {
        const repeatValues = Object.values(taskData.repeat)[0]

        repeatValues?.forEach(async day => {
            const taskRef = doc(db, "users", userId, "repeatTasks", day)
            const taskSnap = await getDoc(taskRef)

            if (taskSnap.exists()) {
                await updateDoc(taskRef, {
                    id: arrayUnion(taskData.id)
                })
            } else {
                await setDoc(taskRef, {
                    id: [taskData.id]
                });
            }
        })
    }
}

export async function getTasksForDay(userId: string, selectedDate: Date) {
    const tasks = await getDayTasks(selectedDate, userId);
    const repeatTasks = await getRepeatTasks(userId, selectedDate);

    if (repeatTasks) {
        const unidedTasks = Array.from(
            new Map(
                [...tasks, ...repeatTasks]
                    .filter((task): task is TaskProps => task !== null && task !== undefined && task.id !== null && task.id !== undefined)
                    .map(task => [task.id!, task])
            ).values()
        );

        return unidedTasks
    }

    return tasks
}

export async function getDayTasks(date: Date, userId: string) {
    // const formattedDate = format(date, "PPP")
    const start = startOfDay(date);
    const end = endOfDay(date);

    const q = query(collection(db, "users", userId, "tasks"),
        where("date", ">=", start),
        where("date", "<=", end)
    );

    let tasks: TaskProps[] = []

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        tasks.push(doc.data() as TaskProps)
    })

    return tasks
}

async function getRepeatTasks(userId: string, selectedDate: Date) {
    const repeatTasksDocRef = collection(db, "users", userId, "repeatTasks");
    const repeatTasksDocs = await getDocs(repeatTasksDocRef);

    let taskIds: string[] = [];

    repeatTasksDocs.forEach(doc => {
        if (!doc.exists()) return;

        const id = doc.data().id;
        taskIds.push(...id)
    });

    return getTaskByIds(userId, taskIds, selectedDate);
}

export async function getTaskByIds(userId: string, taskId: string[], selectedDate: Date): Promise<TaskProps[] | null> {
    if (taskId.length === 0) return null;

    const q = query(collection(db, "users", userId, "tasks"), where("id", "in", taskId));
    const querySnapshot = await getDocs(q);

    let tasks: TaskProps[] = [];
    querySnapshot.forEach(doc => {
        const data = doc.data() as TaskProps

        if (typeof data.repeat === "string" && data.repeat === "Daily") {
            tasks.push(data)
        } else if (typeof data.repeat === "object" && Object.keys(data.repeat)[0] === 'Weekly') {
            const repeatDays = Object.values(data.repeat)[0]
            const selectedDay = weekDays[selectedDate.getDay()]
            if (repeatDays?.includes(selectedDay)) {
                tasks.push(data)
            }
        } else if (typeof data.repeat === "string" && data.repeat === "Monthly"){
            const selecteDay = selectedDate.getDate()
            const taskDate = data.date instanceof Timestamp && data.date.toDate().getDate()
            if (selecteDay === taskDate) {
                tasks.push(data)
            }
        }
        // if (data.date === format(selectedDate, "PPP")) {
        //     tasks.push(data)
        // }
    });

    return tasks;
}
