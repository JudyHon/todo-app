import React from "react";
import { StyleSheet, View } from "react-native";
import TodoItem from "./TodoItem";
import ITask from "../models/task.model";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as taskHelper from "../utils/taskHelper";
import { COLORS } from "../../../utils/theme";
import Animated, {
  LinearTransition,
  StretchOutY,
} from "react-native-reanimated";

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
      <View style={styles.todoListContainer}>
        {tasks.map((task, index) => (
          <View key={task.id}>
            <TodoItem
              task={task}
              deleteTask={deleteTask}
              toggleCompleted={toggleCompleted}
            />
            {index !== tasks.length - 1 && (
              <Animated.View
                layout={LinearTransition.duration(300)}
                exiting={StretchOutY.duration(50)}
              >
                <View style={styles.border} />
              </Animated.View>
            )}
          </View>
        ))}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  todoListContainer: {
    flex: 1,
  },
  border: {
    borderBottomWidth: 1,
    width: "90%",
    alignSelf: "center",
    borderColor: COLORS.border,
  },
});

export default TodoList;
