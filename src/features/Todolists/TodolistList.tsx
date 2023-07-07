import React, {useEffect} from 'react';
import Grid from "@mui/material/Grid";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {fetchTodolistsTC, TodolistDomainType} from "./todolist-reducer";
import Paper from "@mui/material/Paper";
import {TodolistWithRedux} from "./Todolist/TodolistWithRedux";
import {useAppWithRedux} from "../../app/AppWithRedux/hooks/useAppWithRedux";
import {useAppDispatch} from "../../app/store";

export const TodolistList = ({demo = false}) => {
    const {
        todoLists,
        addTodoList,
        changeFilter,
        onChangeTLTitle,
        deleteTodoList
    } = useAppWithRedux();

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, [])

    return (
        <>
            <Grid container style={{padding: "20px"}}>
                <AddItemForm addItem={addTodoList}/>
            </Grid>
            <Grid container spacing={10}>
                {todoLists.map((tl: TodolistDomainType) => {
                    return (
                        <Grid item>
                            <Paper style={{padding: "10px"}}>
                                <TodolistWithRedux key={tl.id}
                                                   todolist={tl}
                                                   changeFilter={changeFilter}
                                                   onChangeTLTitle={onChangeTLTitle}
                                                   deleteTodoList={deleteTodoList}
                                                   demo={demo}/>
                            </Paper>
                        </Grid>
                    )
                })}
            </Grid>
        </>
    );
};

export default TodolistList;