import {AllTasksType} from "app/App/App";
import {
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    TodolistType,
    UpdateTaskType
} from "api/todolists-api";
import {Dispatch} from "redux";
import {AppRootState} from "app/store";
import {setStatusAC} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {
    addTodolistAC,
    removeTodolistAC,
    setTodolistsAC
} from "./todolist-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

//types
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>

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

export const removeTaskTC = createAsyncThunk('tasks/removeTask', async (param: {taskId: string, todolistId: string}, thunkAPI) => {
    thunkAPI.dispatch(setStatusAC({status: 'loading'}));
    try{
        const res = await todolistsAPI.deleteTask(param.taskId, param.todolistId);
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

//reducer
const slice = createSlice({
    name: 'task',
    initialState: {} as AllTasksType,
    reducers: {
        addTaskAC(state, action: PayloadAction<{task: TaskType}>){
            state[action.payload.task.todoListId].unshift(action.payload.task);
        },
        updateTaskAC(state, action: PayloadAction<{taskId: string, model: UpdateDomainTaskType, todolistId: string}>){
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model};
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.id];
        });
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = [];
        });
        builder.addCase(setTodolistsAC, (state, action) => {
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
    }
})

export const tasksReducer = slice.reducer;
export const {addTaskAC, updateTaskAC} = slice.actions;

//thunk




export const addTaskTC = (title: string, todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusAC({status: 'loading'}));
        todolistsAPI.createTask(title, todolistId)
            .then((res) => {
                debugger;
                if (res.data.resultCode === 0) {
                    dispatch(addTaskAC({task: res.data.data.item}));
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

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskType, todolistId: string) => {
    return (dispatch: Dispatch, getState: () => AppRootState) => {
        let state = getState();
        let task = state.tasks[todolistId].find(t => t.id === taskId);
        if (!task) {
            console.warn('Something goes wrong');
            return;
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

        todolistsAPI.updateTask(taskId, todolistId, model)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC({taskId, model, todolistId}))
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