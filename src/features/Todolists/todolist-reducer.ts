import {todolistsAPI, TodolistType} from "api/todolists-api";
import {RequestStatusType, setStatusAC} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

export type FilterType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterType
  entityStatus: RequestStatusType
};

export const fetchTodolistsTC = createAsyncThunk('todolists/fetchTodolists', async (param, thunkAPI) => {
  thunkAPI.dispatch(setStatusAC({status: 'loading'}));
  const res = await todolistsAPI.getTodolist();
  thunkAPI.dispatch(setStatusAC({status: 'succeeded'}));
  return {todolists: res.data};
});

export const deleteTodolistTC = createAsyncThunk('todolists/deleteTodolist',
  async (param: { todoListId: string }, thunkAPI) => {
    thunkAPI.dispatch(setStatusAC({status: 'loading'}));
    thunkAPI.dispatch(changeEntityStatusAC({id: param.todoListId, entityStatus: 'loading'}))
    const res = await todolistsAPI.deleteTodolist(param.todoListId);
    try {
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setStatusAC({status: 'succeeded'}));
        return {id: param.todoListId};
      } else {
        handleServerAppError(res.data, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue(null);
      }
    } catch (error: any) {
      const err: AxiosError = error;
      handleServerNetworkError(err, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(null);
    }
  });

export const addTodolistTC = createAsyncThunk('todolists/addTodolist', async (title: string, thunkAPI) => {
  thunkAPI.dispatch(setStatusAC({status: 'loading'}));
  const res = await todolistsAPI.createTodolist(title);
  try {
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setStatusAC({status: 'succeeded'}));
      return {todolist: res.data.data.item};
    } else {
      handleServerAppError(res.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(null);
    }
  } catch(error: any) {
    const err: AxiosError = error;
    handleServerNetworkError(err, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue(null);
  }
});

export const changeTodolistTitleTC = createAsyncThunk('todolists/changeTodolistTitle',
  async (param: {id: string, title: string}, thunkAPI) => {

    thunkAPI.dispatch(setStatusAC({status: 'loading'}));
    const res = await todolistsAPI.updateTodolistTitle(param.id, param.title);
    try {
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setStatusAC({status: 'succeeded'}));
        return param;
      } else {
        handleServerAppError(res.data, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue(null);
      }
    } catch(error: any) {
      const err: AxiosError = error;
      handleServerNetworkError(err, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(null);
    }
});

const slice = createSlice({
  name: 'todolist',
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    changeFilterAC(state, action: PayloadAction<{ id: string, filter: FilterType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      state[index].filter = action.payload.filter;
    },
    changeEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      state[index].entityStatus = action.payload.entityStatus;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
      return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}));
    });
    builder.addCase(deleteTodolistTC.fulfilled, (state, action) => {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      if (index > -1) {
        state.splice(index, 1);
      }
    });
    builder.addCase(addTodolistTC.fulfilled, (state, action) => {
      state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'});
    });
    builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      state[index].title = action.payload.title;
    });
  }
})

export const todolistReducer = slice.reducer;
export const { changeFilterAC, changeEntityStatusAC } = slice.actions;



