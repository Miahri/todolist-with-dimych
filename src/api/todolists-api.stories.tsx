import {useEffect, useState} from "react";
import {todolistsAPI} from "./todolists-api";

export default {
    title: 'TODOLIST/API'
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

export const CreateTask = () => {

    const [state, setState] = useState<any>(null);
    const [todolistID, setTodolistID] = useState<string>('');
    const [taskTitle, setTaskTitle] = useState<string>('');

    const onClickHandler = () => {
        todolistsAPI.createTask(taskTitle, todolistID)
            .then((res) => {
                setState(res.data);
            })
    }

    return <div>
        {JSON.stringify(state)}
        <input placeholder={"taskTitle"} value={taskTitle} onChange={(e) => setTaskTitle(e.currentTarget.value)}/>
        <input placeholder={"todolistID"} value={todolistID} onChange={(e) => setTodolistID(e.currentTarget.value)}/>
        <button onClick={onClickHandler}>Create task</button>
    </div>
}

export const UpdateTask = () => {

    const [title, setTitle] = useState<string>('new title');
    const [description, setDescription] = useState<string>('new description');
    const [status, setStatus] = useState<number>(0);
    const [priority, setPriority] = useState<number>(0);
    const [startDate, setStartDate] = useState<string>('');
    const [deadline, setDeadline] = useState<string>('');

    const [state, setState] = useState<any>(null);
    const [todolistID, setTodolistID] = useState<string>('');
    const [taskID, setTaskID] = useState<string>('');

    const onClickHandler = () => {
        todolistsAPI.updateTask(taskID, todolistID,
            {title, description, status, priority, startDate, deadline})
            .then((res) => {
                setState(res.data);
            })
    }

    return <div>
        {JSON.stringify(state)}
        <input placeholder={"taskID"} value={taskID} onChange={(e) => setTaskID(e.currentTarget.value)}/>
        <input placeholder={"todolistID"} value={todolistID} onChange={(e) => setTodolistID(e.currentTarget.value)}/>
        <input placeholder={"title"} value={title} onChange={(e) => setTitle(e.currentTarget.value)}/>
        <input placeholder={"description"} value={description} onChange={(e) => setDescription(e.currentTarget.value)}/>
        <input placeholder={"status"} type={"number"} value={status} onChange={(e) => setStatus(+e.currentTarget.value)}/>
        <input placeholder={"priority"} type={"number"} value={priority} onChange={(e) => setPriority(+e.currentTarget.value)}/>
        <input placeholder={"startDate"} value={startDate} onChange={(e) => setStartDate(e.currentTarget.value)}/>
        <input placeholder={"deadline"} value={deadline} onChange={(e) => setDeadline(e.currentTarget.value)}/>
        <button onClick={onClickHandler}>Create task</button>
    </div>
}