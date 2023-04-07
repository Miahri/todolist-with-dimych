import {useState} from "react";
import {todoListId1, todoListId2} from "../id-utils";
import {v1} from "uuid";
import {AllTasksType} from "../App";
import {TaskType} from "../../Todolist";

export function useTasks() {
    let [tasks, setTasks] = useState<AllTasksType>({
        [todoListId1]: [
            {id: v1(), title: 'HTML', isDone: true},
            {id: v1(), title: 'CSS', isDone: true},
            {id: v1(), title: 'React', isDone: false},
            {id: v1(), title: 'Redux', isDone: false},
        ],
        [todoListId2]: [
            {id: v1(), title: 'Milk', isDone: true},
            {id: v1(), title: 'Book', isDone: false},
        ]
    });

    const addTask = (title: string, todoListId: string) => {
        let newTask: TaskType = {id: v1(), title: title, isDone: false};
        let result = tasks[todoListId];
        tasks[todoListId] = [newTask, ...result];
        setTasks({...tasks});
    }

    const removeTask = (id: string, todoListId: string) => {
        tasks[todoListId] = tasks[todoListId].filter((t: TaskType) => t.id !== id);
        setTasks({...tasks})
    }

    const changeStatus = (id: string, status: boolean, todoListId: string) => {
        tasks[todoListId] = tasks[todoListId].map((t:TaskType) => t.id === id ? {...t, isDone: status} : t);
        setTasks({...tasks});
    }

    const onChangeTaskTitle = (id: string, title: string, todoListId: string) => {
        tasks[todoListId] = tasks[todoListId].map((t:TaskType) => t.id === id ? {...t, title: title} : t);
        setTasks({...tasks});
    }

    return {
        tasks,
        setTasks,
        addTask,
        removeTask,
        changeStatus,
        onChangeTaskTitle
    } as const
}
