import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {Button, TextField} from "@mui/material";

type AddItemFormProps = {
    addItem: (title: string) => void
}

export const AddItemForm = React.memo((props: AddItemFormProps) => {
    const [inputValue, setValue] = useState('');
    const [error, setError] = useState<null | string>(null);

    const addTask = () => {
        if (inputValue.trim() === '') {
            setError('Title is required')
        } else {
            props.addItem(inputValue.trim());
            setValue('');
        }
    };
    const inputValueChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.value);
    const keyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if(error !== null) {
            setError(null);
        }
        if (e.code === 'Enter') {
            if (inputValue.trim() === '') {
                setError('Title is required');
            } else {
                props.addItem(inputValue.trim());
                setValue('');
            }
        }
    }

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
