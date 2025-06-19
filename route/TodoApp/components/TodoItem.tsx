import React from "react";
import { View, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import ITodo from "../models/todo.model";

import { BodyText } from "../../../components/StyleText";
import { COLORS, FONT_WEIGHTS, SPACING } from "../../../utils/theme";
import CheckBox from "../../../components/CheckBox";
import Swipable from "./Swipable";
import Tag from "./Tag";
import commonStyles from "../../../styles/commonStyles";

interface ITodoProps {
  task: ITodo;
  deleteTask: (id: number) => void;
  toggleCompleted: (id: number) => void;
}

function TodoItem(props: ITodoProps) {
  const { task } = props;

  function toggleCompleted() {
    props.toggleCompleted(task.id);
  }

  function deleteTask() {
    props.deleteTask(task.id);
  }

  return (
    <Swipable onRemove={deleteTask}>
      <View style={styles.todoContainer}>
        <Pressable onPress={toggleCompleted} style={styles.todoInner}>
          <CheckBox checked={task.completed === 1} onPress={toggleCompleted} />
          <View style={[commonStyles.grow, { gap: SPACING.sm }]}>
            <BodyText
              style={[
                styles.todoTitle,
                task.completed ? styles.todoCompleted : {},
              ]}
            >
              {task.name}
            </BodyText>
            <View style={[commonStyles.row, { gap: SPACING.xs }]}>
              {task.tags?.map((value) => (
                <Tag
                  key={value.id}
                  tagId={value.id}
                  tagName={value.name}
                  color={value.color}
                  active={task.completed === 0}
                />
              ))}
            </View>
          </View>
        </Pressable>
      </View>
    </Swipable>
  );
}

const styles = StyleSheet.create({
  todoContainer: {
    width: "100%",
    minHeight: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
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
    alignItems: "flex-start",
  },
  todoCompleted: {
    color: COLORS.greyLight,
    textDecorationLine: "line-through",
  },
});

export default TodoItem;
