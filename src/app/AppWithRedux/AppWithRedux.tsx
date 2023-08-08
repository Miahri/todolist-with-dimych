import React, {useEffect} from 'react';
import '../App.css';
import Container from "@mui/material/Container";
import {makeStyles} from '@mui/styles';
import {createTheme, ThemeProvider, Theme} from '@mui/material/styles';
import {ErrorSnackbar} from "components/ErrorSnackBar/ErrorSnackBar";
import TodolistList from "../../features/Todolists/TodolistList";
import {Login} from "features/Login/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import {AppRootState, useAppDispatch} from "../store";
import {useSelector} from "react-redux";
import {initializeAppTC, logoutTC} from "features/Login/auth-reducer";
import {CircularProgress} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import {Menu} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import AppBar from "@mui/material/AppBar";
import {RequestStatusType} from "../app-reducer";

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

    const status = useSelector<AppRootState, RequestStatusType>(state => state.app.status);
    const isLoggedIn = useSelector<AppRootState, boolean>(state => state.auth.isLoggedIn);
    const isInitialized = useSelector<AppRootState, boolean>(state => state.auth.isInitialized);
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!demo) {
            dispatch(initializeAppTC())
        }
    },[]);

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    const logOutHandler = () => {
        debugger
        dispatch(logoutTC())
    }

    return (
        <div>
            <div className={classes.root}>
                <ErrorSnackbar/>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6" color="inherit">
                            Photos
                        </Typography>
                        {isLoggedIn
                            ? <Button color="inherit" onClick={logOutHandler}>Logout</Button>
                            : <Button color="inherit">Login</Button>
                        }
                    </Toolbar>
                    {status === 'loading' && <LinearProgress color='secondary'/>}
                </AppBar>
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

/*
import axios from 'axios'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client';
import { Provider, TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux';
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';

// Types
type CommentType = {
    postId: string
    id: string
    name: string
    email: string
    body: string
}

// Api
const instance = axios.create({baseURL: 'https://exams-frontend.kimitsu.it-incubator.ru/api/'})

const commentsAPI = {
    getComments() {
        return instance.get<CommentType[]>('comments')
    }
}

// Reducer
const initState = [] as CommentType[]

type InitStateType = typeof initState

const commentsReducer = (state: InitStateType = initState, action: ActionsType): InitStateType => {
    switch (action.type) {
        case 'COMMENTS/GET-COMMENTS':
            return action.comments
        default:
            return state
    }
}

const getCommentsAC = (comments: CommentType[]) => ({type: 'COMMENTS/GET-COMMENTS', comments} as const)
type ActionsType = ReturnType<typeof getCommentsAC>

const getCommentsTC = (): ThunkAction<void, RootState, unknown, ActionsType> => (dispatch) => {
    commentsAPI.getComments()
        .then((res) => {
            dispatch(getCommentsAC(res.data))
        })
}


// Store
const rootReducer = combineReducers({
    comments: commentsReducer,
})

const store = createStore(rootReducer, applyMiddleware(thunk))
type RootState = ReturnType<typeof store.getState>
type AppDispatch = ThunkDispatch<RootState, unknown, ActionsType>
const useAppDispatch = () => useDispatch<AppDispatch>()
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// App
export const App = () => {

    const comments = useAppSelector(state => state.comments)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getCommentsTC())
    }, [])

    return (
        <>
            <h1>📝 Список комментариев</h1>
            {
                comments.map(c => {
                    return <div key={c.id}><b>Comment</b>: {c.body} </div>
                })
            }
        </>
    )
}


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Provider store={store}> <App/></Provider>)

// 📜 Описание:
// Ваша задача стоит в том чтобы правильно передать нужные типы в дженериковый тип ThunkAction<any, any, any, any>.
// Что нужно написать вместо any, any, any, any чтобы правильно типизировать thunk creator?
// Ответ дайте через пробел

// 🖥 Пример ответа: unknown status isDone void*/
