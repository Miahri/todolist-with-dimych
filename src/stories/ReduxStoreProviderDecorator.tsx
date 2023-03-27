import {Provider} from "react-redux";
import {combineReducers, createStore} from "redux";
import {tasksReducer} from "../state/tasks-reducer";
import {todoListId1, todoListId2, todolistReducer} from "../state/todolist-reducer";
import {v1} from "uuid";
import {AppRootState} from "../state/store";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistReducer
});

const initialGlobalState = {
    todolists: [
        {id: todoListId1, title: 'What to learn', filter: 'all'},
        {id: todoListId2, title: 'What to buy', filter: 'all'},
    ],
    tasks: {
        [todoListId1]: [
            {id: v1(), title: 'HTML', isDone: true},
            {id: v1(), title: 'CSS', isDone: true},
            {id: v1(), title: 'React', isDone: false},
            {id: v1(), title: 'Redux', isDone: false},
        ],
        [todoListId2]: [
            {id: v1(), title: 'Milk', isDone: true},
            {id: v1(), title: 'Book', isDone: false},
        ]
    }
}

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootState);

export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}>storyFn()</Provider>
}