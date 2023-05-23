import { CredentialsConflictError, UnauthorizedError } from "../errors/http_errors";
import { Task } from "../models/task";
import { User } from "../models/user"

async function fetchData(input: RequestInfo, _init?: RequestInit) {
    const init: RequestInit = {
        headers: _init?.headers,
        method: _init?.method,
        body: _init?.body,
        credentials: "include"
    }
    
    const response = await fetch(input, init);

    // response code 200-300 - true
    if (response.ok) {
        return response
    }
    else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;

        if(response.status === 401){
            throw new UnauthorizedError(errorMessage);
        }
        else if(response.status === 409){
            throw new CredentialsConflictError(errorMessage);
        }
        else{
            throw Error("Request failed with status: "+ response.status + " message: " + errorMessage);
        }

    }
}

export async function getLoggedInUser(): Promise<User> {
    const response = await fetchData("http://localhost:5000/api/users", { method: "GET" });

    return response.json();
}

export interface SignUpCredentials {
    username: string,
    email: string,
    password: string,
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
    const response = await fetchData("http://localhost:5000/api/users/signup",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
    return response.json();
}

export interface LoginCredentials {
    username: string,
    password: string,
}

export async function login(credentials: LoginCredentials): Promise<User> {
    const response = await fetchData("http://localhost:5000/api/users/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
    return response.json();
}

export async function logout(){
    await fetchData("http://localhost:5000/api/users/logout",{method: "POST"});
}

export async function fetchTasks(): Promise<Task[]> {

    const response = await fetchData("http://localhost:5000/api/tasks", { method: "GET" });
    return response.json();
}

export interface TaskInput {
    taskName: string,
    isImportant?: string,
    isCompleted?: string,
}

export async function createTask(task: TaskInput): Promise<Task> {
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


export async function updateTask(taskId: string, task: TaskInput): Promise<Task> {
    const response = await fetchData("http://localhost:5000/api/tasks/" + taskId,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
        });
    return response.json();

}

export async function deleteTask(taskId: string) {
    await fetchData("http://localhost:5000/api/tasks/" + taskId, { method: "DELETE" });
}