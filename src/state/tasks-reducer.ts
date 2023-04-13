import {AllTasksType} from "../App/App";
import {v1} from "uuid";
import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistsActionType,
    todoListId1,
    todoListId2
} from "./todolist-reducer";
import {TaskPriorities, TaskStatuses} from "../todolists-api";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK'
    todolistId: string
    taskId: string
}
export type AddTaskActionType = {
    type: 'ADD-TASK'
    title: string
    todolistId: string
}
export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS'
    taskId: string
    status: boolean
    todolistId: string
}
export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE'
    taskId: string
    title: string
    todolistId: string
}

type MainType = RemoveTaskActionType | AddTaskActionType | ChangeTaskStatusActionType | ChangeTaskTitleActionType
    | AddTodolistActionType | RemoveTodolistActionType | SetTodolistsActionType;

const initialState: AllTasksType = {
    [todoListId1]: [
        {id: v1(), title: 'HTML', status: TaskStatuses.Completed, todoListId: todoListId1, addedDate: '',
            order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''},
        {id: v1(), title: 'CSS', status: TaskStatuses.Completed, todoListId: todoListId1, addedDate: '',
            order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''},
        {id: v1(), title: 'React', status: TaskStatuses.New, todoListId: todoListId1, addedDate: '',
            order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''},
        {id: v1(), title: 'Redux', status: TaskStatuses.New, todoListId: todoListId1, addedDate: '',
            order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''},
    ],
    [todoListId2]: [
        {id: v1(), title: 'Milk', status: TaskStatuses.Completed, todoListId: todoListId2, addedDate: '',
            order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''},
        {id: v1(), title: 'Book', status: TaskStatuses.New, todoListId: todoListId2, addedDate: '',
            order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''},
    ]
}

export const tasksReducer = (state: AllTasksType = initialState, action: MainType): AllTasksType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            const stateCopy = {...state};
            const tasks = stateCopy[action.todolistId];
            stateCopy[action.todolistId] = tasks.filter(t => t.id !== action.taskId);
            return stateCopy;
        }
        case 'ADD-TASK': {
            const stateCopy = {...state};
            const tasks = stateCopy[action.todolistId];
            const newTask = {id: v1(), title: action.title, status: TaskStatuses.New,
                todoListId: action.todolistId, addedDate: '',
                order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''};
            stateCopy[action.todolistId] = [newTask, ...tasks];
            return stateCopy;
        }
        case 'CHANGE-TASK-STATUS': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].
                map(t => t.id !== action.taskId ? t : {...t, status: action.status ? TaskStatuses.Completed : TaskStatuses.New})
            }
        }
        case 'CHANGE-TASK-TITLE': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].
                map(t => t.id !== action.taskId ? t : {...t, title: action.title})
            }
        }
        case 'REMOVE-TODOLIST': {
            const stateCopy = {...state};
            delete stateCopy[action.id];
            return stateCopy;
        }
        case 'ADD-TODOLIST': {
            return {
                [action.todolistId]: [],
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
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', todolistId, taskId}
}
export const addTaskAC = (title: string, todolistId: string): AddTaskActionType => {
    return {type: 'ADD-TASK', title, todolistId}
}
export const changeTaskStatusAC = (taskId: string, status: boolean, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', taskId, status, todolistId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', taskId, title, todolistId}
}