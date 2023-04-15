import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from "./AddItemForm/AddItemForm";
import {EditableSpan} from "./EditableSpan";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Delete } from "@mui/icons-material";
import {useSelector} from "react-redux";
import {AppRootState, useAppDispatch} from "./state/store";
import {
    addTaskTC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    fetchTasksTC,
    removeTaskTC
} from "./state/tasks-reducer";
import {Task} from "./Task";
import {FilterType} from "./state/todolist-reducer";
import {TaskStatuses, TaskType} from "./todolists-api";

type TodolistPropsType = {
    id: string
    title: string
    changeFilter: (filter: FilterType, todoListId: string) => void
    onChangeTLTitle: (title: string, todoListId: string) => void
    deleteTodoList: (todoListId: string) => void
    filter: FilterType
}

export const TodolistWithRedux = React.memo((props: TodolistPropsType) => {
    const tasks = useSelector<AppRootState, Array<TaskType>>(state => state.tasks[props.id]);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchTasksTC(props.id))
    }, [])

    let filteredTasks = tasks;
    if (props.filter === 'active') {
        filteredTasks = filteredTasks.filter((t: TaskType) => t.status === TaskStatuses.New)
    }
    if (props.filter === 'completed') {
        filteredTasks = filteredTasks.filter((t: TaskType) => t.status !== TaskStatuses.New)
    }

    const removeTask = useCallback((id: string, todoListId: string) => {
        dispatch(removeTaskTC(id, todoListId));
    }, [dispatch])

    const changeStatus = useCallback((id: string, status: boolean, todoListId: string) => {
        const action = changeTaskStatusAC(id, status, todoListId);
        dispatch(action);
    }, [dispatch])

    const onChangeTaskTitle = useCallback((id: string, title: string, todoListId: string) => {
        dispatch(changeTaskTitleAC(id, title, todoListId));
    }, [dispatch])

    const addTask = useCallback((title: string) => {
        dispatch(addTaskTC(title, props.id))
    }, [dispatch]);

    const changeFilter = useCallback((filter: FilterType) => {
        props.changeFilter(filter, props.id);
    }, [props.changeFilter, props.id])

    const deleteTodoList = useCallback(() => {
        props.deleteTodoList(props.id)
    }, [props.deleteTodoList, props.id]);

    const onChangeTLTitle = useCallback((title: string) => {
        props.onChangeTLTitle(title, props.id)
    }, [props.onChangeTLTitle, props.id])

    return (
        <div>
            <h3><EditableSpan title={props.title} onChange={onChangeTLTitle}/></h3>
            <IconButton onClick={deleteTodoList}>
                <Delete />
            </IconButton>
            <AddItemForm addItem={addTask} />
            <div>
                <ul>
                    {filteredTasks.map((t: TaskType) => {
                        return <Task
                            key={t.id}
                            todolistId={props.id}
                            task={t}
                            changeStatus={changeStatus}
                            onChangeTaskTitle={onChangeTaskTitle}
                            removeTask={removeTask}
                        />
                    })}
                </ul>
            </div>
            <div>
                <Button variant={props.filter === 'all' ? 'contained' : 'text'}
                        onClick={() => changeFilter('all')}>All
                </Button>
                <Button variant={props.filter === 'active' ? 'contained' : 'text'}
                        color={"primary"}
                        onClick={() => changeFilter('active')}>Active
                </Button>
                <Button variant={props.filter === 'completed' ? 'contained' : 'text'}
                        color={'secondary'}
                        onClick={() => changeFilter('completed')}>Completed
                </Button>
            </div>
        </div>
    )
});