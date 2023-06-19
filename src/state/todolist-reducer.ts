import {v1} from "uuid";
import {todoListId1, todoListId2} from '../App/id-utils'
import {todolistsAPI, TodolistType} from "../todolists-api";
import {Dispatch} from "redux";

//types
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeFilterActionType = ReturnType<typeof changeFilterAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
export type FilterType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterType
}
type MainType = RemoveTodolistActionType | AddTodolistActionType | ChangeFilterActionType |
                ChangeTodolistTitleActionType | SetTodolistsActionType;

//reducer
const initialState: Array<TodolistDomainType> = []

export const todolistReducer = (state: Array<TodolistDomainType> = initialState, action: MainType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter((tl: TodolistDomainType) => action.id !== tl.id);
        case 'ADD-TODOLIST':
            let newTList: TodolistDomainType = {
                ...action.todolist,
                filter: 'all'
            };
            return [newTList, ...state]
        case 'CHANGE-FILTER':
            return state.map((tl:TodolistDomainType) => tl.id === action.id ? {...tl, filter: action.filter} : tl);
        case 'CHANGE-TODOLIST-TITLE':
            return state.map((tl:TodolistDomainType) => tl.id === action.id ? {...tl, title: action.title} : tl);
        case 'SET-TODOLISTS':
            return action.todolists.map((tl:TodolistType) => ({...tl, filter: 'all'}));
        default:
            return state
    }
}

//action creators
export const removeTodolistAC = (id: string) => {
    return {type: 'REMOVE-TODOLIST', id: id} as const
}
export const addTodolistAC = (todolist: TodolistType) => {
    return {type: 'ADD-TODOLIST', todolist} as const
}
export const changeFilterAC = (id: string, filter: FilterType) => {
    return {type: 'CHANGE-FILTER', id: id, filter: filter} as const
}
export const changeTodolistTitleAC = (id: string, title: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title} as const
}
export const setTodolistsAC = (todolists: Array<TodolistType>) => {
    return {type: 'SET-TODOLISTS', todolists} as const
}

//thunk
export const fetchTodolistsTC = () => {
    return (dispatch: Dispatch) => {
        todolistsAPI.getTodolist()
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
            })
    }
}

export const deleteTodolistTC = (todoListId: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.deleteTodolist(todoListId)
            .then((res) => {
                dispatch(removeTodolistAC(todoListId))
            })
    }
}

export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(addTodolistAC(res.data.data.item))
            })
    }
}

export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.updateTodolistTitle(id, title)
            .then((res) => {
                dispatch(changeTodolistTitleAC(id, title))
            })
    }
}