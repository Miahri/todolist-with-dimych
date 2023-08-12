import {todolistsAPI, TodolistType} from "api/todolists-api";
import {Dispatch} from "redux";
import {RequestStatusType, setStatusAC} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

export type FilterType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterType
  entityStatus: RequestStatusType
}

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

const slice = createSlice({
  name: 'todolist',
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
      state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'});
    },
    changeFilterAC(state, action: PayloadAction<{ id: string, filter: FilterType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      state[index].filter = action.payload.filter;
    },
    changeEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      state[index].entityStatus = action.payload.entityStatus;
    },
    changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      state[index].title = action.payload.title;
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
  }
})

export const todolistReducer = slice.reducer;
export const {
  addTodolistAC, changeFilterAC, changeEntityStatusAC,
  changeTodolistTitleAC
} = slice.actions;

//thunk


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

export type AddTodolistActionType = ReturnType<typeof addTodolistAC>