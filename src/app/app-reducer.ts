import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type InitialStateType = {
    status: RequestStatusType
    error: string | null
}
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState: InitialStateType = {
    status: 'idle',
    error: null
}

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setStatusAC: (state, action: PayloadAction<{status: RequestStatusType}>) => {
            state.status = action.payload.status;
        },
        setErrorAC: (state, action: PayloadAction<{error: string | null}>) => {
            state.error = action.payload.error;
        }
    }
})

export const appReducer = slice.reducer;
export const {setStatusAC, setErrorAC} = slice.actions;