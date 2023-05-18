import { Task } from "../models/task";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);

    // response code 200-300 - true
    if (response.ok) {
        return response
    }
    else {
        const errorBody = await response.json();
        const errorMessage = errorBody.console.error;
        throw Error(errorMessage);
    }
}

export async function fetchTasks(): Promise<Task[]> {

    const response = await fetchData("http://localhost:5000/api/tasks", { method: "GET" });
    return response.json();
}

export interface TaskInput{
    taskName: string,
    isImportant?: string,
    isCompleted?: string,
}

export async function createTask(task: TaskInput): Promise<Task>{
    const response = await fetchData("http://localhost:5000/api/tasks", 
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });

    return response.json();
}