import React, { ChangeEvent, FC } from "react";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import { tasksActions } from "../../index";
import { TaskStatuses, TaskType } from "api/types";
import { useActions } from "utils/redux-utils";
import { Delete } from "@mui/icons-material";
import { Checkbox, IconButton } from "@mui/material";

type PropsType = {
  task: TaskType
  todolistId: string
}

export const Task: FC<PropsType> = React.memo(({task, todolistId}) => {
  const { updateTask, removeTask } = useActions(tasksActions);

  const removeTaskHandler = () => {
    removeTask({ taskId: task.id, todolistId: todolistId });
  };

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    updateTask({
      taskId: task.id,
      model: { status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New },
      todolistId: todolistId
    });
  }

  const changeTaskTitleHandler = (newValue: string) => {
    updateTask({
      taskId: task.id,
      model: { title: newValue },
      todolistId: todolistId
    });
  }

  return <div key={task.id} className={task.status === TaskStatuses.Completed ? "is-done" : ""}
              style={{ position: "relative" }}>
    <Checkbox
      checked={task.status === TaskStatuses.Completed}
      color="primary"
      onChange={changeTaskStatusHandler}
    />

    <EditableSpan value={task.title} onChange={changeTaskTitleHandler} />
    <IconButton size={"small"} onClick={removeTaskHandler} style={{ position: "absolute", top: "5px", right: "5px" }}>
      <Delete fontSize={"small"} />
    </IconButton>
  </div>;
});
