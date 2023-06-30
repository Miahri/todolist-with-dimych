import {useState} from "react";
import {todoListId1, todoListId2} from "../id-utils";
import {v1} from "uuid";
import {FilterType, TodolistDomainType} from "../../state/todolist-reducer";

export function useTodolists(onTodolistRemoved: (todolistID: string) => void,
                             onTodolistAdded: (todolistID: string) => void) {
    let [todoLists, setTodolist] = useState<Array<TodolistDomainType>>([
        {id: todoListId1, title: 'What to learn', addedDate: '', order: 0, filter: 'all', entityStatus: 'idle'},
        {id: todoListId2, title: 'What to buy', addedDate: '', order: 0, filter: 'all', entityStatus: 'idle'},
    ]);

    const changeFilter = (filter: FilterType, todoListId: string) => {
        setTodolist(todoLists.map((tl:TodolistDomainType) => tl.id === todoListId ? {...tl, filter: filter} : tl))
    }

    const onChangeTLTitle = (title: string, todoListId: string) => {
        setTodolist(todoLists.map((tl:TodolistDomainType) => tl.id === todoListId ? {...tl, title: title} : tl))
    }

    const deleteTodoList = (todoListId: string) => {
        let result = todoLists.filter((tl: TodolistDomainType) => todoListId !== tl.id);
        setTodolist(result);
        onTodolistRemoved(todoListId);
    }

    const addTodoList = (title: string) => {
        let newTList: TodolistDomainType = {id: v1(), title: title, addedDate: '', order: 0, filter: 'all', entityStatus: 'idle'};
        setTodolist([newTList, ...todoLists]);
        onTodolistAdded(newTList.id);
    }

    return {todoLists,
        setTodolist,
        changeFilter,
        onChangeTLTitle,
        deleteTodoList,
        addTodoList
    }
}