import {v1} from "uuid";
import {todolistsAPI, TodolistType} from "../todolists-api";
import {Dispatch} from "redux";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST'
    title: string
    todolistId: string
}
export type ChangeFilterActionType = {
    type: 'CHANGE-FILTER'
    id: string
    filter: FilterType
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE'
    id: string
    title: string
}

export type SetTodolistsActionType = {
    type: 'SET-TODOLISTS'
    todolists: Array<TodolistType>
}

type MainType = RemoveTodolistActionType | AddTodolistActionType | ChangeFilterActionType |
    ChangeTodolistTitleActionType | SetTodolistsActionType;

export type FilterType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterType
}

export let todoListId1 = v1();
export let todoListId2 = v1();

const initialState: Array<TodolistDomainType> = [
    {id: todoListId1, title: 'What to learn', addedDate: '', order: 0, filter: 'all'},
    {id: todoListId2, title: 'What to buy', addedDate: '', order: 0, filter: 'all'},
]

export const todolistReducer = (state: Array<TodolistDomainType> = initialState, action: MainType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter((tl: TodolistDomainType) => action.id !== tl.id);
        case 'ADD-TODOLIST':
            let newTList: TodolistDomainType = {
                id: action.todolistId,
                title: action.title,
                addedDate: '',
                order: 0,
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

export const removeTodolistAC = (id: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: id}
}
export const addTodolistAC = (title: string): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', title: title, todolistId: v1()}
}
export const changeFilterAC = (id: string, filter: FilterType): ChangeFilterActionType => {
    return {type: 'CHANGE-FILTER', id: id, filter: filter}
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}
}
export const setTodolistsAC = (todolists: Array<TodolistType>): SetTodolistsActionType => {
    return {type: 'SET-TODOLISTS', todolists}
}

export const fetchTodolistsTC = () => {
    return (dispatch: Dispatch) => {
        todolistsAPI.getTodolist()
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
            })
    }
}