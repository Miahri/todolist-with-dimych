import { todolistsAPI } from "api/todolists-api";
import { RequestStatusType } from "../Application";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { handleAsyncServerAppError } from "utils/error-utils";
import { TodolistType } from "api/types";
import { createAppAsyncThunk } from "utils/createAppAsyncThunk";
import { thunkTryCatch } from "utils/thunkTryCatch";
import { appActions } from "features/CommonActions/App";

const {setAppStatus} = appActions;

const fetchTodolistsTC = createAppAsyncThunk<{ todolists: TodolistType[] }, undefined>(
  "todolists/fetchTodolists", async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsAPI.getTodolists();
      dispatch(setAppStatus({ status: "succeeded" }));
      return { todolists: res.data };
    });
  });

const removeTodolistTC = createAppAsyncThunk<{ id: string }, string>("todolists/removeTodolist",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      dispatch(changeTodolistEntityStatus({ id: todolistId, status: "loading" }));
      const res = await todolistsAPI.deleteTodolist(todolistId);
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatus({ status: "succeeded" }));
        return { id: todolistId };
      } else {
        handleAsyncServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    });
  });

const addTodolistTC = createAppAsyncThunk<{ todolist: TodolistType }, string>
("todolists/addTodolist", async (title, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  return thunkTryCatch(thunkAPI, async () => {
    const res = await todolistsAPI.createTodolist(title);
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatus({ status: "succeeded" }));
      return { todolist: res.data.data.item };
    } else {
      handleAsyncServerAppError(res.data, dispatch);
      return rejectWithValue(res.data);
    }
  });
});

const changeTodolistTitleTC = createAppAsyncThunk<{ id: string, title: string }, { id: string, title: string }>
("todolists/changeTodolistTitle", async (param, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  return thunkTryCatch(thunkAPI, async () => {
    const res = await todolistsAPI.updateTodolist(param.id, param.title);
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatus({ status: "succeeded" }));
      return { id: param.id, title: param.title };
    } else {
      handleAsyncServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  });
});

export const asyncActions = {
  fetchTodolistsTC,
  removeTodolistTC,
  addTodolistTC,
  changeTodolistTitleTC
};

export const slice = createSlice({
  name: "todolists",
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    changeTodolistFilter(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatus(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      state[index].entityStatus = action.payload.status;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
        return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
      })
      .addCase(removeTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.id);
        if (index > -1) {
          state.splice(index, 1);
        }
      })
      .addCase(addTodolistTC.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
      })
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.id);
        state[index].title = action.payload.title;
      });
  }
});

export const { changeTodolistFilter, changeTodolistEntityStatus } = slice.actions;

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
