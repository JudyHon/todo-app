import React from "react";
import { View, StyleSheet } from "react-native";
import ITask from "../models/task.model";

import { COLORS, SPACING } from "../../../utils/theme";
import Swipable from "./Swipable";
import TodoItemContainer from "./TodoItemContainer";
import { normalize } from "../../../utils/dimensionUtil";

interface ITaskProps {
  task: ITask;
  deleteTask: (id: number) => void;
  toggleCompleted: (id: number) => void;
}

function TodoItem(props: ITaskProps) {
  const { task } = props;

  function toggleCompleted(id: number) {
    props.toggleCompleted(id);
  }

  function deleteTask() {
    props.deleteTask(task.id);
  }

  const subtasks = task.subtasks;

  return (
    <Swipable onRemove={deleteTask}>
      <View style={styles.todoContainer}>
        <TodoItemContainer task={task} toggleCompleted={toggleCompleted} />
        {subtasks!.length > 0 && (
          <View style={styles.subtaskContainer}>
            {subtasks?.map((subtask) => (
              <TodoItemContainer
                key={subtask.id}
                task={subtask}
                toggleCompleted={toggleCompleted}
              />
            ))}
          </View>
        )}
      </View>
    </Swipable>
  );
}

const styles = StyleSheet.create({
  todoContainer: {
    width: "100%",
    minHeight: normalize(30),
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: COLORS.white,
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  subtaskContainer: {
    paddingLeft: SPACING.xl,
    width: "100%",
    gap: SPACING.sm,
  },
});

export default TodoItem;
