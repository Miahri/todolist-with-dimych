import {useCallback} from "react";
import {useSelector} from "react-redux";
import {AppRootState, useAppDispatch} from "app/store";
import {
  addTodolistTC,
  changeFilterAC,
  changeTodolistTitleTC, deleteTodolistTC,
  FilterType,
  TodolistDomainType
} from "features/Todolists/todolist-reducer";

export function useAppWithRedux() {
  const dispatch = useAppDispatch();
  const todoLists = useSelector<AppRootState, Array<TodolistDomainType>>(state => state.todolists);

  const addTodoList = useCallback((title: string) => {
    dispatch(addTodolistTC(title));
  }, [dispatch]);

  const changeFilter = useCallback((filter: FilterType, todoListId: string) => {
    dispatch(changeFilterAC({id: todoListId, filter}));
  }, [dispatch])

  const onChangeTLTitle = useCallback((title: string, todoListId: string) => {
    dispatch(changeTodolistTitleTC({id: todoListId, title}));
  }, [dispatch])

  const deleteTodoList = useCallback((todoListId: string) => {
    dispatch(deleteTodolistTC({todoListId}));
  }, [dispatch])


  return {
    todoLists,
    addTodoList,
    changeFilter,
    onChangeTLTitle,
    deleteTodoList
  }
}