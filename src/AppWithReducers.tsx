import React, {useReducer} from 'react';
import './App.css';
import {v1} from "uuid";
import {TaskType, Todolist} from "./Todolist";
import {AddItemForm} from "./AddItemForm";
import {
    AppBar,
    Container,
    Grid,
    IconButton,
    Paper,
    Toolbar,
    Typography
} from "@mui/material";
import { makeStyles } from '@mui/styles';
import { createTheme, ThemeProvider, Theme} from '@mui/material/styles';
import {Menu} from "@mui/icons-material";
import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistReducer
} from "./state/todolist-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";

const theme = createTheme();

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,

    },
    menuButton: {
        marginRight: theme.spacing(2)
    }
}));

export type FilterType = 'all' | 'active' | 'completed'

export type TodolistType = {
    id: string
    title: string
    filter: FilterType
}

const Component = () => {
    const classes = useStyles();

    const addTask = (title: string, todoListId: string) => {
        const action = addTaskAC(title, todoListId);
        dispatchToTasksReducer(action);
    }

    const addTodoList = (title: string) => {
        const action = addTodolistAC(title);
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

    const changeStatus = (id: string, status: boolean, todoListId: string) => {
        const action = changeTaskStatusAC(id, status, todoListId);
        dispatchToTasksReducer(action);
    }

    const onChangeTaskTitle = (id: string, title: string, todoListId: string) => {
        dispatchToTasksReducer(changeTaskTitleAC(id, title, todoListId));
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
        {id: todoListId1, title: 'What to learn', filter: 'all'},
        {id: todoListId2, title: 'What to buy', filter: 'all'},
    ]);

    let [tasks, dispatchToTasksReducer] = useReducer(tasksReducer, {
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
                        {todoLists.map((tl: TodolistType) => {
                            let filteredTasks = tasks[tl.id];
                            if (tl.filter === 'active') {
                                filteredTasks = filteredTasks.filter((t: TaskType) => !t.isDone)
                            }
                            if (tl.filter === 'completed') {
                                filteredTasks = filteredTasks.filter((t: TaskType) => t.isDone)
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



