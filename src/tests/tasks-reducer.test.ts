import {AllTasksType} from "app/App/App";
import {
    addTaskTC,
    fetchTasksTC, removeTaskTC,
    tasksReducer, updateTaskTC
} from "features/Todolists/tasks-reducer";
import {addTodolistTC, deleteTodolistTC} from "features/Todolists/todolist-reducer";
import {TaskPriorities, TaskStatuses} from "api/todolists-api";
import {v1} from "uuid";

let startState: AllTasksType;

beforeEach(() => {
    startState = {
        "todolist1": [
            {id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolist1", addedDate: '',
                order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''},
            {id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolist1", addedDate: '',
                order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''},
            {id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolist1", addedDate: '',
                order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''}
        ],
        "todolist2": [
            {id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolist2", addedDate: '',
                order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''},
            {id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolist2", addedDate: '',
                order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''},
            {id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolist2", addedDate: '',
                order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''}
        ],
    }
})

test('correct task should be deleted from correct array', () => {
    const action = removeTaskTC.fulfilled({taskId: "2", todolistId: "todolist2"}, 'requestId', {taskId: "2", todolistId: "todolist2"});

    const endState = tasksReducer(startState, action);

    expect(endState["todolist1"].length).toBe(3);
    expect(endState["todolist2"].length).toBe(2);
    expect(endState["todolist2"].every(t => t.id !== "2")).toBeTruthy();

});

test('correct task should be added to correct array', () => {
    const task = {id: v1(), title: 'juice', status: TaskStatuses.New,
        todoListId: "todolist2", addedDate: '',
        order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''}
    const action = addTaskTC.fulfilled({task}, 'requestId', {title: task.title, todolistId: task.todoListId});

    const endState = tasksReducer(startState, action);

    expect(endState["todolist1"].length).toBe(3);
    expect(endState["todolist2"].length).toBe(4);
    expect(endState["todolist2"][0].id).toBeDefined();
    expect(endState["todolist2"][0].title).toBe("juice");
    expect(endState["todolist2"][0].status).toBe(TaskStatuses.New);
});

test('status of specified task should be changed', () => {
    const param = {taskId: "2", domainModel: {status: TaskStatuses.New}, todolistId: "todolist2"}
    const action = updateTaskTC.fulfilled(param, 'requestId', param);

    const endState = tasksReducer(startState, action);

    expect(endState["todolist1"][1].status).toBe(TaskStatuses.Completed);
    expect(endState["todolist2"][1].status).toBe(TaskStatuses.New);

});

test('title of specified task should be changed', () => {
    const param = {taskId: "2", domainModel: {title: "Milkyway"}, todolistId: "todolist2"}
    const action = updateTaskTC.fulfilled(param, 'requestId', param);

    const endState = tasksReducer(startState, action);

    expect(endState["todolist1"][1].title).toBe("JS");
    expect(endState["todolist2"][1].title).toBe("Milkyway");

});

test("new array should be added when new todolist added", () => {
    const param = {todolist: {id: v1(), title: 'new todolist', addedDate: '', order: 0}};
    const action = addTodolistTC.fulfilled(param, 'requestId', param.todolist.title);
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolist1" && k != "todolist2");
    if(!newKey){
        throw Error("new key should be added");
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test("property with todolist should be deleted", () => {
    const action = deleteTodolistTC.fulfilled({id: "todolist1"}, 'requestId', {todoListId: "todolist1"});
    const endState1 = tasksReducer(startState, action);

    const keys = Object.keys(endState1);

    expect(keys.length).toBe(1);
    expect(endState1["todolist1"]).not.toBeDefined();
})

test("new array should be added when new todolist added", () => {
    const action = fetchTasksTC.fulfilled({tasks: startState["todolist1"], todolistId: "todolist1"}, 'requestId', 'todolist1');
    const endState = tasksReducer({}, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(2);
    expect(endState["todolist1"].length).toBe(3);
});