import {todolistReducer} from "./todolist-reducer";
import {tasksReducer} from "./tasks-reducer";
import {combineReducers, createStore} from "redux";

const rootReducer = combineReducers({
    todolists: todolistReducer,
    tasks: tasksReducer
})

export type AppRootState = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer);

//@ts-ignore
window.store = store;