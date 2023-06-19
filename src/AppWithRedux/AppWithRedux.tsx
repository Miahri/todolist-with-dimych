import React, {useEffect} from 'react';
import '../App.css';
import {TodolistWithRedux} from "../Todolists/TodolistWithRedux";
import {AddItemForm} from "../AddItemForm/AddItemForm";
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
import {useAppWithRedux} from "./hooks/useAppWithRedux";
import {fetchTodolistsTC, TodolistDomainType} from "../state/todolist-reducer";
import {useAppDispatch} from "../state/store";

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
    const {
        todoLists,
        addTodoList,
        changeFilter,
        onChangeTLTitle,
        deleteTodoList
    } = useAppWithRedux();

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, [])

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
                            return (
                                <Grid item>
                                    <Paper style={{padding: "10px"}}>
                                        <TodolistWithRedux key={tl.id}
                                                           id={tl.id}
                                                           title={tl.title}
                                                           changeFilter={changeFilter}
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

export function AppWithRedux() {
    return <ThemeProvider theme={theme}><Component /></ThemeProvider>
}
