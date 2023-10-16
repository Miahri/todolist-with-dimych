import {store} from 'app/store'

// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatchType = typeof store.dispatch