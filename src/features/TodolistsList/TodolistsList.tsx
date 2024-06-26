import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { TodolistDomainType } from "./todolists-reducer";
import { TasksStateType } from "./tasks-reducer";
import { AddItemForm, AddItemFormSubmitHelperType } from "components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "../Auth/selectors";
import { todolistsActions } from "./index";
import { AppRootStateType } from "utils/types";
import { useActions, useAppDispatch } from "utils/redux-utils";
import { Grid } from "@mui/material";

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists);
  const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const dispatch = useAppDispatch();

  const { fetchTodolistsTC, addTodolistTC } = useActions(todolistsActions);

  const addTodolistHandler = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
    let thunk = addTodolistTC(title);
    const resultAction = await dispatch(thunk);

    if (addTodolistTC.rejected.match(resultAction)) {
      let fieldError = resultAction.payload?.fieldsErrors;
      if (fieldError?.length) {
        const errorMessage = fieldError[0].error;
        helper.setError(errorMessage);
      } else {
        helper.setError("Some error occured");
      }
    } else {
      helper.setTitle("");
    }
  }, []);


  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    if (!todolists.length) {
      fetchTodolistsTC();
    }
  }, []);


  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return <>
    <Grid container style={{ padding: "20px" }}>
      <AddItemForm addItem={addTodolistHandler} />
    </Grid>
    <Grid container spacing={3} style={{ flexWrap: "nowrap", overflowX: "scroll" }}>
      {
        todolists.map(tl => {
          let allTodolistTasks = tasks[tl.id];

          return <Grid item key={tl.id}>
            <div style={{ width: "300px" }}>
              <Todolist
                todolist={tl}
                tasks={allTodolistTasks}
                demo={demo}
              />
            </div>
          </Grid>;
        })
      }
    </Grid>
  </>;
};
