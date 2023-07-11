import {todolistsAPI, TodolistType} from "../../api/todolists-api";
import {Dispatch} from "redux";
import {RequestStatusType, setStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type FilterType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterType
    entityStatus: RequestStatusType
}
const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{id: string}>){
            const index = state.findIndex(tl => tl.id === action.payload.id);
            if (index > -1) {
                state.splice(index, 1);
            }
        },
        addTodolistAC(state, action: PayloadAction<{todolist: TodolistType}>){
           state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'});
        },
        changeFilterAC(state, action: PayloadAction<{id: string, filter: FilterType}>){
            const index = state.findIndex(tl => tl.id === action.payload.id);
            state[index].filter = action.payload.filter;
        },
        changeEntityStatusAC(state, action: PayloadAction<{id: string, entityStatus: RequestStatusType}>){
            const index = state.findIndex(tl => tl.id === action.payload.id);
            state[index].entityStatus = action.payload.entityStatus;
        },
        changeTodolistTitleAC(state, action: PayloadAction<{id: string, title: string}>){
            const index = state.findIndex(tl => tl.id === action.payload.id);
            state[index].title = action.payload.title;
        },
        setTodolistsAC(state, action: PayloadAction<{todolists: Array<TodolistType>}>){
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}));
        }
    }
})

export const appReducer = slice.reducer;
export const {removeTodolistAC, addTodolistAC, changeFilterAC, changeEntityStatusAC,
    changeTodolistTitleAC, setTodolistsAC} = slice.actions;

//thunk
export const fetchTodolistsTC = () => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusAC({status: 'loading'}));
        todolistsAPI.getTodolist()
            .then((res) => {
                debugger;
                dispatch(setTodolistsAC({todolists: res.data}));
                dispatch(setStatusAC({status: 'succeeded'}));
            })

    }
}

export const deleteTodolistTC = (todoListId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusAC({status: 'loading'}));
        dispatch(changeEntityStatusAC({id: todoListId, entityStatus: 'loading'}))
        todolistsAPI.deleteTodolist(todoListId)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTodolistAC({id: todoListId}));
                    dispatch(setStatusAC({status: 'succeeded'}));
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
        dispatch(setStatusAC({status: 'loading'}));
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC({todolist: res.data.data.item}));
                    dispatch(setStatusAC({status: 'succeeded'}));
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
        dispatch(setStatusAC({status: 'loading'}));
        todolistsAPI.updateTodolistTitle(id, title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(changeTodolistTitleAC({id, title}))
                    dispatch(setStatusAC({status: 'succeeded'}));
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })
    }
}

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>