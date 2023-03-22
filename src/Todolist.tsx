import React, {ChangeEvent} from 'react';
import {FilterType} from "./App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@mui/material";
import { Delete } from "@mui/icons-material";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type TodolistPropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (id: string, todoListId: string) => void
    changeFilter: (filter: FilterType, todoListId: string) => void
    addTask: (title: string, todoListId: string) => void
    changeStatus: (id: string, status: boolean, todoListId: string) => void
    onChangeTaskTitle: (id: string, title: string, todoListId: string) => void
    onChangeTLTitle: (title: string, todoListId: string) => void
    deleteTodoList: (todoListId: string) => void
    filter: FilterType
}

export const Todolist = (props: TodolistPropsType) => {
    const changeFilter = (filter: FilterType) => props.changeFilter(filter, props.id);

    const deleteTodoList = () => props.deleteTodoList(props.id);
    const addTask = (title: string) => props.addTask(title, props.id);
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
                    {props.tasks.map((t: TaskType) => {
                        const removeTask = () => props.removeTask(t.id, props.id);
                        const changeStatus = (e: ChangeEvent<HTMLInputElement>) => {
                            props.changeStatus(t.id, e.currentTarget.checked, props.id)
                        }
                        const onChangeTaskTitle = (title: string) => {
                            props.onChangeTaskTitle(t.id, title, props.id)
                        }

                        return (
                            <li key={t.id}>
                                <Checkbox
                                    checked={t.isDone}
                                    onChange={changeStatus}
                                    color="primary"
                                />
                                <EditableSpan title={t.title} onChange={onChangeTaskTitle}/>
                                <IconButton onClick={removeTask}>
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