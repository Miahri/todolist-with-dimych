import {Dispatch} from 'redux'
import {
    setStatusAC, SetErrorACType, SetStatusACType
} from '../../app/app-reducer'
import {authAPI, loginDataType} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {clearTodoListsDataAC, clearTodoListsDataType} from "../Todolists/todolist-reducer";

const initialState = {
    isLoggedIn: false,
    isInitialized: false
}

type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        case 'login/SET-IS-INITIALIZED':
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const);

export const setIsInitializedAC = (isInitialized: boolean) =>
    ({type: 'login/SET-IS-INITIALIZED', isInitialized} as const);

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true));
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error.message, dispatch)
        })
        .finally(() => {
            dispatch(setIsInitializedAC(true))
        })
}
export const loginTC = (data: loginDataType) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatusAC('loading'))
    authAPI.login(data)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(res.data.data.userId !== 0))
                dispatch(setStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error.message, dispatch)
        })
}
export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatusAC('loading'))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setStatusAC('succeeded'))
                dispatch(clearTodoListsDataAC())
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

type ActionsType = ReturnType<typeof setIsLoggedInAC>
    | ReturnType<typeof setIsInitializedAC>
    | SetStatusACType
    | SetErrorACType
    | clearTodoListsDataType
