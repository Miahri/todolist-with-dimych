import React, {ChangeEvent, useState} from "react";
import {TextField} from "@mui/material";

type EditableSpanProps = {
    title: string
    onChange: (title: string) => void
}

export const EditableSpan = React.memo((props: EditableSpanProps) => {
    let [editMode, setEditMode] = useState(false);
    let [inputValue, setValue] = useState('');

    const onDoubleClickHandler = () => {
        setEditMode(true);
        setValue(props.title);
    }

    const onBlurHandler = () => {
        setEditMode(false);
        props.onChange(inputValue);
        setValue('');
    }

    const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.value)

    return (
        !editMode
            ? <span onDoubleClick={onDoubleClickHandler}>{props.title}</span>
            : <TextField id="outlined-basic"
               value={inputValue}
               onChange={onTitleChange}
               onBlur={onBlurHandler}
               autoFocus
               variant="outlined" />
    )
})