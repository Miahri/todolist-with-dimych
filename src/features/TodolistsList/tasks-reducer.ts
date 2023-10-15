import { todolistsAPI } from "api/todolists-api";
import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "../CommonActions/App";
import { handleAsyncServerAppError } from "utils/error-utils";
import { asyncActions as asyncTodolistsActions } from "./todolists-reducer";
import { AppRootStateType } from "utils/types";
import { TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType } from "api/types";
import { createAppAsyncThunk } from "utils/createAppAsyncThunk";
import { thunkTryCatch } from "utils/thunkTryCatch";

const {setAppStatus} = appActions;

const initialState: TasksStateType = {};

export const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[], todolistId: string },
  string>("application/initializeApp",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsAPI.getTasks(todolistId);
      thunkAPI.dispatch(setAppStatus({ status: "succeeded" }));
      return { tasks: res.data.items, todolistId };
    });
  });

/*export const _fetchTasks = createAppAsyncThunk<{ tasks: TaskType[], todolistId: string },
  string>("tasks/fetchTasks", async (todolistId: string, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await todolistsAPI.getTasks(todolistId);
    const tasks = res.data.items;
    dispatch(appActions.setAppStatus({ status: "succeeded" }));
    return { tasks, todolistId };
  } catch (error: any) {
    return handleAsyncServerNetworkError(error, dispatch);
  }
});*/

export const removeTask = createAppAsyncThunk<{ taskId: string, todolistId: string },
  { taskId: string, todolistId: string }>("tasks/removeTask",
  async (param, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsAPI.deleteTask(param.todolistId, param.taskId);
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatus({ status: "succeeded" }));
        return { taskId: param.taskId, todolistId: param.todolistId };
      } else {
        handleAsyncServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    });
  });

export const addTask = createAppAsyncThunk<TaskType, { title: string, todolistId: string }>(
  "tasks/addTask",
  async (param, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsAPI.createTask(param.todolistId, param.title);
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatus({ status: "succeeded" }));
        return res.data.data.item;
      } else {
        handleAsyncServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    });
  });

export const updateTask = createAppAsyncThunk<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string },
  { todolistId: string, taskId: string, model: UpdateDomainTaskModelType }>("tasks/updateTask",
  async (param: { taskId: string, model: UpdateDomainTaskModelType, todolistId: string }, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      const state = getState() as AppRootStateType;

      const task = state.tasks[param.todolistId].find(t => t.id === param.taskId);
      if (!task) {
        dispatch(appActions.setAppError({ error: "Task not found in the state" }));
        return rejectWithValue(null);
      }

      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...param.model
      };

      const res = await todolistsAPI.updateTask(param.todolistId, param.taskId, apiModel);
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatus({ status: "succeeded" }));
        return param;
      } else {
        handleAsyncServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    });
  });

export const asyncActions = {
  fetchTasks,
  removeTask,
  addTask,
  updateTask
};

export const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncTodolistsActions.addTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(asyncTodolistsActions.removeTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(asyncTodolistsActions.fetchTodolistsTC.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl: any) => {
          state[tl.id] = [];
        });
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex(t => t.id === action.payload.taskId);
        if (index > -1) {
          tasks.splice(index, 1);
        }
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.todoListId].unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex(t => t.id === action.payload.taskId);
        if (index > -1) {
          tasks[index] = { ...tasks[index], ...action.payload.model };
        }
      });
  }
});

// types
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [key: string]: Array<TaskType>
}

