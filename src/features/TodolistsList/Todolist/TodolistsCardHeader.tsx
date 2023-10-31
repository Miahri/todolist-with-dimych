import React, { FC, useCallback } from "react";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import { AddItemForm, AddItemFormSubmitHelperType } from "components/AddItemForm/AddItemForm";
import { TodolistDomainType } from "features/TodolistsList/todolists-reducer";
import { useActions, useAppDispatch } from "utils/redux-utils";
import { tasksActions, todolistsActions } from "features/TodolistsList/index";

type PropsType = {
  todolist: TodolistDomainType
}

export const TodolistsCardHeader: FC<PropsType> = ({todolist}) => {
  const {removeTodolistTC, changeTodolistTitleTC} = useActions(todolistsActions)
  const {addTask} = useActions(tasksActions)

  const dispatch = useAppDispatch()

  const removeTodolistHandler = () => {
    removeTodolistTC(todolist.id)
  }

  const changeTodolistTitleHandler = useCallback((title: string) => {
    changeTodolistTitleTC({id: todolist.id, title: title})
  }, [todolist.id])

  const addTaskHandler = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {

    let thunk = addTask({title: title, todolistId: todolist.id})
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

  }, [todolist.id])

  return (
    <>
      <IconButton
        size={"small"}
        onClick={removeTodolistHandler} disabled={todolist.entityStatus === "loading"}
        style={{ position: "absolute", right: "15px", top: "15px" }}
      >
        <Delete fontSize={"small"} />
      </IconButton>
      <h3>
        <EditableSpan value={todolist.title} onChange={changeTodolistTitleHandler} />
      </h3>
      <AddItemForm addItem={addTaskHandler} disabled={todolist.entityStatus === "loading"} />
    </>
  );
};