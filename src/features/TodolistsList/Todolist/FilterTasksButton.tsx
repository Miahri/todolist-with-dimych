import React, { FC, useCallback } from "react";
import { FilterValuesType, TodolistDomainType } from "features/TodolistsList/todolists-reducer";
import { Button } from "@mui/material";
import { useActions } from "utils/redux-utils";
import { todolistsActions } from "features/TodolistsList/index";

type PropsType = {
  todolist: TodolistDomainType
}

export const FilterTasksButton: FC<PropsType> = ({todolist}) => {
  const {changeTodolistFilter} = useActions(todolistsActions)

  const changeTodolistFilterHandler = useCallback((filter: FilterValuesType) => changeTodolistFilter({
    filter: filter,
    id: todolist.id
  }), [todolist.id])

  const renderFilterButton = (buttonFilter: FilterValuesType,
                              color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
                              text: string) => {
    return <Button variant={todolist.filter === buttonFilter ? 'outlined' : 'text'}
                   onClick={() => changeTodolistFilterHandler(buttonFilter)}
                   color={color}>{text}
    </Button>
  }

  return (
    <>
      {renderFilterButton("all", "info", "All")}
      {renderFilterButton("active", "primary", "Active")}
      {renderFilterButton("completed", "secondary", "Completed")}
    </>
  );
};