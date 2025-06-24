import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import ITodo from "../models/todo.model";

import { BodyText } from "../../../components/StyleText";
import { COLORS, FONT_WEIGHTS, SPACING } from "../../../utils/theme";
import CheckBox from "../../../components/CheckBox";
import Swipable from "./Swipable";
import Tag from "./Tag";
import commonStyles from "../../../styles/commonStyles";
import TodoItemContainer from "./TodoItemContainer";

interface ITodoProps {
  task: ITodo;
  deleteTask: (id: number) => void;
  toggleCompleted: (id: number) => void;
}

function TodoItem(props: ITodoProps) {
  const { task } = props;

  function toggleCompleted(id: number) {
    props.toggleCompleted(id);
  }

  function deleteTask() {
    props.deleteTask(task.id);
  }

  return (
    <Swipable onRemove={deleteTask}>
      <View style={styles.todoContainer}>
        <TodoItemContainer task={task} toggleCompleted={toggleCompleted} />
        <View style={styles.subtaskContainer}>
          {task.subtasks?.map((subtask) => (
            <TodoItemContainer
              key={subtask.id}
              task={subtask}
              toggleCompleted={toggleCompleted}
            />
          ))}
        </View>
      </View>
    </Swipable>
  );
}

const styles = StyleSheet.create({
  todoContainer: {
    width: "100%",
    minHeight: 30,
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    gap: SPACING.md,
  },
  subtaskContainer: {
    paddingLeft: SPACING.xl,
    width: "100%",
    gap: SPACING.md,
  },
});

export default TodoItem;
