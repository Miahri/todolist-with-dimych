import {AllTasksType} from "app/App/App";
import {
    addTodolistTC,
    fetchTodolistsTC,
    TodolistDomainType,
    todolistReducer
} from "features/Todolists/todolist-reducer";
import {tasksReducer} from "features/Todolists/tasks-reducer";
import {TodolistType} from "api/todolists-api";
import {v1} from "uuid";

test("ids should be equal", () => {
    const startTasksState: AllTasksType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];

    const param = {todolist: {id: v1(), title: "new todolist", addedDate: '', order: 0}};
    const action = addTodolistTC.fulfilled(param, 'requestId', param.todolist.title);
    const endTasksState = tasksReducer(startTasksState, action);
    const endTodolistsState = todolistReducer(startTodolistsState, action);

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});

test("empty arrays should be added when we set todoLists", () => {
    let startState: Array<TodolistType> = [
        {id: "todoListId1", title: 'What to learn', addedDate: '', order: 0},
        {id: "todoListId2", title: 'What to buy', addedDate: '', order: 0},
    ];

    const action = fetchTodolistsTC.fulfilled({todolists: startState}, 'requestId');
    const endTasksState = tasksReducer({}, action);

    const keys = Object.keys(endTasksState);

    expect(keys.length).toBe(2);
    expect(endTasksState['todoListId1']).toStrictEqual([]);
    expect(endTasksState['todoListId2']).toStrictEqual([]);
})