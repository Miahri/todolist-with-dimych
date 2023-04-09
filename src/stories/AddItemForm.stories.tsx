import {AddItemForm} from "../AddItemForm/AddItemForm";
import {action} from '@storybook/addon-actions'

export default {
    title: 'TODOLIST/AddItemForm',
    component: AddItemForm
}

const callback = action("Button 'add' was clicked inside the form")

export const AddItemFormExample = (props: any) => {
    return <AddItemForm addItem={callback} />
}