import {ResponseType} from "../api/todolists-api";
import {setErrorAC, setStatusAC} from "../app/app-reducer";
import {Dispatch} from "redux";

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
    if(data.messages.length) {
        dispatch(setErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setErrorAC({error: 'Some error occurred'}));
    }
    dispatch(setStatusAC({status: 'failed'}));
}

export const handleServerNetworkError = (error: {message: string}, dispatch: Dispatch) => {
    dispatch(setErrorAC({error: error.message ? error.message : 'Some error occurred'}));
    dispatch(setStatusAC({status: 'failed'}));
}