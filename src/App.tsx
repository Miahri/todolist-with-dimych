import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from "./Todolist";
import {v1} from "uuid";

export type FilterValuesType = "all" | "active" | "completed";

function App() {

    let [tasks, setTasks] = useState<Array<TaskType>>([
        {id: v1(), title: "CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "React", isDone: false},
        {id: v1(), title: "Redux", isDone: false},
    ]);

    let [filter, setFilter] = useState<FilterValuesType>("all")

    function removeTask(id: string) {
        let resultTasks = tasks.filter(t => t.id !== id);
        setTasks(resultTasks);
    }

    function addTask() {
        let newTask = {id: v1(), title: 'New Task', isDone: false};
        let newTasks = [newTask, ...tasks];
        setTasks(newTasks);
    }

    let filteredTasks = tasks;

    function changeFilter(value: FilterValuesType) {
        setFilter(value);
    }

    if (filter === "active") {
        filteredTasks = tasks.filter(t => t.isDone === false)
    }
    if (filter === "completed") {
        filteredTasks = tasks.filter(t => t.isDone === true)
    }

    return (
        <div className="App">
            <Todolist title="What to learn"
                      tasks={filteredTasks}
                      removeTask={removeTask}
                      changeFilter={changeFilter}
                      addTask={addTask}/>
        </div>
    );
}

export default App;
