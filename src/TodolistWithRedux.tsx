import React, {ChangeEvent, useCallback} from 'react';
import {FilterType} from "./App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@material-ui/core";
import { Delete } from '@material-ui/icons';
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "./state/store";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type TodolistPropsType = {
    id: string
    title: string
    changeFilter: (filter: FilterType, todoListId: string) => void
    onChangeTLTitle: (title: string, todoListId: string) => void
    deleteTodoList: (todoListId: string) => void
    filter: FilterType
}

export const TodolistWithRedux = (props: TodolistPropsType) => {
    const tasks = useSelector<AppRootState, Array<TaskType>>(state => state.tasks[props.id]);
    const dispatch = useDispatch();

    let filteredTasks = tasks;
    if (props.filter === 'active') {
        filteredTasks = filteredTasks.filter((t: TaskType) => !t.isDone)
    }
    if (props.filter === 'completed') {
        filteredTasks = filteredTasks.filter((t: TaskType) => t.isDone)
    }

    const removeTask = (id: string, todoListId: string) => {
        const action = removeTaskAC(id, todoListId);
        dispatch(action);
    }

    const changeStatus = (id: string, status: boolean, todoListId: string) => {
        const action = changeTaskStatusAC(id, status, todoListId);
        dispatch(action);
    }

    const onChangeTaskTitle = (id: string, title: string, todoListId: string) => {
        dispatch(changeTaskTitleAC(id, title, todoListId));
    }

    const changeFilter = (filter: FilterType) => props.changeFilter(filter, props.id);

    const deleteTodoList = () => props.deleteTodoList(props.id);
    const addTask = useCallback((title: string) => {
        const action = addTaskAC(title, props.id);
        dispatch(action);
    }, []);
    const onChangeTLTitle = (title: string) => props.onChangeTLTitle(title, props.id);

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
                        const changeStatusListener = (e: ChangeEvent<HTMLInputElement>) => {
                            changeStatus(t.id, e.currentTarget.checked, props.id)
                        }
                        const onChangeTaskTitleListener = (title: string) => {
                            onChangeTaskTitle(t.id, title, props.id)
                        }

                        return (
                            <li key={t.id}>
                                <Checkbox
                                    checked={t.isDone}
                                    onChange={changeStatusListener}
                                    color="primary"
                                />
                                <EditableSpan title={t.title} onChange={onChangeTaskTitleListener}/>
                                <IconButton onClick={() => removeTask}>
                                    <Delete />
                                </IconButton>
                            </li>
                        )
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
}

/*
<input type="checkbox"
       checked={t.isDone}
       onChange={changeStatus}
       className={t.isDone ? 'is-done' : ''}/>*/
