import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform, View } from "react-native";
import { Subheading } from "../../components/StyleText";
import commonStyles from "../../styles/commonStyles";
import { BORDER_RADIUS, COLORS, SPACING } from "../../utils/theme";

import ITask from "./models/task.model";
import { getData, storeData } from "../../utils/stoageHelper";
import TodoEditModal from "./TodoEditModal";
import Button from "../../components/Button";
import { getAllTasksByDate } from "../../utils/db-service/db-service";
import * as taskHelper from "./utils/taskHelper";

import TodoDateList from "./components/TodoDateList";

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
  const [groupedTasks, setGroupedTasks] = useState<Record<string, ITask[]>>({});

  async function refreshTaskList(): Promise<void> {
    const newGroupedTasks = await getAllTasksByDate();
    setGroupedTasks(newGroupedTasks);
  }

  const [showEdit, setShowEdit] = useState<boolean>(false);
  function openEdit() {
    setShowEdit(true);
  }
  function closeEdit() {
    setShowEdit(false);
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
        <TodoDateList
          groupedTasks={groupedTasks}
          refreshTaskList={refreshTaskList}
        />
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
