import {Provider} from "react-redux";
import {applyMiddleware, combineReducers, createStore} from "redux";
import {tasksReducer} from "../../../features/Todolists/tasks-reducer";
import {todolistReducer} from "../../../features/Todolists/todolist-reducer";
import {v1} from "uuid";
import {AppRootState, RootReducerType} from "../../store";
import {TaskPriorities, TaskStatuses} from "../../../api/todolists-api";
import {appReducer} from "../../app-reducer";
import thunkMiddleware from "redux-thunk";
import {authReducer} from "../../../features/Login/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";
import {HashRouter} from "react-router-dom";

const rootReducer: RootReducerType = combineReducers({
    tasks: tasksReducer,
    todolists: todolistReducer,
    app: appReducer,
    auth: authReducer
});

const initialGlobalState = {
    todolists: [
        {id: "todoListId1", title: 'What to learn', addedDate: '', order: 0, filter: 'all', entityStatus: 'idle'},
        {id: "todoListId2", title: 'What to buy', addedDate: '', order: 0, filter: 'all', entityStatus: 'idle'},
    ],
    tasks: {
        ["todoListId1"]: [
            {id: v1(), title: 'HTML', status: TaskStatuses.Completed, todoListId: "todoListId1", addedDate: '',
                order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''},
            {id: v1(), title: 'CSS', status: TaskStatuses.Completed, todoListId: "todoListId1", addedDate: '',
                order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''},
            {id: v1(), title: 'React', status: TaskStatuses.New, todoListId: "todoListId1", addedDate: '',
                order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''},
            {id: v1(), title: 'Redux', status: TaskStatuses.New, todoListId: "todoListId1", addedDate: '',
                order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''},
        ],
        ["todoListId2"]: [
            {id: v1(), title: 'Milk', status: TaskStatuses.Completed, todoListId: "todoListId2", addedDate: '',
                order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''},
            {id: v1(), title: 'Book', status: TaskStatuses.New, todoListId: "todoListId2", addedDate: '',
                order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''},
        ]
    },
    app: {
        status: 'succeeded',
        error: null
    },
    auth: {
        isLoggedIn: true,
        isInitialized: true
    }
}

export const storyBookStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialGlobalState as AppRootState,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
})

export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}

export const BrowserRouterDecorator = (storyFn: any) => {
    return <HashRouter>{storyFn()}</HashRouter>
}