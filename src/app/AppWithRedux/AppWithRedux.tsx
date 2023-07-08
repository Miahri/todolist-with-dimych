import React, {useEffect} from 'react';
import '../App.css';
import Container from "@mui/material/Container";
import {makeStyles} from '@mui/styles';
import {createTheme, ThemeProvider, Theme} from '@mui/material/styles';
import {ErrorSnackbar} from "../../components/ErrorSnackBar/ErrorSnackBar";
import TodolistList from "../../features/Todolists/TodolistList";
import ButtonAppBar from "../../components/ButtonAppBar/ButtonAppBar";
import {Login} from "../../features/Login/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import {AppRootState, useAppDispatch} from "../store";
import {useSelector} from "react-redux";
import {initializeAppTC} from "../../features/Login/auth-reducer";
import {CircularProgress} from "@mui/material";

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

    const isInitialized = useSelector<AppRootState, boolean>(state => state.auth.isInitialized);
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(initializeAppTC())
    },[])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    const classes = useStyles();

    return (
        <div>
            <div className={classes.root}>
                <ErrorSnackbar/>
                <ButtonAppBar style={classes.menuButton}/>
                <Container fixed>
                    <Routes>
                        <Route path={'/'} element={<TodolistList demo={demo}/>}/>
                        <Route path={'/login'} element={<Login/>}/>
                        <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>}/>
                        <Route path='*' element={<Navigate to={'/404'}/>}/>
                    </Routes>
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

