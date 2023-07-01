import {AllTasksType} from "../../app/App/App";
import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistsActionType
} from "./todolist-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskType} from "../../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootState} from "../../app/store";
import {setErrorAC, setStatusAC} from "../../app/app-reducer";

//types
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>
export type SetTasksActionType = ReturnType<typeof setTasksAC>
type MainType = RemoveTaskActionType | AddTaskActionType | UpdateTaskActionType | AddTodolistActionType |
                RemoveTodolistActionType | SetTodolistsActionType | SetTasksActionType;

type UpdateDomainTaskType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

//reducer
const initialState: AllTasksType = {}

export const tasksReducer = (state: AllTasksType = initialState, action: MainType): AllTasksType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            const stateCopy = {...state};
            const tasks = stateCopy[action.todolistId];
            stateCopy[action.todolistId] = tasks.filter(t => t.id !== action.taskId);
            return stateCopy;
        }
        case 'ADD-TASK': {
            return {
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]],
                ...state
            };
        }
        case 'UPDATE-TASK': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].
                map(t => t.id !== action.taskId ? t : {...t, ...action.model})
            }
        }
        case 'REMOVE-TODOLIST': {
            const stateCopy = {...state};
            delete stateCopy[action.id];
            return stateCopy;
        }
        case 'ADD-TODOLIST': {
            return {
                [action.todolist.id]: [],
                ...state
            }
        }
        case 'SET-TODOLISTS': {
            const copyState = {...state};

            action.todolists.forEach(tl => {
                copyState[tl.id] = [];
            })
            return copyState;
        }
        case 'SET-TASKS': {
            return {
                [action.todolistId]: action.tasks,
                ...state
            }
        }
        default:
            return state
    }
}

//action creators
export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {type: 'REMOVE-TASK', todolistId, taskId} as const
}
export const addTaskAC = (task: TaskType) => {
    return {type: 'ADD-TASK', task} as const
}
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskType, todolistId: string) => {
    return {type: 'UPDATE-TASK', taskId, model, todolistId} as const
}
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => {
    return {type: 'SET-TASKS', tasks, todolistId} as const
}

//thunk
export const fetchTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusAC('loading'));
        todolistsAPI.getTasks(todolistId)
            .then((res) => {
                dispatch(setTasksAC(res.data.items, todolistId))
                dispatch(setStatusAC('succeeded'));
            })
    }
}

export const removeTaskTC = (taskId: string, todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusAC('loading'));
        todolistsAPI.deleteTask(taskId, todolistId)
            .then((res) => {
                dispatch(removeTaskAC(taskId, todolistId));
                dispatch(setStatusAC('succeeded'));
            })
    }
}

export const addTaskTC = (title: string, todolistId: string) => {
    return (dispatch: Dispatch) => {
        dispatch(setStatusAC('loading'));
        todolistsAPI.createTask(title, todolistId)
            .then((res) => {
                if(res.data.resultCode === 0) {
                    dispatch(addTaskAC(res.data.data.item));
                    dispatch(setStatusAC('succeeded'));
                } else {
                    if(res.data.messages.length) {
                        dispatch(setErrorAC(res.data.messages[0]))
                    } else {
                        dispatch(setErrorAC('Some error occurred'))
                    }
                    dispatch(setStatusAC('failed'));
                }

            })
    }
}

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskType, todolistId: string) => {
    return (dispatch: Dispatch, getState: () => AppRootState) => {
        let state = getState();
        let task = state.tasks[todolistId].find(t => t.id === taskId);
        if(!task) {
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
                dispatch(updateTaskAC(taskId, model, todolistId))
            })
    }
}