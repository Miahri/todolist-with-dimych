import React, {ChangeEvent, useState} from "react";

type EditableSpanProps = {
    title: string
    onChange: (title: string) => void
}

export const EditableSpan = (props: EditableSpanProps) => {
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
            : <input value={inputValue}
                     onChange={onTitleChange}
                     onBlur={onBlurHandler}
                     autoFocus/>
    )
}