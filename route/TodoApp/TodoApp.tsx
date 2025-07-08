import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
} from "react-native";
import TodoList from "./components/TodoList";
import { Heading, Subheading } from "../../components/StyleText";
import commonStyles from "../../styles/commonStyles";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_WEIGHTS,
  SPACING,
} from "../../utils/theme";

import ITask from "./models/task.model";
import { getData, storeData } from "../../utils/stoageHelper";
import TodoEditModal from "./TodoEditModal";
import Button from "../../components/Button";
import {
  getAllTasks,
  getAllTasksByDate,
} from "../../utils/db-service/db-service";
import * as taskHelper from "./utils/taskHelper";
import { CATEGORY_ORDER } from "./constants/constants";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";

const HAS_LAUNCHED = "HAS_LAUNCHED";

function TodoApp() {
  // Check Todo Database
  const checkLaunchedCallback = useCallback(async function () {
    try {
      const hasLaunched = await getData(HAS_LAUNCHED); // Check if it is the first app launch

      if (
        // true ||
        !hasLaunched
      ) {
        await taskHelper.initData();
        await storeData(HAS_LAUNCHED, "true");
      }

      // Get the saved data
      await refreshTaskList();
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(
    function () {
      checkLaunchedCallback();
    },
    [checkLaunchedCallback]
  );

  // State Hooks
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [groupedTasks, setGroupedTasks] = useState<Record<string, ITask[]>>();

  async function refreshTaskList(): Promise<void> {
    const newTasks = await getAllTasks();
    const newGroupedTasks = await getAllTasksByDate();
    setTasks(newTasks);
    setGroupedTasks(newGroupedTasks);
  }

  const [showEdit, setShowEdit] = useState<boolean>(false);
  function openEdit() {
    setShowEdit(true);
  }
  function closeEdit() {
    setShowEdit(false);
  }

  function getDateString(): string {
    const event = new Date();
    const dateString = event.toDateString();
    const a = dateString.split(" ");
    const result = a.slice(1, 3).reverse().join(" ");
    return result;
  }

  function renderTaskList() {
    if (groupedTasks !== undefined) {
      return CATEGORY_ORDER.map((category) => {
        const tasks = groupedTasks[category];
        return (
          <View key={category}>
            <View
              style={{
                flexDirection: "row",
                gap: SPACING.sm,
                padding: SPACING.sm,
              }}
            >
              <Subheading>{category}</Subheading>
            </View>
            <View style={{ flex: 1 }}>
              {tasks && (
                <TodoList tasks={tasks} refreshTask={refreshTaskList} />
              )}
            </View>
          </View>
        );
      });
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.todoListContainer}
    >
      <View>
        {showEdit && (
          <TodoEditModal
            isVisible={showEdit}
            onClose={closeEdit}
            refreshTask={refreshTaskList}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: SPACING.sm,
          padding: SPACING.sm,
          justifyContent: "center",
        }}
      >
        <Subheading>ALL TASKS</Subheading>
      </View>
      <View style={commonStyles.grow}>
        <GestureHandlerRootView>
          <ScrollView>{renderTaskList()}</ScrollView>
        </GestureHandlerRootView>
        {/* <View
          style={{ flexDirection: "row", gap: SPACING.sm, padding: SPACING.sm }}
        >
          <Subheading>Today</Subheading>
          <Subheading
            style={{ color: COLORS.grey, fontWeight: FONT_WEIGHTS.medium }}
          >
            {getDateString()}
          </Subheading>
        </View> */}
        <TodoList tasks={tasks} refreshTask={refreshTaskList} />
      </View>
      <Button
        containerStyle={commonStyles.alignEnd}
        onPress={openEdit}
        icon="plus"
        color={COLORS.blackLight}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  todoListContainer: {
    height: "100%",
    width: "100%",
    padding: 20,
  },

  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 2,
    borderColor: "#ddd",
  },
});

export default TodoApp;
