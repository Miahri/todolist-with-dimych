import {action} from '@storybook/addon-actions'
import {Task} from "../Task";

export default {
    title: 'TODOLIST/Task',
    component: Task
}

const changeStatusCallback = action("Status was changed");
const onChangeTaskTitleCallback = action("Title was changed");
const removeTaskCallback = action("Task was removed");

export const TaskExample = (props: any) => {
    return <>
        <Task todolistId={"todolistId1"}
                 task={{id: '1', title: "JS", isDone: false}}
                 changeStatus={changeStatusCallback}
                 onChangeTaskTitle={onChangeTaskTitleCallback}
                 removeTask={removeTaskCallback}/>
        <Task todolistId={"todolistId2"}
              task={{id: '2', title: "CSS", isDone: true}}
              changeStatus={changeStatusCallback}
              onChangeTaskTitle={onChangeTaskTitleCallback}
              removeTask={removeTaskCallback}/>
    </>
}