import React from 'react';
import '../App.css';
import {TodolistWithRedux} from "../TodolistWithRedux";
import {AddItemForm} from "../AddItemForm/AddItemForm";
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
import {useAppWithRedux} from "./hooks/useAppWithRedux";

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
    const {
        todoLists,
        addTodoList,
        changeFilter,
        onChangeTLTitle,
        deleteTodoList
    } = useAppWithRedux();

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
