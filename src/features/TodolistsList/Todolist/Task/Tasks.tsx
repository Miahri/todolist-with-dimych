import React, { FC } from "react";
import { TaskStatuses, TaskType } from "api/types";
import { TodolistDomainType } from "features/TodolistsList/todolists-reducer";
import { Task } from "features/TodolistsList/Todolist/Task/Task";

type PropsType = {
  tasks: TaskType[]
  todolist: TodolistDomainType
}

export const Tasks: FC<PropsType> = ({tasks, todolist}) => {
  let tasksForTodolist = tasks

  if (todolist.filter === 'active') {
    tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
  }
  if (todolist.filter === 'completed') {
    tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
  }

  return (
    <>
      {
        tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={todolist.id}/>)
      }
      {!tasksForTodolist.length && <div style={{padding: '10px', color: 'grey'}}>No task</div>}
    </>
  );
};