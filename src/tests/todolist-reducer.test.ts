import {v1} from "uuid";
import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC, setTodolistsAC, TodolistDomainType,
    todolistReducer
} from "../features/Todolists/todolist-reducer";

let startState: Array<TodolistDomainType>;
let todoListId1: string;
let todoListId2: string

beforeEach(() => {
    todoListId1 = v1();
    todoListId2 = v1();

    startState = [
        {id: todoListId1, title: 'What to learn', addedDate: '', order: 0, filter: 'all', entityStatus: 'idle'},
        {id: todoListId2, title: 'What to buy', addedDate: '', order: 0, filter: 'all', entityStatus: 'idle'},
    ];
})

test('correct todolist should be removed', () => {
    const endState = todolistReducer(startState, removeTodolistAC(todoListId1));

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todoListId2);
})

test('correct todolist should be added', () => {
    const endState = todolistReducer(startState, addTodolistAC({id: todoListId1,
        title: 'Where to travel', addedDate: '', order: 0}));

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe('Where to travel');
})

test('correct todolist filter should be changed', () => {
    const endState = todolistReducer(startState, changeFilterAC(todoListId1, 'active'));

    expect(endState.length).toBe(2);
    expect(endState[0].filter).toBe('active');
})

test('correct todolist title should be changed', () => {
    const endState = todolistReducer(startState, changeTodolistTitleAC(todoListId2, 'Where to go'));

    expect(endState.length).toBe(2);
    expect(endState[1].title).toBe('Where to go');
})

test('correct todoLists should be set', () => {
    const endState = todolistReducer([], setTodolistsAC(startState));

    expect(endState.length).toBe(2);
    expect(endState[1].title).toBe('What to buy');
})

