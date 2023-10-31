import React, { useEffect } from "react";
import { TodolistDomainType } from "../todolists-reducer";
import { tasksActions } from "../index";
import { TaskType } from "api/types";
import { useActions } from "utils/redux-utils";
import { Paper } from "@mui/material";
import { Tasks } from "features/TodolistsList/Todolist/Task/Tasks";
import { FilterTasksButton } from "features/TodolistsList/Todolist/FilterTasksButton";
import { TodolistsCardHeader } from "features/TodolistsList/Todolist/TodolistsCardHeader";

type PropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    demo?: boolean
}

export const Todolist = React.memo(function ({demo = false, ...props}: PropsType) {
    const {fetchTasks} = useActions(tasksActions)

    useEffect(() => {
        if (demo) {
            return
        }
        fetchTasks(props.todolist.id)
    }, [])

    return <Paper style={{ padding: "10px", position: "relative", alignItems: "center" }}>
        <TodolistsCardHeader todolist={props.todolist} />
        <div>
            <Tasks tasks={props.tasks} todolist={props.todolist}/>
        </div>
        <div style={{ paddingTop: "10px" }}>
            <FilterTasksButton todolist={props.todolist}/>
        </div>
    </Paper>;
})



