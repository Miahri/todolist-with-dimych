import React from 'react';
import '../App.css';
import Container from "@mui/material/Container";
import {makeStyles} from '@mui/styles';
import {createTheme, ThemeProvider, Theme} from '@mui/material/styles';
import {ErrorSnackbar} from "../../components/ErrorSnackBar/ErrorSnackBar";
import TodolistList from "../../features/Todolists/TodolistList";
import ButtonAppBar from "../../components/ButtonAppBar/ButtonAppBar";
import {Login} from "../../features/Login/Login";

const theme = createTheme();

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2)
    }
}));

const Component: React.FC<AppWithReduxPropsType> = ({demo = false}) => {

    const classes = useStyles();

    return (
        <div>
            <div className={classes.root}>
                <ErrorSnackbar/>
                <ButtonAppBar style={classes.menuButton}/>
                <Container fixed>
                    <TodolistList demo={demo}/>
                    <Login />
                </Container>
            </div>
        </div>
    );
}

export const AppWithRedux: React.FC<AppWithReduxPropsType> = ({demo = false}) => {
    return <ThemeProvider theme={theme}><Component demo={demo}/></ThemeProvider>
}

type AppWithReduxPropsType = {
    demo?: boolean
}

