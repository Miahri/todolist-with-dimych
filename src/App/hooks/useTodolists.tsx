import {useState} from "react";
import {todoListId1, todoListId2} from "../id-utils";
import {FilterType, TodolistType} from "../App";
import {v1} from "uuid";

export function useTodolists(onTodolistRemoved: (todolistID: string) => void,
                             onTodolistAdded: (todolistID: string) => void) {
    let [todoLists, setTodolist] = useState<Array<TodolistType>>([
        {id: todoListId1, title: 'What to learn', filter: 'all'},
        {id: todoListId2, title: 'What to buy', filter: 'all'},
    ]);

    const changeFilter = (filter: FilterType, todoListId: string) => {
        setTodolist(todoLists.map((tl:TodolistType) => tl.id === todoListId ? {...tl, filter: filter} : tl))
    }

    const onChangeTLTitle = (title: string, todoListId: string) => {
        setTodolist(todoLists.map((tl:TodolistType) => tl.id === todoListId ? {...tl, title: title} : tl))
    }

    const deleteTodoList = (todoListId: string) => {
        let result = todoLists.filter((tl: TodolistType) => todoListId !== tl.id);
        setTodolist(result);
        onTodolistRemoved(todoListId);
    }

    const addTodoList = (title: string) => {
        let newTList: TodolistType = {
            id: v1(),
            title: title,
            filter: 'all'
        };
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