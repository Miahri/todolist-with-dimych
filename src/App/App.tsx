import React from 'react';
import '../App.css';
import {Todolist} from "../Todolists/Todolist";
import {AddItemForm} from "../AddItemForm/AddItemForm";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {makeStyles} from '@mui/styles';
import {createTheme, Theme, ThemeProvider} from '@mui/material/styles';
import {useTasks} from "./hooks/useTasks";
import {useTodolists} from "./hooks/useTodolists";
import {TodolistDomainType} from "../state/todolist-reducer";
import {TaskStatuses, TaskType} from "../todolists-api";
import {Menu} from "@mui/icons-material";

const theme = createTheme();

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,

    },
    menuButton: {
        marginRight: theme.spacing(2)
    }
}));

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
