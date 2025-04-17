import { TaskProps } from "@/types/types";
import { initializeApp } from "firebase/app";
import { arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns";
import { getAuth } from "firebase/auth";

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
const auth = getAuth(app)

export { auth }

export async function saveTask(taskData: TaskProps, token: string): Promise<{ error?: string }> {
    const response = await fetch('http://localhost:3333/createTask', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
    })

    const data = await response.json()
    if (data.error) {
        return { error: data.error }
    }

    return {}
}

// export async function saveTask(userId: string, taskData: TaskProps) {
//     await setDoc(doc(db, "users", userId, "tasks", taskData.id), taskData);

//     if (taskData.repeat !== "Off" && typeof taskData.repeat === "string") {
//         const taskRef = doc(db, "users", userId, "repeatTasks", taskData.repeat);
//         const taskSnap = await getDoc(taskRef);

//         if (taskSnap.exists()) {
//             await updateDoc(taskRef, {
//                 id: arrayUnion(taskData.id)
//             });
//         } else {
//             await setDoc(taskRef, {
//                 id: [taskData.id]
//             });
//         }
//     } else if (typeof taskData.repeat === 'object') {
//         const repeatValues = Object.values(taskData.repeat)[0]

//         repeatValues?.forEach(async day => {
//             const taskRef = doc(db, "users", userId, "repeatTasks", day)
//             const taskSnap = await getDoc(taskRef)

//             if (taskSnap.exists()) {
//                 await updateDoc(taskRef, {
//                     id: arrayUnion(taskData.id)
//                 })
//             } else {
//                 await setDoc(taskRef, {
//                     id: [taskData.id]
//                 });
//             }
//         })
//     }
// }

export async function saveEditedTask(taskData: TaskProps, token: string): Promise<{ error?: string }> {
    // const docToUpdate = doc(db, "users", userId, "tasks", taskData.id);
    // updateDoc(docToUpdate, { ...taskData })

    const response = await fetch('http://localhost:3333/editTask', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
    })

    const data = await response.json()
    if (data.error) {
        return { error: data.error }
    }

    return {}
}

export async function markTaskAsCompleted(userId: string, taskId: string) {
    const now = new Date()
    const docToUpdate = doc(db, "users", userId, "tasks", taskId);
    updateDoc(docToUpdate, {
        completed: arrayUnion(now)
    });
}

export async function deleteTask(userId: string, taskId: string) {
    const docToDelete = doc(db, "users", userId, "tasks", taskId);
    await deleteDoc(docToDelete);
}

// código antigo que ta dando mto problema e ta mto complexo cheio de erros

// export async function getTasksForDay(userId: string, selectedDate: Date) {
//     const tasks = await getDayTasks(selectedDate, userId);
//     const repeatTasks = await getRepeatTasks(userId, selectedDate);

//     if (repeatTasks) {
//         const unidedTasks = Array.from(
//             new Map(
//                 [...tasks, ...repeatTasks]
//                     .filter((task): task is TaskProps => task !== null && task !== undefined && task.id !== null && task.id !== undefined)
//                     .map(task => [task.id!, task])
//             ).values()
//         );
//         return unidedTasks
//     }


//     return tasks
// }

// export async function getDayTasks(date: Date, userId: string) {
//     const start = startOfDay(date);
//     const end = endOfDay(date);

//     const q = query(collection(db, "users", userId, "tasks"),
//         where("date", ">=", start),
//         where("date", "<=", end)
//     );

//     let tasks: TaskProps[] = []

//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((doc) => {
//         tasks.push(doc.data() as TaskProps)
//     })

//     return tasks
// }

// async function getRepeatTasks(userId: string, selectedDate: Date) {
//     const repeatTasksDocRef = collection(db, "users", userId, "repeatTasks");
//     const repeatTasksDocs = await getDocs(repeatTasksDocRef);

//     let taskIds: string[] = [];

//     repeatTasksDocs.forEach(doc => {
//         if (!doc.exists()) return;

//         const id = doc.data().id;
//         taskIds.push(...id)
//     });

//     return getTaskByIds(userId, taskIds, selectedDate);
// }

// export async function getTaskByIds(userId: string, taskId: string[], selectedDate: Date): Promise<TaskProps[] | null> {
//     if (taskId.length === 0) return null;

//     const q = query(collection(db, "users", userId, "tasks"))
//     // , where("id", "==", taskId));
//     const querySnapshot = await getDocs(q);

//     let tasks: TaskProps[] = [];
//     querySnapshot.forEach(doc => {
//         const data = doc.data() as TaskProps
//         if (!taskId.includes(data.id)) return

//         if (typeof data.repeat === "string" && data.repeat === "Daily") {
//             tasks.push(data)
//         } else if (typeof data.repeat === "object" && Object.keys(data.repeat)[0] === 'Weekly') {
//             const repeatDays = Object.values(data.repeat)[0]
//             const selectedDay = weekDays[selectedDate.getDay()]
//             if (repeatDays?.includes(selectedDay)) {
//                 tasks.push(data)
//             }
//         } else if (typeof data.repeat === "string" && data.repeat === "Monthly") {
//             const selecteDay = selectedDate.getDate()
//             const taskDate = data.date instanceof Timestamp && data.date.toDate().getDate()
//             if (selecteDay === taskDate) {
//                 tasks.push(data)
//             }
//         }

//     });

//     return tasks;
// }



export async function getTasksForMonth(userId: string, month: Date) {
    const tasks = await getMonthTasks(userId, month)
    const repeatTasks = await getMonthlyRepeatTasks(userId, month)

    if (repeatTasks) {
        const uniqueTasks = Array.from(
            new Map(
                [...tasks, ...repeatTasks]
                    .filter((task): task is TaskProps =>
                        task !== null && task !== undefined && task.id !== null && task.id !== undefined && task.date !== undefined
                    )
                    .map(task => [`${task.id}-${task.date}`, task])
            ).values()
        );

        return uniqueTasks
    }

    return tasks
}

async function getMonthTasks(userId: string, month: Date) {
    const start = startOfMonth(month);
    const end = endOfMonth(month);

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

async function getMonthlyRepeatTasks(userId: string, month: Date) {
    const repeatTasksDocRef = collection(db, "users", userId, "repeatTasks");
    const repeatTasksDocs = await getDocs(repeatTasksDocRef);

    let taskIds: string[] = [];

    repeatTasksDocs.forEach(doc => {
        if (!doc.exists()) return;

        const id = doc.data().id;
        taskIds.push(...id)
    });

    return getMonthTaskByIds(userId, taskIds, month);
}

export async function getMonthTaskByIds(userId: string, taskId: string[], month: Date): Promise<TaskProps[] | null> {
    if (taskId.length === 0) return null;

    const q = query(collection(db, "users", userId, "tasks"))
    // , where("id", "==", taskId));
    const querySnapshot = await getDocs(q);

    const start = startOfMonth(month)
    const end = endOfMonth(month);

    let tasks: TaskProps[] = [];
    querySnapshot.forEach(doc => {
        const data = doc.data() as TaskProps
        if (!taskId.includes(data.id)) return

        if (typeof data.repeat === "string" && data.repeat === "Daily") {
            const newData = Array.from({ length: end.getDate() }).map((_, index) => {
                const newDate = Timestamp.fromDate(new Date((data.date as Timestamp).toDate().setDate(index + 1)))

                const newData = {
                    ...data,
                    date: newDate
                }

                return newData
            })

            newData.forEach(task => tasks.push(task))
        }

        else if (typeof data.repeat === "object" && Object.keys(data.repeat)[0] === 'Weekly') {
            // pegar todos os dias do mes selecionado
            const days = eachDayOfInterval({ start, end })

            // verficar qual o dia da semana
            days.forEach(day => {
                // adicionar a tarefa com o dia da semana igual ao dia
                const newDate = Timestamp.fromDate(new Date((data.date as Timestamp).toDate().setDate(day.getDate())))

                const weekDay = format(day, "EEEE")
                const repeatDays: string[] = Object.values(data.repeat)[0]
                if (repeatDays.includes(weekDay)) {
                    const newData = {
                        ...data,
                        date: newDate
                    }
                    tasks.push(newData)
                }
            })
        }
        // else if (typeof data.repeat === "string" && data.repeat === "Monthly") {
        //     const selecteDay = month.getDate()
        //     const taskDate = data.date instanceof Timestamp && data.date.toDate().getDate()
        //     if (selecteDay === taskDate) {
        //         tasks.push(data)
        //     }
        // }
    });

    return tasks;
}