import thunkMiddleware from 'redux-thunk'
import {appReducer} from "features/Application"
import {authReducer} from "features/Auth"
import {tasksReducer, todolistsReducer} from "features/TodolistsList"
import {configureStore} from '@reduxjs/toolkit'
// непосредственно создаём store
//export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export const store = configureStore({
    reducer: {
        app: appReducer,
        auth: authReducer,
        todolists: todolistsReducer,
        tasks: tasksReducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
})

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store

