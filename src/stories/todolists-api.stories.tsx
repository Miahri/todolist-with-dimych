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
    const todolistID = '56490a8a-98b7-4faf-8d42-c625a2c9d0e2';

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
    const todolistID = '56490a8a-98b7-4faf-8d42-c625a2c9d0e2';

    useEffect(() => {
        todolistsAPI.updateTodolistTitle(todolistID, 'Daily')
            .then((res) => {
                setState(res.data);
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const GetTasks = () => {

    const [state, setState] = useState<any>(null);
    const [todolistID, setTodolistID] = useState<string>('');

    const onClickHandler = () => {
        todolistsAPI.getTasks(todolistID)
            .then((res) => {
                setState(res.data);
            })
    }

    return <div>
        {JSON.stringify(state)}
        <input placeholder={"todolistID"} value={todolistID} onChange={(e) => setTodolistID(e.currentTarget.value)}/>
        <button onClick={onClickHandler}>Get tasks</button>
    </div>
}

export const DeleteTask = () => {

    const [state, setState] = useState<any>(null);
    const [todolistID, setTodolistID] = useState<string>('');
    const [taskID, setTaskID] = useState<string>('');

    const onClickHandler = () => {
        todolistsAPI.deleteTask(taskID, todolistID)
            .then((res) => {
                setState(res.data);
            })
    }

    return <div>
        {JSON.stringify(state)}
        <input placeholder={"taskID"} value={taskID} onChange={(e) => setTaskID(e.currentTarget.value)}/>
        <input placeholder={"todolistID"} value={todolistID} onChange={(e) => setTodolistID(e.currentTarget.value)}/>
        <button onClick={onClickHandler}>Delete task</button>
    </div>
}