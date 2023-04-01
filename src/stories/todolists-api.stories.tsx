import {useEffect, useState} from "react";
import {todolistsAPI} from "../todolists-api";

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
        todolistsAPI.getTodolist()
            .then((res) => {
            setState(res.data);
        })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const CreateTodolists = () => {

    const [state, setState] = useState<any>(null)

    useEffect(() => {
        todolistsAPI.createTodolist('Daily routine')
            .then((res) => {
            setState(res.data);
        })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolists = () => {

    const [state, setState] = useState<any>(null);
    const todolistID = '';

    useEffect(() => {
        todolistsAPI.deleteTodolist(todolistID)
            .then((res) => {
            setState(res.data);
        })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {

    const [state, setState] = useState<any>(null);
    const todolistID = '';

    useEffect(() => {
        todolistsAPI.updateTodolistTitle(todolistID, 'Daily')
            .then((res) => {
            setState(res.data);
        })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}