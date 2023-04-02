import axios from "axios/index";

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': 'c85010c8-14b3-4039-b4af-7e02411657e5'
    }
}

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
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

type ResponseType<D> = {
    resultCode: number
    messages: Array<string>
    data: D
}

export const todolistsAPI = {
    getTodolist() {
        const promise = axios.get<Array<TodolistType>>('https://social-network.samuraijs.com/api/1.1/todo_lists', settings);
        return promise;
    },
    createTodolist(title: string) {
        const promise = axios.post<ResponseType<{item: TodolistType}>>('https://social-network.samuraijs.com/api/1.1/todo_lists', {title: title}, settings);
        return promise;
    },
    deleteTodolist(id: string) {
        const promise = axios.delete<ResponseType<{}>>(`https://social-network.samuraijs.com/api/1.1/todo_lists/${id}`, settings);
        return promise;
    },
    updateTodolistTitle(id: string, title: string) {
        const promise = axios.put<ResponseType<{}>>(`https://social-network.samuraijs.com/api/1.1/todo_lists/${id}`, {title: title}, settings);
        return promise;
    }
}