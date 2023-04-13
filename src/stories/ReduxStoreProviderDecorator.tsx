import {Provider} from "react-redux";
import {combineReducers, createStore} from "redux";
import {tasksReducer} from "../state/tasks-reducer";
import {todolistReducer} from "../state/todolist-reducer";
import {v1} from "uuid";
import {AppRootState} from "../state/store";
import {TaskPriorities, TaskStatuses} from "../todolists-api";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistReducer
});

const initialGlobalState = {
    todolists: [
        {id: "todoListId1", title: 'What to learn', addedDate: '', order: 0, filter: 'all'},
        {id: "todoListId2", title: 'What to buy', addedDate: '', order: 0, filter: 'all'},
    ],
    tasks: {
        ["todoListId1"]: [
            {id: v1(), title: 'HTML', status: TaskStatuses.Completed, todoListId: "todoListId1", addedDate: '',
                order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''},
            {id: v1(), title: 'CSS', status: TaskStatuses.Completed, todoListId: "todoListId1", addedDate: '',
                order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''},
            {id: v1(), title: 'React', status: TaskStatuses.New, todoListId: "todoListId1", addedDate: '',
                order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''},
            {id: v1(), title: 'Redux', status: TaskStatuses.New, todoListId: "todoListId1", addedDate: '',
                order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''},
        ],
        ["todoListId2"]: [
            {id: v1(), title: 'Milk', status: TaskStatuses.Completed, todoListId: "todoListId2", addedDate: '',
                order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''},
            {id: v1(), title: 'Book', status: TaskStatuses.New, todoListId: "todoListId2", addedDate: '',
                order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''},
        ]
    }
}

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootState);

export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}