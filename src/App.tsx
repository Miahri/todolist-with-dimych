import React, {useState} from 'react';
import './App.css';
import {v1} from "uuid";
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

function App() {
    const classes = useStyles();

    const addTask = (title: string, todoListId: string) => {
        let newTask: TaskType = {id: v1(), title: title, isDone: false};
        let result = tasks[todoListId];
        tasks[todoListId] = [newTask, ...result];
        setTasks({...tasks});
    }

    const addTodoList = (title: string) => {
        let newTList: TodolistType = {
            id: v1(),
            title: title,
            filter: 'all'
        };
        setTodolist([newTList, ...todoLists]);
        setTasks({[newTList.id]: [], ...tasks});
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

    const onChangeTaskTitle = (id: string, title: string, todoListId: string) => {
        tasks[todoListId] = tasks[todoListId].map((t:TaskType) => t.id === id ? {...t, title: title} : t);
        setTasks({...tasks});
    }

    const onChangeTLTitle = (title: string, todoListId: string) => {
        setTodolist(todoLists.map((tl:TodolistType) => tl.id === todoListId ? {...tl, title: title} : tl))
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
        {id: todoListId1, title: 'What to learn', filter: 'all'},
        {id: todoListId2, title: 'What to buy', filter: 'all'},
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

export default App;
