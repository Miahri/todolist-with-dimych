import {Dispatch} from 'redux'
import {setStatusAC} from 'app/app-reducer'
import { authAPI, FieldErrorType, loginDataType } from "api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const loginTC = createAsyncThunk<{value: boolean}, loginDataType, {
  rejectValue: {errors: Array<string>, fieldsErrors?: Array<FieldErrorType>}
}>('auth/login', async (data, thunkAPI) => {
  thunkAPI.dispatch(setStatusAC({status: 'loading'}));
  try {
    const res = await authAPI.login(data);
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setStatusAC({status: 'succeeded'}));
      return {value: res.data.data.userId !== 0};
    } else {
      handleServerAppError(res.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldErrors});
    }
  } catch(error: any) {
    const err: AxiosError = error;
    handleServerNetworkError(err, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue({errors: [err.message], fieldsErrors: undefined});
  }
})

const slice = createSlice({
    name: 'auth',
    initialState: {
      isLoggedIn: false,
      isInitialized: false
    },
    reducers: {
        setIsLoggedInAC: (state, action: PayloadAction<{value: boolean}>) => {
          state.isLoggedIn = action.payload.value;
        },
        setIsInitializedAC: (state, action: PayloadAction<{isInitialized: boolean}>) => {
            state.isInitialized = action.payload.isInitialized;
        }
    },
  extraReducers: (builder) => {
    builder.addCase(loginTC.fulfilled, (state, action) => {
      if (action.payload) {
        state.isLoggedIn = action.payload.value;
      }
    });
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

export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setStatusAC({status: 'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

