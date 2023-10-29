import React, { useCallback, useEffect } from "react";
import { AddItemForm, AddItemFormSubmitHelperType } from "components/AddItemForm/AddItemForm";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import { FilterValuesType, TodolistDomainType } from "../todolists-reducer";
import { tasksActions, todolistsActions } from "../index";
import { TaskType } from "api/types";
import { useActions, useAppDispatch } from "utils/redux-utils";
import { Delete } from "@mui/icons-material";
import { Button, IconButton, Paper } from "@mui/material";
import { Tasks } from "features/TodolistsList/Todolist/Task/Tasks";

type PropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    demo?: boolean
}

export const Todolist = React.memo(function ({demo = false, ...props}: PropsType) {
    const {fetchTasks, addTask} = useActions(tasksActions)
    const {changeTodolistFilter, removeTodolistTC, changeTodolistTitleTC} = useActions(todolistsActions)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo) {
            return
        }
        fetchTasks(props.todolist.id)
    }, [])

    const addTaskHandler = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {

        let thunk = addTask({title: title, todolistId: props.todolist.id})
        const resultAction = await dispatch(thunk)

        if (tasksActions.addTask.rejected.match(resultAction)) {
            let fieldError = resultAction.payload?.fieldsErrors;
            if (fieldError?.length) {
                const errorMessage = fieldError[0].error
                helper.setError(errorMessage)
            } else {
                helper.setError('Some error occured')
            }
        } else {
            helper.setTitle('')
        }

    }, [props.todolist.id])

    const removeTodolistHandler = () => {
        removeTodolistTC(props.todolist.id)
    }

    const changeTodolistTitleHandler = useCallback((title: string) => {
        changeTodolistTitleTC({id: props.todolist.id, title: title})
    }, [props.todolist.id])

    const changeTodolistFilterHandler = useCallback((filter: FilterValuesType) => changeTodolistFilter({
        filter: filter,
        id: props.todolist.id
    }), [props.todolist.id])



    const renderFilterButton = (buttonFilter: FilterValuesType,
                                color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
                                text: string) => {
        return <Button variant={props.todolist.filter === buttonFilter ? 'outlined' : 'text'}
                       onClick={() => changeTodolistFilterHandler(buttonFilter)}
                       color={color}>{text}
        </Button>
    }

    return <Paper style={{ padding: "10px", position: "relative", alignItems: "center" }}>
        <IconButton
          size={"small"}
          onClick={removeTodolistHandler} disabled={props.todolist.entityStatus === "loading"}
          style={{ position: "absolute", right: "15px", top: "15px" }}
        >
            <Delete fontSize={"small"} />
        </IconButton>
        <h3>
            <EditableSpan value={props.todolist.title} onChange={changeTodolistTitleHandler} />
        </h3>
        <AddItemForm addItem={addTaskHandler} disabled={props.todolist.entityStatus === "loading"} />
        <div>
            <Tasks tasks={props.tasks} todolist={props.todolist}/>
        </div>
        <div style={{ paddingTop: "10px" }}>
            {renderFilterButton("all", "info", "All")}
            {renderFilterButton("active", "primary", "Active")}
            {renderFilterButton("completed", "secondary", "Completed")}
        </div>
    </Paper>;
})



