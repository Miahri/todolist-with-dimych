import {Dispatch} from 'redux'
import {setStatusAC} from '../../app/app-reducer'
import {authAPI, loginDataType} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {clearTodoListsDataAC} from "../Todolists/todolist-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    isInitialized: false
}

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC: (state, action: PayloadAction<{value: boolean}>) => {
            state.isLoggedIn = action.payload.value;
        },
        setIsInitializedAC: (state, action: PayloadAction<{isInitialized: boolean}>) => {
            state.isInitialized = action.payload.isInitialized;
        }
    }
});

export const authReducer = slice.reducer;
const {setIsLoggedInAC, setIsInitializedAC} = slice.actions;

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: true}));
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error.message, dispatch)
        })
        .finally(() => {
            dispatch(setIsInitializedAC({isInitialized: true}))
        })
}
export const loginTC = (data: loginDataType) => (dispatch: Dispatch) => {
    dispatch(setStatusAC({status: 'loading'}))
    authAPI.login(data)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: res.data.data.userId !== 0}))
                dispatch(setStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error.message, dispatch)
        })
}
export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setStatusAC({status: 'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setStatusAC({status: 'succeeded'}))
                dispatch(clearTodoListsDataAC())
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

