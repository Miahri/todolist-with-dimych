import React, {useCallback} from 'react';
import {FilterType} from "./App/App";
import {AddItemForm} from "./AddItemForm/AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, IconButton} from "@mui/material";
import { Delete } from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "./state/store";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {Task, TaskType} from "./Task";

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
    const dispatch = useDispatch();

    let filteredTasks = tasks;
    if (props.filter === 'active') {
        filteredTasks = filteredTasks.filter((t: TaskType) => !t.isDone)
    }
    if (props.filter === 'completed') {
        filteredTasks = filteredTasks.filter((t: TaskType) => t.isDone)
    }

    const removeTask = useCallback((id: string, todoListId: string) => {
        const action = removeTaskAC(id, todoListId);
        dispatch(action);
    }, [dispatch])

    const changeStatus = useCallback((id: string, status: boolean, todoListId: string) => {
        const action = changeTaskStatusAC(id, status, todoListId);
        dispatch(action);
    }, [dispatch])

    const onChangeTaskTitle = useCallback((id: string, title: string, todoListId: string) => {
        dispatch(changeTaskTitleAC(id, title, todoListId));
    }, [dispatch])

    const changeFilter = useCallback((filter: FilterType) => {
        props.changeFilter(filter, props.id);
    }, [props.changeFilter, props.id])

    const deleteTodoList = useCallback(() => {
        props.deleteTodoList(props.id)
    }, [props.deleteTodoList, props.id]);
    const addTask = useCallback((title: string) => {
        const action = addTaskAC(title, props.id);
        dispatch(action);
    }, [dispatch]);
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