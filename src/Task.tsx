import React, {ChangeEvent} from "react";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskStatuses, TaskType} from "./todolists-api";

type TaskPropsType = {
    todolistId: string
    task: TaskType
    changeStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    onChangeTaskTitle: (id: string, title: string, todolistId: string) => void
    removeTask: (id: string, todolistId: string) => void
}

export const Task = React.memo((props: TaskPropsType) => {
    const changeStatusListener = (e: ChangeEvent<HTMLInputElement>) => {
        let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;

        props.changeStatus(props.task.id, status, props.todolistId)
    }
    const onChangeTaskTitleListener = (title: string) => {
        props.onChangeTaskTitle(props.task.id, title, props.todolistId)
    }

    return (
        <li key={props.task.id}>
            <Checkbox
                checked={props.task.status !== TaskStatuses.New}
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
