import {appActions} from "features/CommonActions/App"
import axios, {AxiosError} from 'axios'
import {ResponseType} from 'api/types'
import { Dispatch } from "redux";

// original type:
// BaseThunkAPI<S, E, D extends Dispatch = Dispatch, RejectedValue = undefined>

export const handleAsyncServerAppError = <D>(data: ResponseType<D>,
                                             dispatch: Dispatch,
                                             showError = true) => {
    if (showError) {
        dispatch(appActions.setAppError({error: data.messages.length ? data.messages[0] : 'Some error occurred'}))
    }
    dispatch(appActions.setAppStatus({status: 'failed'}))
}

export const handleAsyncServerNetworkError = (error: unknown,
                                              dispatch: Dispatch,
                                              showError = true) => {
    let errorMessage = 'Some error occurred';
    if(axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error?.message || errorMessage;
    } else if(error instanceof Error) {
        errorMessage = `Native error: ${error.message}`;
    } else {
        errorMessage = JSON.stringify(error);
    }
    if (showError) {
        dispatch(appActions.setAppError({error: errorMessage}))
    }
    dispatch(appActions.setAppStatus({status: 'failed'}))
}
