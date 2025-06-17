import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import TodoItem from "./TodoItem";
import ITodo from "../models/todo.model";

interface ITodoListProps {
  tasks: Array<ITodo>;
  setTasks: (task: Array<ITodo>) => void;
  deleteCallback?: (id: number) => void;
  toggleCallback?: (tasks: Array<ITodo>) => void;
}

function TodoList({
  tasks,
  setTasks,
  deleteCallback,
  toggleCallback,
}: ITodoListProps) {
  // Function to Delete Task
  function deleteTask(id: number) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    if (deleteCallback) deleteCallback(id);
  }
  // Function to Toggle Task Completion
  function toggleCompleted(id: number) {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: task.completed ? 0 : 1 } : task
    );
    setTasks(newTasks);
    if (toggleCallback) toggleCallback(newTasks);
  }

  return (
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
  );
}

const styles = StyleSheet.create({
  todoListContainer: {
    flex: 1,
  },
});

export default TodoList;
