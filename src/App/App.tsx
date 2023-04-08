import React from 'react';
import '../App.css';
import {v1} from "uuid";
import {TaskType, Todolist} from "../Todolist";
import {AddItemForm} from "../AddItemForm";
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
import {todoListId1, todoListId2} from "./id-utils";
import {useTasks} from "./hooks/useTasks";
import {useTodolists} from "./hooks/useTodolists";

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

export type AllTasksType = {
    [key: string]: Array<TaskType>
}

export function App() {
    return <ThemeProvider theme={theme}><Component /></ThemeProvider>
}

const Component = () => {
    const {
        tasks,
        addTask,
        removeTask,
        changeStatus,
        onChangeTaskTitle,
        completelyRemoveTasksForTodolist,
        addStateForNewTodolist
    } = useTasks();
    const {
        todoLists,
        changeFilter,
        onChangeTLTitle,
        deleteTodoList,
        addTodoList
    } = useTodolists(completelyRemoveTasksForTodolist, addStateForNewTodolist);

    const classes = useStyles();

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
