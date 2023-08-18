import {AllTasksType} from "app/App/App";
import {
  TaskPriorities,
  TaskStatuses,
  todolistsAPI,
  TodolistType,
  UpdateTaskType
} from "api/todolists-api";
import {AppRootState} from "app/store";
import {setStatusAC} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {
  addTodolistTC,
  deleteTodolistTC, fetchTodolistsTC
} from "./todolist-reducer";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {AxiosError} from "axios";
import { clearTasksAndTodolist } from "common/actions/common.actions";

type UpdateDomainTaskType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
  thunkAPI.dispatch(setStatusAC({status: 'loading'}));
  const res = await todolistsAPI.getTasks(todolistId);
  thunkAPI.dispatch(setStatusAC({status: 'succeeded'}));
  return {tasks: res.data.items, todolistId};
});

export const removeTaskTC = createAsyncThunk('tasks/removeTask', async (param: { taskId: string, todolistId: string }, thunkAPI) => {
  thunkAPI.dispatch(setStatusAC({status: 'loading'}));
  try {
    const res = await todolistsAPI.deleteTask(param.taskId, param.todolistId);
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setStatusAC({status: 'succeeded'}));
      return param;
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

export const addTaskTC = createAsyncThunk('tasks/addTask', async (param: { title: string, todolistId: string }, thunkAPI) => {
  thunkAPI.dispatch(setStatusAC({status: 'loading'}));
  try {
    const res = await todolistsAPI.createTask(param.title, param.todolistId);
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setStatusAC({status: 'succeeded'}));
      return {task: res.data.data.item};
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

export const updateTaskTC = createAsyncThunk('tasks/updateTask',
  async ({taskId, domainModel, todolistId}: { taskId: string, domainModel: UpdateDomainTaskType, todolistId: string }, thunkAPI) => {
    let state = thunkAPI.getState() as AppRootState;
    let task = state.tasks[todolistId].find(t => t.id === taskId);
    if (!task) {
      return thunkAPI.rejectWithValue('Something goes wrong')
    }

    const model: UpdateTaskType = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
      status: task.status,
      ...domainModel
    }

    const res = await todolistsAPI.updateTask(taskId, todolistId, model)
    try {
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setStatusAC({status: 'succeeded'}));
        return {taskId, domainModel, todolistId};
      } else {
        handleServerAppError(res.data, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue(null);
      }
    } catch (error: any) {
      const err: AxiosError = error;
      handleServerNetworkError(err, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue("task not found in the state");
    }
})

//reducer
const slice = createSlice({
  name: 'task',
  initialState: {} as AllTasksType,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(deleteTodolistTC.fulfilled, (state, action) => {
      delete state[action.payload.id];
    });
    builder.addCase(addTodolistTC.fulfilled, (state, action) => {
      state[action.payload.todolist.id] = [];
    });
    builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
      action.payload.todolists.forEach((tl: TodolistType) => {
        state[tl.id] = [];
      })
    });
    builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
      state[action.payload.todolistId] = action.payload.tasks;
    });
    builder.addCase(removeTaskTC.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex(t => t.id === action.payload.taskId);
      if (index > -1) {
        tasks.splice(index, 1);
      }
    });
    builder.addCase(addTaskTC.fulfilled, (state, action) => {
      state[action.payload.task.todoListId].unshift(action.payload.task);
    });
    builder.addCase(updateTaskTC.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex(t => t.id === action.payload.taskId);
      if (index > -1) {
        tasks[index] = {...tasks[index], ...action.payload.domainModel};
      }
    });
    builder.addCase(clearTasksAndTodolist.type, () => {
      return {};
    });
  }
})

export const tasksReducer = slice.reducer;