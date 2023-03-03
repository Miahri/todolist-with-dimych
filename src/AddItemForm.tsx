import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {Button, TextField} from "@material-ui/core";

type AddItemFormProps = {
    addItem: (title: string) => void
}

export const AddItemForm = (props: AddItemFormProps) => {
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
                value={inputValue}
                onChange={inputValueChange}
                onKeyPress={keyPressHandler}
                helperText={error}
                variant="outlined"
            />
            <Button variant="contained" color="primary" onClick={addTask}>+</Button>
        </div>
    )
}

/*
<input value={inputValue}
       className={error ? 'error' : ''}/>*/
