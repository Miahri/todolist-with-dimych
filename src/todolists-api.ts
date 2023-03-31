import axios from "axios/index";

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': 'c85010c8-14b3-4039-b4af-7e02411657e5'
    }
}

export const todolistsAPI = {
    getTodolist() {
        const promise = axios.get('https://social-network.samuraijs.com/api/1.1/todo_lists', settings);
        return promise;
    },
    createTodolist(title: string) {
        const promise = axios.post('https://social-network.samuraijs.com/api/1.1/todo_lists', {title: title}, settings);
        return promise;
    },
    deleteTodolist(id: string) {
        const promise = axios.post(`https://social-network.samuraijs.com/api/1.1/todo_lists/${id}`, settings);
        return promise;
    },
    updateTodolistTitle(id: string, title: string) {
        const promise = axios.post(`https://social-network.samuraijs.com/api/1.1/todo_lists/${id}`, {title: title}, settings);
        return promise;
    },
}