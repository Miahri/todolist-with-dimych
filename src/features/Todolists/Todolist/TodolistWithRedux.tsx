import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from "components/AddItemForm/AddItemForm";
import {EditableSpan} from "components/EditableSpan/EditableSpan";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Delete } from "@mui/icons-material";
import {useSelector} from "react-redux";
import {AppRootState, useAppDispatch} from "app/store";
import {
    addTaskTC, fetchTasksTC,
    removeTaskTC, updateTaskTC
} from "../tasks-reducer";
import {Task} from "./Task/Task";
import {FilterType, TodolistDomainType} from "../todolist-reducer";
import {TaskStatuses, TaskType} from "api/todolists-api";

type TodolistPropsType = {
    todolist: TodolistDomainType
    changeFilter: (filter: FilterType, todoListId: string) => void
    onChangeTLTitle: (title: string, todoListId: string) => void
    deleteTodoList: (todoListId: string) => void
    demo?: boolean
}

export const TodolistWithRedux = React.memo((props: TodolistPropsType) => {
    const tasks = useSelector<AppRootState, Array<TaskType>>(state => state.tasks[props.todolist.id]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (props.demo){
            return;
        }
        dispatch(fetchTasksTC(props.todolist.id));
    }, []);

    let filteredTasks = tasks;
    if (props.todolist.filter === 'active') {
        filteredTasks = filteredTasks.filter((t: TaskType) => t.status === TaskStatuses.New)
    }
    if (props.todolist.filter === 'completed') {
        filteredTasks = filteredTasks.filter((t: TaskType) => t.status !== TaskStatuses.New)
    }

    const removeTask = useCallback((taskId: string, todolistId: string) => {
        dispatch(removeTaskTC({taskId, todolistId}));
    }, [dispatch])

    const changeStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => {
        dispatch(updateTaskTC({taskId: id, domainModel: {status}, todolistId}));
    }, [dispatch])

    const onChangeTaskTitle = useCallback((id: string, title: string, todolistId: string) => {
        dispatch(updateTaskTC({taskId: id, domainModel: {title}, todolistId}));
    }, [dispatch])

    const addTask = useCallback((title: string) => {
        dispatch(addTaskTC({title, todolistId: props.todolist.id}))
    }, []);

    const changeFilter = useCallback((filter: FilterType) => {
        props.changeFilter(filter, props.todolist.id);
    }, [props.changeFilter, props.todolist.id])

    const deleteTodoList = useCallback(() => {
        props.deleteTodoList(props.todolist.id)
    }, [props.deleteTodoList, props.todolist.id]);

    const onChangeTLTitle = useCallback((title: string) => {
        props.onChangeTLTitle(title, props.todolist.id)
    }, [props.onChangeTLTitle, props.todolist.id])

    return (
        <div>
            <h3><EditableSpan title={props.todolist.title} onChange={onChangeTLTitle}/></h3>
            <IconButton onClick={deleteTodoList}
                        disabled={props.todolist.entityStatus === 'loading'}>
                <Delete />
            </IconButton>
            <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === 'loading'}/>
            <div>
                <ul>
                    {filteredTasks.map((t: TaskType) => {
                        return <Task
                            key={t.id}
                            todolistId={props.todolist.id}
                            task={t}
                            changeStatus={changeStatus}
                            onChangeTaskTitle={onChangeTaskTitle}
                            removeTask={removeTask}
                        />
                    })}
                </ul>
            </div>
            <div>
                <Button variant={props.todolist.filter === 'all' ? 'contained' : 'text'}
                        onClick={() => changeFilter('all')}>All
                </Button>
                <Button variant={props.todolist.filter === 'active' ? 'contained' : 'text'}
                        color={"primary"}
                        onClick={() => changeFilter('active')}>Active
                </Button>
                <Button variant={props.todolist.filter === 'completed' ? 'contained' : 'text'}
                        color={'secondary'}
                        onClick={() => changeFilter('completed')}>Completed
                </Button>
            </div>
        </div>
    )
});