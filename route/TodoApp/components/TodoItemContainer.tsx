import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import CheckBox from "../../../components/CheckBox";
import { BodyText } from "../../../components/StyleText";
import ITask from "../models/task.model";
import commonStyles from "../../../styles/commonStyles";
import { COLORS, FONT_WEIGHTS, SPACING } from "../../../utils/theme";
import Tag from "./Tag";

interface ITodoItemContainerProps {
  task: ITask;
  toggleCompleted: (id: number) => void;
}

function TodoItemContainer({ task, toggleCompleted }: ITodoItemContainerProps) {
  function _toggleCompleted() {
    toggleCompleted(task.id);
  }

  return (
    <Pressable onPress={_toggleCompleted} style={styles.todoInner}>
      <CheckBox
        checked={task.completed === 1}
        onPress={_toggleCompleted}
        containerStyle={{ paddingHorizontal: SPACING.md }}
      />
      <View
        style={[commonStyles.grow, { gap: SPACING.sm, flexDirection: "row" }]}
      >
        <BodyText
          style={[styles.todoTitle, task.completed ? styles.todoCompleted : {}]}
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
  );
}

export default TodoItemContainer;

const styles = StyleSheet.create({
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
