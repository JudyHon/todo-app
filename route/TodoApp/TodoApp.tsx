import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform, View } from "react-native";
import TodoList from "./components/TodoList";
import { Heading } from "../../components/StyleText";
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
import { getAllTasks } from "../../utils/db-service/db-service";
import * as taskHelper from "./utils/taskHelper";

const HAS_LAUNCHED = "HAS_LAUNCHED";

function TodoApp() {
  // Check Todo Database
  const checkLaunchedCallback = useCallback(async function () {
    try {
      const hasLaunched = await getData(HAS_LAUNCHED); // Check if it is the first app launch

      if (
        // false &&
        hasLaunched
      ) {
        // Get the saved data
        await refreshTaskList();
      } else {
        await taskHelper.initData();
        await storeData(HAS_LAUNCHED, "true");
      }
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

  async function refreshTaskList(): Promise<void> {
    const newTasks = await getAllTasks();
    setTasks(newTasks);
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.todoListContainer}
    >
      <View
        style={{ flexDirection: "row", gap: SPACING.sm, padding: SPACING.sm }}
      >
        {showEdit && (
          <TodoEditModal
            isVisible={showEdit}
            onClose={closeEdit}
            refreshTask={refreshTaskList}
          />
        )}
        <Heading>Today</Heading>
        <Heading
          style={{ color: COLORS.grey, fontWeight: FONT_WEIGHTS.medium }}
        >
          {getDateString()}
        </Heading>
      </View>
      <TodoList tasks={tasks} refreshTask={refreshTaskList} />
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
