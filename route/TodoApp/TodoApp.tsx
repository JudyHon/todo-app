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

import ITodo from "./models/todo.model";
import { getData, storeData } from "../../utils/stoageHelper";
import TodoEditModal from "./TodoEditModal";
import Button from "../../components/Button";
import {
  createTables,
  deleteTables,
  deleteTask,
  getAllTasks,
  getLastInsertTaskId,
  getTaskById,
  saveTasks,
} from "../../utils/db-service/db-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllItems } from "../../utils/db-service/db-service-tasks";

const HAS_LAUNCHED = "HAS_LAUNCHED";

const defaultTasks = [
  { id: 1, name: "Doctor Appointment", completed: 1 },
  { id: 2, name: "Meeting at School", completed: 0 },
];

const DEFAULT_TAGS = [
  { name: "Health", color: "blue" },
  { name: "Work", color: "green" },
  { name: "Mental Health", color: "purple" },
  { name: "Others", color: "grey" },
];

const testData = Array.from({ length: 15 }, (_: string, i: number) => {
  const value = i + 1;
  return { id: value, name: value.toString(), completed: value % 2 };
});

function TodoApp() {
  // Check Todo Database
  const checkLaunchedCallback = useCallback(async function () {
    try {
      const hasLaunched = await getData(HAS_LAUNCHED); // Check if it is the first app launch

      if (hasLaunched) {
        // Get the saved data
        const storedTodoItems = await getAllTasks();
        setTasks(storedTodoItems);
      } else {
        await createTables(); // Create the new database
        await saveTasks(defaultTasks); // Show the default data
        await refreshTaskList();
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
  const [tasks, setTasks] = useState<ITodo[]>([]);

  async function refreshTaskList(): Promise<void> {
    const newTasks = await getAllTasks();
    setTasks(newTasks);
  }

  // === Control Tasks ===
  async function addTask(name: string) {
    try {
      const new_id = (await getLastInsertTaskId()) + 1;
      const newTask = [{ id: new_id, name, completed: 0 }];

      await saveTasks(newTask);
      await refreshTaskList();
    } catch (error) {
      console.error(error);
    }
  }

  async function toggleCallback(id: number) {
    try {
      const toggledTask = await getTaskById(id);
      if (toggledTask) {
        const newTask = {
          ...toggledTask,
          completed: toggledTask.completed ? 0 : 1,
        };
        await saveTasks([newTask]);
        await refreshTaskList();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteCallback(id: number) {
    try {
      await deleteTask(id);
      await refreshTaskList();
    } catch (error) {
      console.error(error);
    }
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
            onSave={addTask}
          />
        )}
        <Heading>Today</Heading>
        <Heading
          style={{ color: COLORS.grey, fontWeight: FONT_WEIGHTS.medium }}
        >
          {getDateString()}
        </Heading>
      </View>
      <TodoList
        tasks={tasks}
        setTasks={setTasks}
        toggleCallback={toggleCallback}
        deleteCallback={deleteCallback}
      />
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
