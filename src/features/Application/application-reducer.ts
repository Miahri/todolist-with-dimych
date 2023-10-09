import {authAPI} from "api/todolists-api"
import {createSlice} from '@reduxjs/toolkit'
import {appActions} from '../CommonActions/App'
import { createAppAsyncThunk } from "utils/createAppAsyncThunk";

const initializeApp = createAppAsyncThunk<{isLoggedIn: boolean}, undefined>('application/initializeApp',
  async (_, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI;
    try{
        dispatch(appActions.setAppStatus({status: 'loading'}));
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            return {isLoggedIn: true};
        } else {
            return rejectWithValue(null);
        }
    } catch (error: any) {
        return rejectWithValue(null);
    }

})

export const asyncActions = {
    initializeApp
}

export const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle',
        error: null,
        isInitialized: false
    } as InitialStateType,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.isInitialized = true
            })
            .addCase(appActions.setAppStatus, (state, action) => {
                state.status = action.payload.status
            })
            .addCase(appActions.setAppError, (state, action) => {
                state.error = action.payload.error
            })
    }
})

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null
    // true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
    isInitialized: boolean
}
