import {ChangeEvent, KeyboardEvent, useState} from "react";

export function useAddItemForm(addItem: (text: string) => void) {
    const [inputValue, setValue] = useState('');
    const [error, setError] = useState<null | string>(null);

    const addTask = () => {
        if (inputValue.trim() === '') {
            setError('Title is required')
        } else {
            addItem(inputValue.trim());
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
                addItem(inputValue.trim());
                setValue('');
            }
        }
    }

    return {
        inputValue,
        error,
        addTask,
        inputValueChange,
        keyPressHandler
    }
}