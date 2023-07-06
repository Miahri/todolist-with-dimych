import React from 'react';
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import {Menu} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import AppBar from "@mui/material/AppBar";
import {useSelector} from "react-redux";
import {AppRootState} from "../../app/store";
import {RequestStatusType} from "../../app/app-reducer";

export const ButtonAppBar = (props: any) => {

    const status = useSelector<AppRootState, RequestStatusType>(state => state.app.status)

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
                </Toolbar>
                {status === 'loading' && <LinearProgress color='secondary'/>}
            </AppBar>
        </>
    );
};

export default ButtonAppBar;