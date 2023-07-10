import {todolistReducer} from "../features/Todolists/todolist-reducer";
import {tasksReducer} from "../features/Todolists/tasks-reducer";
import {AnyAction, combineReducers} from "redux";
import thunkMiddleware, {ThunkDispatch} from "redux-thunk";
import {useDispatch} from "react-redux";
import {appReducer} from "./app-reducer";
import {configureStore} from "@reduxjs/toolkit";
import {authReducer} from "../features/Login/auth-reducer";

const rootReducer = combineReducers({
    todolists: todolistReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
});

export type AppRootState = ReturnType<typeof rootReducer>

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
})

export type AppDispatchType = ThunkDispatch<AppRootState, any, AnyAction>

export const useAppDispatch = () => useDispatch<AppDispatchType>()

//@ts-ignore
window.store = store;