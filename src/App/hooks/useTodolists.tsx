import {useState} from "react";
import {todoListId1, todoListId2} from "../id-utils";
import {TodolistType} from "../App";

export function useTodolists() {
    let [todoLists, setTodolist] = useState<Array<TodolistType>>([
        {id: todoListId1, title: 'What to learn', filter: 'all'},
        {id: todoListId2, title: 'What to buy', filter: 'all'},
    ]);

    return [todoLists, setTodolist] as const
}