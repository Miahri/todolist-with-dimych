import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from "./Todolist";

export type FilterValuesType = "all" | "active" | "completed";

function App() {

    let [tasks, setTasks] = useState<Array<TaskType>>([
        {id: 1, title: "CSS", isDone: true},
        {id: 2, title: "JS", isDone: true},
        {id: 3, title: "React", isDone: false},
        {id: 4, title: "Redux", isDone: false},
    ]);

    let [filter, setFilter] = useState<FilterValuesType>("all")

    function removeTask(id: number) {
        let resultTasks = tasks.filter(t => t.id !== id);
        setTasks(resultTasks);
    }

    let filteredTasks = tasks;
    function changeFilter(value: FilterValuesType) {
        setFilter(value);
    }

    if(filter === "active") {
        filteredTasks = tasks.filter(t => t.isDone === false)
    }
    if(filter === "completed") {
        filteredTasks = tasks.filter(t => t.isDone === true)
    }

    return (
        <div className="App">
            <Todolist title="What to learn"
                      tasks={filteredTasks}
                      removeTask={removeTask}
                      changeFilter={changeFilter}/>
        </div>
    );
}

export default App;
