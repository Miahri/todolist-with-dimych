import axios from "axios";

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': 'c85010c8-14b3-4039-b4af-7e02411657e5'
    }
}

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    ...settings
})

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    High = 2,
    Urgently = 3,
    Later = 4
}

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type TaskType = {
    description: string
    title: string
    completed: boolean
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

// type CreateTodolistResponseType = {
//     resultCode: number
//     messages: Array<string>
//     data: {
//         item: TodolistType
//     }
// }
//
// type DeleteTodolistResponseType = {
//     resultCode: number
//     messages: Array<string>
//     data: {}
// }
//
// type UpdateTodolistResponseType = {
//     resultCode: number
//     messages: Array<string>
//     data: {}
// }

type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    data: D
}

type GetTasksResponseType = {
    totalCount: number
    error: string | null
    items: Array<TaskType>
}

type UpdateTaskType = {
    title: string
    description: string
    status: number
    priority: number
    startDate: string
    deadline: string
}

export const todolistsAPI = {
    getTodolist() {
        const promise = instance.get<Array<TodolistType>>('todo-lists');
        return promise;
    },
    createTodolist(title: string) {
        const promise = instance.post<ResponseType<{item: TodolistType}>>('todo-lists', {title: title});
        return promise;
    },
    deleteTodolist(id: string) {
        const promise = instance.delete<ResponseType>(`todo-lists/${id}`);
        return promise;
    },
    updateTodolistTitle(id: string, title: string) {
        const promise = instance.put<ResponseType>(`todo-lists/${id}`, {title: title});
        return promise;
    },
    getTasks(todolistID: string) {
        return instance.get<GetTasksResponseType>(`todo-lists${todolistID}/tasks`);
    },
    deleteTask(id: string, todolistID: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistID}/tasks/${id}`);
    },
    createTask(title: string, todolistID: string) {
        return instance.post<ResponseType<TaskType>>(`todo-lists/${todolistID}/tasks/`, {title: title});
    },
    updateTask(taskID: string, todolistID: string, model: UpdateTaskType) {
        return instance.put<ResponseType<TaskType>>(`todo-lists/${todolistID}/tasks/${taskID}`, model);
    },
}