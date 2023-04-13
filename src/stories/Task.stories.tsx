import {action} from '@storybook/addon-actions'
import {Task} from "../Task";
import {TaskPriorities, TaskStatuses} from "../todolists-api";

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
                 task={{id: '1', title: "JS", status: TaskStatuses.New, todoListId: "todolistId1", addedDate: '',
                     order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''}}
                 changeStatus={changeStatusCallback}
                 onChangeTaskTitle={onChangeTaskTitleCallback}
                 removeTask={removeTaskCallback}/>
        <Task todolistId={"todolistId2"}
              task={{id: '2', title: "CSS", status: TaskStatuses.Completed, todoListId: "todolistId2", addedDate: '',
                  order: 0, description: '', priority: TaskPriorities.Low, startDate: '', deadline: ''}}
              changeStatus={changeStatusCallback}
              onChangeTaskTitle={onChangeTaskTitleCallback}
              removeTask={removeTaskCallback}/>
    </>
}