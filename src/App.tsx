import React, {useState} from 'react';
import './App.css';
import {v1} from "uuid";
import {TaskType, Todolist} from "./Todolist";

export type FilterType = 'all' | 'active' | 'completed'

type TodolistType = {
    id: string
    title: string
    filter: FilterType
}

type AllTasksType = {
    [key: string]: Array<TaskType>
}

function App() {
    const addTask = (title: string, todoListId: string) => {
        let newTask: TaskType = {id: v1(), title: title, isDone: false};
        let result = tasks[todoListId];
        tasks[todoListId] = [...result, newTask];
        setTasks({...tasks});
    }

    const removeTask = (id: string, todoListId: string) => {
        tasks[todoListId] = tasks[todoListId].filter((t: TaskType) => t.id !== id);
        setTasks({...tasks})
    }

    const changeFilter = (filter: FilterType, todoListId: string) => {
        setTodolist(todoLists.map((tl:TodolistType) => tl.id === todoListId ? {...tl, filter: filter} : tl))
    }

    const changeStatus = (id: string, status: boolean, todoListId: string) => {
        tasks[todoListId] = tasks[todoListId].map((t:TaskType) => t.id === id ? {...t, isDone: status} : t);
        setTasks({...tasks});
    }

    const deleteTodoList = (todoListId: string) => {
        let result = todoLists.filter((tl: TodolistType) => todoListId !== tl.id);
        setTodolist(result);

        delete tasks[todoListId];
        setTasks({...tasks})
    }

    let todoListId1 = v1();
    let todoListId2 = v1();

    let [todoLists, setTodolist] = useState<Array<TodolistType>>([
        {id: todoListId1, title: 'What to learn', filter: 'active'},
        {id: todoListId2, title: 'What to buy', filter: 'completed'},
    ]);

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
    })

    return (
        <div className="App">
            {todoLists.map((tl: TodolistType) => {
                let filteredTasks = tasks[tl.id];
                if (tl.filter === 'active') {
                    filteredTasks = filteredTasks.filter((t: TaskType) => !t.isDone)
                }
                if (tl.filter === 'completed') {
                    filteredTasks = filteredTasks.filter((t: TaskType) => t.isDone)
                }

                return (
                    <Todolist key={tl.id}
                              id={tl.id}
                              title={tl.title}
                              tasks={filteredTasks}
                              addTask={addTask}
                              removeTask={removeTask}
                              changeFilter={changeFilter}
                              changeStatus={changeStatus}
                              deleteTodoList={deleteTodoList}
                              filter={tl.filter}/>
                )
            })}
        </div>
    );
}

export default App;
