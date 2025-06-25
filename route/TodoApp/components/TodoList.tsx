import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import TodoItem from "./TodoItem";
import ITask from "../models/task.model";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as taskHelper from "../utils/taskHelper";

interface ITodoListProps {
  tasks: Array<ITask>;
  refreshTask: () => void;
}

function TodoList({ tasks, refreshTask }: ITodoListProps) {
  // Function to Delete Task
  function deleteTask(id: number) {
    taskHelper.deleteTask(id, refreshTask);
  }
  // Function to Toggle Task Completion
  function toggleCompleted(id: number) {
    taskHelper.toggleTask(id, refreshTask);
  }

  return (
    <GestureHandlerRootView>
      <ScrollView style={styles.todoListContainer}>
        {tasks.map((task) => (
          <TodoItem
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            toggleCompleted={toggleCompleted}
          />
        ))}
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  todoListContainer: {
    flex: 1,
  },
});

export default TodoList;
