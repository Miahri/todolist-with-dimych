import React, {ChangeEvent} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@mui/icons-material";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type TaskPropsType = {
    todolistId: string
    task: TaskType
    changeStatus: (id: string, status: boolean, todolistId: string) => void
    onChangeTaskTitle: (id: string, title: string, todolistId: string) => void
    removeTask: (id: string, todolistId: string) => void
}

export const Task = React.memo((props: TaskPropsType) => {
    const changeStatusListener = (e: ChangeEvent<HTMLInputElement>) => {
        props.changeStatus(props.task.id, e.currentTarget.checked, props.todolistId)
    }
    const onChangeTaskTitleListener = (title: string) => {
        props.onChangeTaskTitle(props.task.id, title, props.todolistId)
    }

    return (
        <li key={props.task.id}>
            <Checkbox
                checked={props.task.isDone}
                onChange={changeStatusListener}
                color="primary"
            />
            <EditableSpan title={props.task.title} onChange={onChangeTaskTitleListener}/>
            <IconButton onClick={() => props.removeTask(props.task.id, props.todolistId)}>
                <Delete />
            </IconButton>
        </li>
    )
})
