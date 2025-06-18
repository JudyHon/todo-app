import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import ITodo from "../models/todo.model";

import Icon from "../../../components/Icon";
import { BodyText } from "../../../components/StyleText";
import {
  COLORS,
  FONT_WEIGHTS,
  ICON_SIZES,
  SPACING,
} from "../../../utils/theme";
import CheckBox from "../../../components/CheckBox";

interface ITodoProps {
  task: ITodo;
  deleteTask: (id: number) => void;
  toggleCompleted: (id: number) => void;
}

function TodoItem(props: ITodoProps) {
  const { task, deleteTask, toggleCompleted } = props;
  return (
    <View style={styles.todoContainer}>
      <TouchableOpacity
        onPress={() => toggleCompleted(task.id)}
        style={styles.todoInner}
      >
        <CheckBox
          checked={task.completed === 1}
          onPress={() => toggleCompleted(task.id)}
        />
        <BodyText
          style={[styles.todoTitle, task.completed ? styles.todoCompleted : {}]}
        >
          {task.text}
        </BodyText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTask(task.id)}>
        <Icon name="trash-2" size={ICON_SIZES.sm} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  todoContainer: {
    width: "100%",
    minHeight: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  todoTitle: {
    flex: 1,
    color: COLORS.black,
    fontWeight: FONT_WEIGHTS.medium,
  },
  todoInner: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todoCompleted: {
    color: COLORS.greyLight,
    textDecorationLine: "line-through",
  },
});

export default TodoItem;
