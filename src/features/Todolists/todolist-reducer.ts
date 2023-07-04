import {todolistsAPI, TodolistType} from "../../api/todolists-api";
import {Dispatch} from "redux";
import {RequestStatusType, setStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {removeTaskAC} from "./tasks-reducer";

//types
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeFilterActionType = ReturnType<typeof changeFilterAC>
export type ChangeEntityStatusActionType = ReturnType<typeof changeEntityStatusAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
export type FilterType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterType
    entityStatus: RequestStatusType
}
type MainType = RemoveTodolistActionType | AddTodolistActionType | ChangeFilterActionType |
    ChangeTodolistTitleActionType | SetTodolistsActionType | ChangeEntityStatusActionType;

//reducer
const initialState: Array<TodolistDomainType> = []

export const todolistReducer = (state: Array<TodolistDomainType> = initialState, action: MainType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter((tl: TodolistDomainType) => action.id !== tl.id);
        case 'ADD-TODOLIST':
            let newTList: TodolistDomainType = {
                ...action.todolist,
                filter: 'all',
                entityStatus: 'idle'
            };
            return [newTList, ...state]
        case 'CHANGE-FILTER':
            return state.map((tl: TodolistDomainType) => tl.id === action.id ? {...tl, filter: action.filter} : tl);
        case 'CHANGE-ENTITY-STATUS':
            return state.map((tl: TodolistDomainType) => tl.id === action.id ? {
                ...tl,
                entityStatus: action.entityStatus
            } : tl);
        case 'CHANGE-TODOLIST-TITLE':
            return state.map((tl: TodolistDomainType) => tl.id === action.id ? {...tl, title: action.title} : tl);
        case 'SET-TODOLISTS':
            return action.todolists.map((tl: TodolistType) => ({...tl, filter: 'all', entityStatus: 'idle'}));
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
export const changeEntityStatusAC = (id: string, entityStatus: RequestStatusType) => {
    return {type: 'CHANGE-ENTITY-STATUS', id: id, entityStatus: entityStatus} as const
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
        dispatch(setStatusAC('loading'));
        todolistsAPI.getTodolist()
            .then((res) => {
                dispatch(setTodolistsAC(res.data));
                dispatch(setStatusAC('succeeded'));
            })
    }
}

export const deleteTodolistTC = (todoListId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusAC('loading'));
        dispatch(changeEntityStatusAC(todoListId, 'loading'))
        todolistsAPI.deleteTodolist(todoListId)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTodolistAC(todoListId));
                    dispatch(setStatusAC('succeeded'));
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })
    }
}

export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusAC('loading'));
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC(res.data.data.item));
                    dispatch(setStatusAC('succeeded'));
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })
    }
}

export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.updateTodolistTitle(id, title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(changeTodolistTitleAC(id, title))
                    dispatch(setStatusAC('succeeded'));
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })
    }
}