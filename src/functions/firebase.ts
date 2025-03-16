import { TaskProps } from "@/types/types";
import { initializeApp } from "firebase/app";
import { arrayUnion, collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";
import { format } from "date-fns";

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

    if (taskData.repeat !== "Off") {
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
    }
}

export async function getDayTasks(date: Date, userId: string) {
    const formattedDate = format(date, "PPP")
    const q = query(collection(db, "users", userId, "tasks"), where("date", "==", formattedDate));

    let tasks: TaskProps[] = []

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        tasks.push(doc.data() as TaskProps)
    })

    return tasks
}