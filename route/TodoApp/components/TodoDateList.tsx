import React, { useState } from "react";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { CATEGORY_ORDER } from "../constants/constants";
import ITask from "../models/task.model";
import { Pressable, View } from "react-native";
import { COLORS, FONT_SIZES, ICON_SIZES, SPACING } from "../../../utils/theme";
import Icon from "../../../components/Icon";
import { Subheading } from "../../../components/StyleText";
import TodoList from "./TodoList";

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

  function getDateString(): string {
    const event = new Date();
    const dateString = event.toDateString();
    const a = dateString.split(" ");
    const result = a.slice(1, 3).reverse().join(" ");
    return result;
  }

  function toggleSection(category: string) {
    setExpandedSections((prev) => ({ ...prev, [category]: !prev[category] }));
  }

  function renderTaskList() {
    if (groupedTasks !== undefined) {
      return CATEGORY_ORDER.map((category, index) => {
        const tasks = groupedTasks[category];
        const disabled = tasks === undefined;
        const isLast = index === CATEGORY_ORDER.length - 1;
        const isExpanded = expandedSections[category];

        return (
          <View
            key={category}
            style={{
              borderBottomWidth: isLast ? 0 : 1,
              borderColor: COLORS.border,
            }}
          >
            <Pressable
              style={{
                flexDirection: "row",
                gap: SPACING.sm,
                padding: SPACING.sm,
              }}
              onPress={() => toggleSection(category)}
            >
              <Icon
                name={isExpanded ? "chevron-down" : "chevron-right"}
                size={disabled ? ICON_SIZES.xs : ICON_SIZES.sm}
                color={disabled ? COLORS.greyLight : COLORS.blackLight}
              />
              <Subheading
                style={
                  disabled
                    ? { color: COLORS.greyLight, fontSize: FONT_SIZES.sm }
                    : {}
                }
              >
                {category}
              </Subheading>
            </Pressable>
            {tasks && isExpanded && (
              <TodoList tasks={tasks} refreshTask={refreshTaskList} />
            )}
          </View>
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
