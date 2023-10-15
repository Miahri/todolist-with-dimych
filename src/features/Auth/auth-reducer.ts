import { authAPI } from "api/todolists-api";
import { handleAsyncServerAppError, handleAsyncServerNetworkError } from "utils/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginParamsType } from "api/types";
import { appActions } from "../CommonActions/App";
import { createAppAsyncThunk } from "utils/createAppAsyncThunk";
import { thunkTryCatch } from "utils/thunkTryCatch";

const { setAppStatus } = appActions;

export const login = createAppAsyncThunk<undefined, LoginParamsType>
("auth/login", async (param, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    thunkAPI.dispatch(setAppStatus({ status: "loading" }));
    const res = await authAPI.login(param);
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatus({ status: "succeeded" }));
      return;
    } else {
      const isShowAppError = !res.data.fieldsErrors?.length;
      handleAsyncServerAppError(res.data, dispatch, isShowAppError);
      return rejectWithValue(res.data)
    }
  } catch (error) {
    handleAsyncServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
});
export const logout = createAppAsyncThunk("auth/logout", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  return thunkTryCatch(thunkAPI, async () => {
    const res = await authAPI.logout()
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatus({ status: "succeeded" }));
      return;
    } else {
      handleAsyncServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  });
});

export const asyncActions = {
  login,
  logout
};

export const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false
  },
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.isLoggedIn = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
      });
  }
});

export const authReducer = slice.reducer;
export const { setIsLoggedIn } = slice.actions;


