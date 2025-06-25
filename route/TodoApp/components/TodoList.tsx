import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import TodoItem from "./TodoItem";
import ITask from "../models/task.model";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface ITodoListProps {
  tasks: Array<ITask>;
  setTasks: (task: Array<ITask>) => void;
  deleteCallback?: (id: number) => void;
  toggleCallback?: (id: number) => void;
}

function TodoList({ tasks, deleteCallback, toggleCallback }: ITodoListProps) {
  // Function to Delete Task
  function deleteTask(id: number) {
    if (deleteCallback) deleteCallback(id);
  }
  // Function to Toggle Task Completion
  function toggleCompleted(id: number) {
    if (toggleCallback) toggleCallback(id);
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
