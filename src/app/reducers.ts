import { appReducer } from "features/Application";
import { authReducer } from "features/Auth";
import { tasksReducer, todolistsReducer } from "features/TodolistsList";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  todolists: todolistsReducer,
  tasks: tasksReducer
});