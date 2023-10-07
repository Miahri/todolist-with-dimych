import React from 'react'
import {useSelector} from 'react-redux'
import {appActions} from '../../features/CommonActions/App'
import {AppRootStateType} from '../../utils/types'
import {useActions} from '../../utils/redux-utils'
import {Snackbar} from "@mui/material";
import MuiAlert, { AlertProps } from '@mui/material/Alert';

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

export function ErrorSnackbar() {
    //const [open, setOpen] = React.useState(true)
    const error = useSelector<AppRootStateType, string | null>(state => state.app.error);
    const {setAppError} = useActions(appActions)

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        setAppError({error: null});
    }


    const isOpen = error !== null;

    return (
        <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
                {error}
            </Alert>
        </Snackbar>
    )
}
