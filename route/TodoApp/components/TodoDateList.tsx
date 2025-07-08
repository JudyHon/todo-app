import React, { useState } from "react";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { CATEGORY_ORDER } from "../constants/constants";
import ITask from "../models/task.model";
import { Pressable, StyleSheet } from "react-native";
import {
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  ICON_SIZES,
  SPACING,
} from "../../../utils/theme";
import Icon from "../../../components/Icon";
import { BodyText, Subheading } from "../../../components/StyleText";
import TodoList from "./TodoList";
import Animated, {
  LinearTransition,
  StretchOutY,
} from "react-native-reanimated";

interface ITodoDateListProps {
  groupedTasks: Record<string, ITask[]>;
  refreshTaskList: () => void;
}

function TodoDateList({ groupedTasks, refreshTaskList }: ITodoDateListProps) {
  const initialExpandnedState = Object.fromEntries(
    CATEGORY_ORDER.map((category) => [category, true])
  );

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(initialExpandnedState);

  function toggleSection(category: string) {
    setExpandedSections((prev) => ({ ...prev, [category]: !prev[category] }));
  }

  function renderTaskList() {
    if (groupedTasks !== undefined) {
      return CATEGORY_ORDER.map((category, index) => {
        const tasks = groupedTasks[category]; // Get tasks
        const disabled = tasks === undefined; // Check if tasks is null
        const isLast = index === CATEGORY_ORDER.length - 1;
        const isExpanded = expandedSections[category];
        const incompletedTaskLength = tasks?.filter(
          (task) => !task.completed
        ).length;

        return (
          <Animated.View
            layout={LinearTransition.duration(300)}
            exiting={StretchOutY.duration(50)}
            key={category}
            style={{
              borderBottomWidth: isLast ? 0 : 1,
              borderColor: COLORS.border,
              paddingVertical:
                disabled || !isExpanded ? SPACING.xs : SPACING.sm,
            }}
          >
            <Pressable
              style={styles.section}
              onPress={() => toggleSection(category)}
            >
              <Icon
                name={isExpanded ? "chevron-down" : "chevron-right"}
                size={disabled ? ICON_SIZES.xs : ICON_SIZES.sm}
                color={disabled ? COLORS.greyLight : COLORS.blackLight}
              />
              <Subheading
                style={disabled ? styles.disabledTitle : styles.title}
              >
                {category}
              </Subheading>
              <BodyText style={styles.countText}>
                {!disabled && `${incompletedTaskLength}`}
              </BodyText>
            </Pressable>
            {tasks && isExpanded && (
              <TodoList tasks={tasks} refreshTask={refreshTaskList} />
            )}
          </Animated.View>
        );
      });
    }
  }

  return (
    <GestureHandlerRootView>
      <ScrollView>{renderTaskList()}</ScrollView>
    </GestureHandlerRootView>
  );
}

export default TodoDateList;

const styles = StyleSheet.create({
  section: {
    flexDirection: "row",
    gap: SPACING.sm,
    padding: SPACING.sm,
    alignItems: "center",
  },
  title: { fontWeight: FONT_WEIGHTS.bold },
  disabledTitle: { color: COLORS.greyLight, fontSize: FONT_SIZES.sm },
  countText: { fontSize: FONT_SIZES.sm },
});
