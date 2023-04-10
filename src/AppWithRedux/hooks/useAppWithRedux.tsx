import {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "../../state/store";
import {addTodolistAC, changeFilterAC, changeTodolistTitleAC, removeTodolistAC} from "../../state/todolist-reducer";
import {FilterType, TodolistType} from "../AppWithRedux";

export function useAppWithRedux() {
    const dispatch = useDispatch();
    const todoLists = useSelector<AppRootState, Array<TodolistType>>(state => state.todolists);

    const addTodoList = useCallback((title: string) => {
        const action = addTodolistAC(title);
        dispatch(action);
    }, [dispatch]);

    const changeFilter = useCallback((filter: FilterType, todoListId: string) => {
        dispatch(changeFilterAC(todoListId, filter));
    }, [dispatch])

    const onChangeTLTitle = useCallback((title: string, todoListId: string) => {
        const action = changeTodolistTitleAC(todoListId, title);
        dispatch(action);
    }, [dispatch])

    const deleteTodoList = useCallback((todoListId: string) => {
        const action = removeTodolistAC(todoListId);
        dispatch(action);
    }, [dispatch])


    return {
        todoLists,
        addTodoList,
        changeFilter,
        onChangeTLTitle,
        deleteTodoList
    }
}