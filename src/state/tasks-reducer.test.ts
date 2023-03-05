import {AllTasksType} from "../App";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./task-reducer";
import {addTodolistAC, removeTodolistAC} from "./todolist-reducer";

test('correct task should be deleted from correct array', () => {
    const startState: AllTasksType = {
        "todolist1": [
            {id: "1", title: "CSS", isDone: false},
            {id: "2", title: "JS", isDone: true},
            {id: "3", title: "React", isDone: false}
        ],
        "todolist2": [
            {id: "1", title: "bread", isDone: false},
            {id: "2", title: "milk", isDone: true},
            {id: "3", title: "tea", isDone: false}
        ],
    }

    const action = removeTaskAC("2", "todolist2");

    const endState = tasksReducer(startState, action);

    expect(endState["todolist1"].length).toBe(3);
    expect(endState["todolist2"].length).toBe(2);
    expect(endState["todolist2"].every(t => t.id !== "2")).toBeTruthy();

});

test('correct task should be added to correct array', () => {
    const startState: AllTasksType = {
        "todolist1": [
            {id: "1", title: "CSS", isDone: false},
            {id: "2", title: "JS", isDone: true},
            {id: "3", title: "React", isDone: false}
        ],
        "todolist2": [
            {id: "1", title: "bread", isDone: false},
            {id: "2", title: "milk", isDone: true},
            {id: "3", title: "tea", isDone: false}
        ],
    }

    const action = addTaskAC("juice", "todolist2");

    const endState = tasksReducer(startState, action);

    expect(endState["todolist1"].length).toBe(3);
    expect(endState["todolist2"].length).toBe(4);
    expect(endState["todolist2"][0].id).toBeDefined();
    expect(endState["todolist2"][0].title).toBe("juice");
    expect(endState["todolist2"][0].isDone).toBeFalsy();
});

test('status of specified task should be changed', () => {
    const startState: AllTasksType = {
        "todolist1": [
            {id: "1", title: "CSS", isDone: false},
            {id: "2", title: "JS", isDone: true},
            {id: "3", title: "React", isDone: false}
        ],
        "todolist2": [
            {id: "1", title: "bread", isDone: false},
            {id: "2", title: "milk", isDone: true},
            {id: "3", title: "tea", isDone: false}
        ],
    }

    const action = changeTaskStatusAC("2", false, "todolist2");

    const endState = tasksReducer(startState, action);

    expect(endState["todolist1"][1].isDone).toBeTruthy();
    expect(endState["todolist2"][1].isDone).toBeFalsy();

});

test('title of specified task should be changed', () => {
    const startState: AllTasksType = {
        "todolist1": [
            {id: "1", title: "CSS", isDone: false},
            {id: "2", title: "JS", isDone: true},
            {id: "3", title: "React", isDone: false}
        ],
        "todolist2": [
            {id: "1", title: "bread", isDone: false},
            {id: "2", title: "milk", isDone: true},
            {id: "3", title: "tea", isDone: false}
        ],
    }

    const action = changeTaskTitleAC("2", "Milkyway", "todolist2");

    const endState = tasksReducer(startState, action);

    expect(endState["todolist1"][1].title).toBe("JS");
    expect(endState["todolist2"][1].title).toBe("Milkyway");

});

test("new array should be added when new todolist added", () => {
    const startState: AllTasksType = {
        "todolist1": [
            {id: "1", title: "CSS", isDone: false},
            {id: "2", title: "JS", isDone: true},
            {id: "3", title: "React", isDone: false}
        ],
        "todolist2": [
            {id: "1", title: "bread", isDone: false},
            {id: "2", title: "milk", isDone: true},
            {id: "3", title: "tea", isDone: false}
        ],
    }

    const action = addTodolistAC("new todolist");
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolist1" && k != "todolist2");
    if(!newKey){
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test("property with todolist should be deleted", () => {
    const startState: AllTasksType = {
        "todolist1": [
            {id: "1", title: "CSS", isDone: false},
            {id: "2", title: "JS", isDone: true},
            {id: "3", title: "React", isDone: false}
        ],
        "todolist2": [
            {id: "1", title: "bread", isDone: false},
            {id: "2", title: "milk", isDone: true},
            {id: "3", title: "tea", isDone: false}
        ],
    }

    const action = removeTodolistAC("todolist1");
    const endState1 = tasksReducer(startState, action);

    const keys = Object.keys(endState1);

    expect(keys.length).toBe(1);
    expect(endState1["todolist1"]).not.toBeDefined();
})