import React, {useCallback, useEffect} from 'react'
import './App.css'
import {TodolistsList} from "features/TodolistsList"
import {ErrorSnackbar} from "components/ErrorSnackbar/ErrorSnackbar"
import {useSelector} from 'react-redux'
import {appActions} from "features/Application"
import {Route, Routes} from 'react-router-dom'
import {authActions, Login} from "features/Auth"
import {selectIsInitialized, selectStatus} from "features/Application/selectors"
import {authSelectors} from '../features/Auth'
import {useActions} from "utils/redux-utils"
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from "@mui/material";
import {Menu} from "@mui/icons-material";

type PropsType = {
    demo?: boolean
}

function App({demo = false}: PropsType) {
    const status = useSelector(selectStatus)
    const isInitialized = useSelector(selectIsInitialized)
    const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn)

    const {logout} = useActions(authActions)
    const {initializeApp} = useActions(appActions)

    useEffect(() => {
        if (!demo) {
            initializeApp()
        }
    }, [])

    const logoutHandler = useCallback(() => {
        logout()
    }, [])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
            <div>
                <ErrorSnackbar/>
                <AppBar position="static">
                    <Toolbar className='toolbar'>
                        <>
                            <IconButton edge="start" color="inherit" aria-label="menu">
                                <Menu/>
                            </IconButton>
                            <Typography variant="h6">
                                Tasks
                            </Typography>
                        </>
                        {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
                    </Toolbar>
                    {status === 'loading' && <LinearProgress/>}
                </AppBar>
                <Container fixed>
                    <Routes>
                        <Route path={'/'} element={<TodolistsList demo={demo}/>}/>
                        <Route path={'/login'} element={<Login/>}/>
                    </Routes>

                </Container>
            </div>
    )
}

export default App
