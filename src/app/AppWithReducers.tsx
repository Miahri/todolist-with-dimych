import React, {useReducer} from 'react';
import './App.css';
import {v1} from "uuid";
import {Todolist} from "../features/Todolists/Todolist";
import {AddItemForm} from "../components/AddItemForm/AddItemForm";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { makeStyles } from '@mui/styles';
import { createTheme, ThemeProvider, Theme} from '@mui/material/styles';
import {Menu} from "@mui/icons-material";
import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC, FilterType,
    removeTodolistAC, TodolistDomainType,
    todolistReducer
} from "../features/Todolists/todolist-reducer";
import {addTaskAC, updateTaskAC, removeTaskAC, tasksReducer} from "../features/Todolists/tasks-reducer";
import {TaskPriorities, TaskStatuses, TaskType} from "../api/todolists-api";

const theme = createTheme();

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,

    },
    menuButton: {
        marginRight: theme.spacing(2)
    }
}));

const Component = () => {
    const classes = useStyles();

    const addTask = (title: string, todoListId: string) => {
        const action = addTaskAC({id: v1(), title, status: TaskStatuses.New,
            todoListId, addedDate: '',
            order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''});
        dispatchToTasksReducer(action);
    }

    const addTodoList = (title: string) => {
        const action = addTodolistAC({id: v1(), title, addedDate: '', order: 0});
        dispatchToTasksReducer(action);
        dispatchToTodolistsReducer(action);
    }

    const removeTask = (id: string, todoListId: string) => {
        const action = removeTaskAC(id, todoListId);
        dispatchToTasksReducer(action);
    }

    const changeFilter = (filter: FilterType, todoListId: string) => {
        dispatchToTodolistsReducer(changeFilterAC(todoListId, filter));
    }

    const changeStatus = (id: string, status: TaskStatuses, todoListId: string) => {
        const action = updateTaskAC(id, {status}, todoListId);
        dispatchToTasksReducer(action);
    }

    const onChangeTaskTitle = (id: string, title: string, todoListId: string) => {
        dispatchToTasksReducer(updateTaskAC(id, {title}, todoListId));
    }

    const onChangeTLTitle = (title: string, todoListId: string) => {
        const action = changeTodolistTitleAC(todoListId, title);
        dispatchToTodolistsReducer(action);
    }

    const deleteTodoList = (todoListId: string) => {
        const action = removeTodolistAC(todoListId);
        dispatchToTasksReducer(action);
        dispatchToTodolistsReducer(action);
    }

    let todoListId1 = v1();
    let todoListId2 = v1();

    let [todoLists, dispatchToTodolistsReducer] = useReducer(todolistReducer, [
        {id: todoListId1, title: 'What to learn', addedDate: '', order: 0, filter: 'all'},
        {id: todoListId2, title: 'What to buy', addedDate: '', order: 0, filter: 'all'},
    ]);

    let [tasks, dispatchToTasksReducer] = useReducer(tasksReducer, {
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

    return (
        <div>
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                            <Menu />
                        </IconButton>
                        <Typography variant="h6" color="inherit">
                            Photos
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Container fixed>
                    <Grid container style={{padding: "20px"}}>
                        <AddItemForm addItem={addTodoList}/>
                    </Grid>
                    <Grid container spacing={10}>
                        {todoLists.map((tl: TodolistDomainType) => {
                            let filteredTasks = tasks[tl.id];
                            if (tl.filter === 'active') {
                                filteredTasks = filteredTasks.filter((t: TaskType) => t.status === TaskStatuses.New)
                            }
                            if (tl.filter === 'completed') {
                                filteredTasks = filteredTasks.filter((t: TaskType) => t.status !== TaskStatuses.New)
                            }

                            return (
                                <Grid item>
                                    <Paper style={{padding: "10px"}}>
                                        <Todolist key={tl.id}
                                                  id={tl.id}
                                                  title={tl.title}
                                                  tasks={filteredTasks}
                                                  addTask={addTask}
                                                  removeTask={removeTask}
                                                  changeFilter={changeFilter}
                                                  changeStatus={changeStatus}
                                                  onChangeTaskTitle={onChangeTaskTitle}
                                                  onChangeTLTitle={onChangeTLTitle}
                                                  deleteTodoList={deleteTodoList}
                                                  filter={tl.filter}/>
                                    </Paper>
                                </Grid>
                            )
                        })}
                    </Grid>
                </Container>
            </div>
        </div>
    );
}

export function AppWithReducers() {
    return <ThemeProvider theme={theme}><Component /></ThemeProvider>
}



