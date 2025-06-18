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
import {
  createDBTable,
  deleteDBItem,
  getDBConnection,
  getDBItems,
  saveDBItems,
} from "../../utils/db-service";
import ITodo from "./models/todo.model";
import { getData, storeData } from "../../utils/stoageHelper";
import TodoEditModal from "./TodoEditModal";
import Button from "../../components/Button";

const HAS_LAUNCHED = "HAS_LAUNCHED";

const defaultTasks = [
  { id: 2, text: "Meeting at School", completed: 0 },
  { id: 1, text: "Doctor Appointment", completed: 1 },
];

function TodoApp() {
  // Check Todo Database
  const checkLaunchedCallback = useCallback(async function () {
    try {
      const hasLaunched = await getData(HAS_LAUNCHED); // Check if it is the first app launch
      const db = await getDBConnection();

      if (hasLaunched) {
        // Get the saved data
        const storedTodoItems = await getDBItems(db);
        setTasks(storedTodoItems);
      } else {
        await createDBTable(db); // Create the new database
        await saveDBItems(db, defaultTasks); // Show the default data
        setTasks(defaultTasks);
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

  // === Control Tasks ===
  async function addTask(text: string) {
    try {
      const newTasks = [{ id: Date.now(), text, completed: 0 }, ...tasks];
      setTasks(newTasks);

      const db = await getDBConnection();
      await saveDBItems(db, newTasks);
    } catch (error) {
      console.error(error);
    }
  }

  async function toggleCallback(newTasks: ITodo[]) {
    try {
      const db = await getDBConnection();
      await saveDBItems(db, newTasks);
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteCallback(deletedTaskId: number) {
    try {
      const db = await getDBConnection();
      await deleteDBItem(db, deletedTaskId);
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
      {showEdit && (
        <TodoEditModal
          isVisible={showEdit}
          onClose={closeEdit}
          onSave={addTask}
        />
      )}
      <View
        style={{ flexDirection: "row", gap: SPACING.sm, padding: SPACING.sm }}
      >
        <Heading>TODAY</Heading>
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
