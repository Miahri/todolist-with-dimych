import React from 'react';
import './App.css';
import {TaskType, Todolist} from "./Todolist";
import {AddItemForm} from "./AddItemForm";
import {
    AppBar,
    Container,
    createStyles,
    Grid,
    IconButton,
    makeStyles,
    Paper,
    Theme,
    Toolbar,
    Typography
} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC
} from "./state/todolist-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "./state/store";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
    }),
);

export type FilterType = 'all' | 'active' | 'completed'

export type TodolistType = {
    id: string
    title: string
    filter: FilterType
}

export type AllTasksType = {
    [key: string]: Array<TaskType>
}

function AppWithRedux() {
    const classes = useStyles();

    const dispatch = useDispatch();
    const todoLists = useSelector<AppRootState, Array<TodolistType>>(state => state.todolists);
    const tasks = useSelector<AppRootState, AllTasksType>(state => state.tasks);

    const addTask = (title: string, todoListId: string) => {
        const action = addTaskAC(title, todoListId);
        dispatch(action);
    }

    const addTodoList = (title: string) => {
        const action = addTodolistAC(title);
        dispatch(action);
    }

    const removeTask = (id: string, todoListId: string) => {
        const action = removeTaskAC(id, todoListId);
        dispatch(action);
    }

    const changeFilter = (filter: FilterType, todoListId: string) => {
        dispatch(changeFilterAC(todoListId, filter));
    }

    const changeStatus = (id: string, status: boolean, todoListId: string) => {
        const action = changeTaskStatusAC(id, status, todoListId);
        dispatch(action);
    }

    const onChangeTaskTitle = (id: string, title: string, todoListId: string) => {
        dispatch(changeTaskTitleAC(id, title, todoListId));
    }

    const onChangeTLTitle = (title: string, todoListId: string) => {
        const action = changeTodolistTitleAC(todoListId, title);
        dispatch(action);
    }

    const deleteTodoList = (todoListId: string) => {
        const action = removeTodolistAC(todoListId);
        dispatch(action);
    }

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
};

export default AppWithRedux;
