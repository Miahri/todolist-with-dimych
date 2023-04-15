import {useState} from "react";
import {todoListId1, todoListId2} from "../id-utils";
import {v1} from "uuid";
import {AllTasksType} from "../App";
import {TaskPriorities, TaskStatuses, TaskType} from "../../todolists-api";

export function useTasks() {
    let [tasks, setTasks] = useState<AllTasksType>({
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
    });

    const addTask = (title: string, todoListId: string) => {
        let newTask: TaskType = {id: v1(), title, status: TaskStatuses.New, todoListId, addedDate: '',
            order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''};
        let result = tasks[todoListId];
        tasks[todoListId] = [newTask, ...result];
        setTasks({...tasks});
    }

    const removeTask = (id: string, todoListId: string) => {
        tasks[todoListId] = tasks[todoListId].filter((t: TaskType) => t.id !== id);
        setTasks({...tasks})
    }

    const changeStatus = (id: string, status: boolean, todoListId: string) => {
        tasks[todoListId] = tasks[todoListId].map((t:TaskType) => t.id === id ? {...t,
            status: status ? TaskStatuses.Completed : TaskStatuses.New} : t);
        setTasks({...tasks});
    }

    const onChangeTaskTitle = (id: string, title: string, todoListId: string) => {
        tasks[todoListId] = tasks[todoListId].map((t:TaskType) => t.id === id ? {...t, title: title} : t);
        setTasks({...tasks});
    }

    const completelyRemoveTasksForTodolist = (todoListId: string) => {
        delete tasks[todoListId];
        setTasks({...tasks})
    }

    const addStateForNewTodolist = (todolistId: string) => {
        setTasks({[todolistId]: [], ...tasks});
    }

    return {
        tasks,
        setTasks,
        addTask,
        removeTask,
        changeStatus,
        onChangeTaskTitle,
        completelyRemoveTasksForTodolist,
        addStateForNewTodolist
    }
}
