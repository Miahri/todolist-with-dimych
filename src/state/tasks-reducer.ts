import {AllTasksType} from "../App";
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType} from "./todolist-reducer";

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
    isDone: boolean
    todolistId: string
}
export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE'
    taskId: string
    title: string
    todolistId: string
}

type MainType = RemoveTaskActionType | AddTaskActionType | ChangeTaskStatusActionType | ChangeTaskTitleActionType
    | AddTodolistActionType | RemoveTodolistActionType;

export const tasksReducer = (state: AllTasksType, action: MainType): AllTasksType => {
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
            const newTask = {id: v1(), title: action.title, isDone: false};
            stateCopy[action.todolistId] = [newTask, ...tasks];
            return stateCopy;
        }
        case 'CHANGE-TASK-STATUS': {
            const stateCopy = {...state};
            const tasks = stateCopy[action.todolistId];
            const task = tasks.find(t => t.id === action.taskId);
            if(task){
                task.isDone = action.isDone
            }
            return stateCopy;
        }
        case 'CHANGE-TASK-TITLE': {
            const stateCopy = {...state};
            const tasks = stateCopy[action.todolistId];
            const task = tasks.find(t => t.id === action.taskId);
            if(task){
                task.title = action.title
            }
            return stateCopy;
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
export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', taskId, isDone, todolistId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', taskId, title, todolistId}
}