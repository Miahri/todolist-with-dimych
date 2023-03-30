import {useEffect, useState} from "react";
import axios from "axios";

export default {
    title: 'TODOLIST/API'
}

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': 'c85010c8-14b3-4039-b4af-7e02411657e5'
    }
}

export const GetTodolists = () => {

    const [state, setState] = useState<any>(null)

    useEffect(() => {
        let promise = axios.get('https://social-network.samuraijs.com/api/1.1/todo_lists', settings);

        promise.then((res) => {
            setState(res.data);
        })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const CreateTodolists = () => {

    const [state, setState] = useState<any>(null)

    useEffect(() => {
        let promise = axios.post('https://social-network.samuraijs.com/api/1.1/todo_lists', {title: 'Daily routine'}, settings);

        promise.then((res) => {
            setState(res.data);
        })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolists = () => {

    const [state, setState] = useState<any>(null);
    const todolistID = '';

    useEffect(() => {
        axios.delete(`https://social-network.samuraijs.com/api/1.1/todo_lists/${todolistID}`, settings)
            .then((res) => {
            setState(res.data);
        })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {

    const [state, setState] = useState<any>(null)

    useEffect(() => {
        axios.put('https://social-network.samuraijs.com/api/1.1/todo_lists/todolistID', {title: 'Daily'}, settings)
            .then((res) => {
            setState(res.data);
        })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}