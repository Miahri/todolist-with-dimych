import {setStatusAC} from 'app/app-reducer'
import { authAPI, FieldErrorType, loginDataType } from "api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { clearTasksAndTodolist } from "common/actions/common.actions";

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
});

export const logoutTC = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
  thunkAPI.dispatch(setStatusAC({status: 'loading'}));
  try {
    const res = await authAPI.logout();
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setStatusAC({ status: 'succeeded' }));
      thunkAPI.dispatch(clearTasksAndTodolist)
      return { value: false };
    } else {
      handleServerAppError(res.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({});
    }
  } catch(error: any) {
    const err: AxiosError = error;
    handleServerNetworkError(err, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue({});
  }
});

export const initializeAppTC = createAsyncThunk('auth/initializeApp', async (param, thunkAPI) => {
  try {
    const res = await authAPI.me();
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(loginTC.fulfilled({value: true}, 'requestId', res.data.data));
    } else {
      handleServerAppError(res.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(null);
    }
  } catch(error: any) {
    const err: AxiosError = error;
      handleServerNetworkError(err, thunkAPI.dispatch);
      thunkAPI.rejectWithValue(null);
  }
  return{isInitialized: true};
})

const slice = createSlice({
    name: 'auth',
    initialState: {
      isLoggedIn: false,
      isInitialized: false
    },
    reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginTC.fulfilled, (state) => {
        state.isLoggedIn = true;
    });
    builder.addCase(logoutTC.fulfilled, (state) => {
        state.isLoggedIn = false;
    });
    builder.addCase(initializeAppTC.fulfilled, (state) => {
      state.isInitialized = true;
    });
  }
});

export const authReducer = slice.reducer;





