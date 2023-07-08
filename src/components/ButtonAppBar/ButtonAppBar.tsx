import React from 'react';
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import {Menu} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import AppBar from "@mui/material/AppBar";
import {useSelector} from "react-redux";
import {AppRootState, useAppDispatch} from "../../app/store";
import {RequestStatusType} from "../../app/app-reducer";
import {logoutTC} from "../../features/Login/auth-reducer";
import Button from "@mui/material/Button";

export const ButtonAppBar = (props: any) => {

    const status = useSelector<AppRootState, RequestStatusType>(state => state.app.status);
    const isLoggedIn = useSelector<AppRootState, boolean>(state => state.auth.isLoggedIn);
    const dispatch = useAppDispatch()

    const logOutHandler = () => {
        debugger
        dispatch(logoutTC())
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <IconButton edge="start" className={props.style} color="inherit" aria-label="menu">
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
        </>
    );
};

export default ButtonAppBar;