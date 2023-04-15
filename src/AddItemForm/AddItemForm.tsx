import React from "react";
import {useAddItemForm} from "./hooks/useAddItemForm";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

type AddItemFormProps = {
    addItem: (title: string) => void
}

export const AddItemForm = React.memo((props: AddItemFormProps) => {
    const {
        inputValue,
        error,
        addTask,
        inputValueChange,
        keyPressHandler
    } = useAddItemForm(props.addItem);

    return(
        <div>
            <TextField
                id="outlined-error-helper-text"
                error={!!error}
                value={inputValue}
                onChange={inputValueChange}
                onKeyPress={keyPressHandler}
                helperText={error}
                variant="outlined"
            />
            <Button variant="contained" color="primary" onClick={addTask}>+</Button>
        </div>
    )
})

/*
<input value={inputValue}
       className={error ? 'error' : ''}/>*/
