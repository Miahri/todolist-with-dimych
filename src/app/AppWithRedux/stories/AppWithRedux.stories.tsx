import {AppWithRedux} from "../AppWithRedux";
import {BrowserRouterDecorator, ReduxStoreProviderDecorator} from "./ReduxStoreProviderDecorator";

export default {
    title: 'TODOLIST/app',
    component: AppWithRedux,
    decorators: [ReduxStoreProviderDecorator, BrowserRouterDecorator]
}

export const AppWithReduxExample = () => {
    return <AppWithRedux demo={true}/>
}