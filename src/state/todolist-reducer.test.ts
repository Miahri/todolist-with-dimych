import {v1} from "uuid";
import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC, setTodolistsAC, TodolistDomainType,
    todolistReducer
} from "./todolist-reducer";
import {TodolistType} from "../todolists-api";

test('correct todolist should be removed', () => {
    let todoListId1 = v1();
    let todoListId2 = v1();

    let startState: Array<TodolistDomainType> = [
        {id: todoListId1, title: 'What to learn', addedDate: '', order: 0, filter: 'all'},
        {id: todoListId2, title: 'What to buy', addedDate: '', order: 0, filter: 'all'},
    ];

    const endState = todolistReducer(startState, removeTodolistAC(todoListId1));

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todoListId2);
})

test('correct todolist should be added', () => {
    let todoListId1 = v1();
    let todoListId2 = v1();

    let startState: Array<TodolistDomainType> = [
        {id: todoListId1, title: 'What to learn', addedDate: '', order: 0, filter: 'all'},
        {id: todoListId2, title: 'What to buy', addedDate: '', order: 0, filter: 'all'},
    ];

    const endState = todolistReducer(startState, addTodolistAC('Where to travel'));

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe('Where to travel');
})

test('correct todolist filter should be changed', () => {
    let todoListId1 = v1();
    let todoListId2 = v1();

    let startState: Array<TodolistDomainType> = [
        {id: todoListId1, title: 'What to learn', addedDate: '', order: 0, filter: 'all'},
        {id: todoListId2, title: 'What to buy', addedDate: '', order: 0, filter: 'all'},
    ];

    const endState = todolistReducer(startState, changeFilterAC(todoListId1, 'active'));

    expect(endState.length).toBe(2);
    expect(endState[0].filter).toBe('active');
})

test('correct todolist title should be changed', () => {
    let todoListId1 = v1();
    let todoListId2 = v1();

    let startState: Array<TodolistDomainType> = [
        {id: todoListId1, title: 'What to learn', addedDate: '', order: 0, filter: 'all'},
        {id: todoListId2, title: 'What to buy', addedDate: '', order: 0, filter: 'all'},
    ];

    const endState = todolistReducer(startState, changeTodolistTitleAC(todoListId2, 'Where to go'));

    expect(endState.length).toBe(2);
    expect(endState[1].title).toBe('Where to go');
})

test('correct todoLists should be set', () => {
    let todoListId1 = v1();
    let todoListId2 = v1();

    let startState: Array<TodolistType> = [
        {id: todoListId1, title: 'What to learn', addedDate: '', order: 0},
        {id: todoListId2, title: 'What to buy', addedDate: '', order: 0},
    ];

    const endState = todolistReducer([], setTodolistsAC(startState));

    expect(endState.length).toBe(2);
    expect(endState[1].title).toBe('What to buy');
})

