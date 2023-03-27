import {action} from '@storybook/addon-actions'
import {EditableSpan} from "../EditableSpan";

export default {
    title: 'TODOLIST/EditableSpan',
    component: EditableSpan
}

const callback = action("Text in form was changed")

export const EditableSpanExample = (props: any) => {
    return <EditableSpan title={"Start value"} onChange={callback}/>
}