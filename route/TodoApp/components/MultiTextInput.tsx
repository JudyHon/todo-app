import React, { Dispatch, SetStateAction, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { FONT_SIZES, FONT_WEIGHTS, SPACING } from "../../../utils/theme";
import commonStyles from "../../../styles/commonStyles";
import CheckBox from "../../../components/CheckBox";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";

interface IMultiTextInputProps {
  mainTask: string;
  setMainTask: Dispatch<SetStateAction<string>>;
  totalTextInput: string[];
  setTotalTextInput: Dispatch<SetStateAction<string[]>>;
}

function MultiTextInput({
  mainTask,
  setMainTask,
  totalTextInput,
  setTotalTextInput,
}: IMultiTextInputProps) {
  function setTask(text: string) {
    setMainTask(text);

    // If main task is typed, it allows to add subtasks
    if (text.length > 0) {
      if (totalTextInput.length <= 0) addTextInput();
    } else {
      const isSubTaskExist = totalTextInput.filter(
        (subtask) => subtask.length > 0
      ).length;
      if (!isSubTaskExist) removeTextInput(); // Remove the subtask section if there is no subtask
    }
  }

  function setSubTasks(text: string, index: number) {
    let newTotalTextInput = [...totalTextInput];
    let isRemove = false;

    if (index == totalTextInput.length - 1) {
      if (text.length > 0) {
        newTotalTextInput = [...totalTextInput, ""]; // Auto add subtask input when one subtask is typed
      }
    } else {
      if (text.length <= 0) {
        newTotalTextInput.splice(index, 1); // Remove subtask when empty
        if (newTotalTextInput.length <= 1 && mainTask.length <= 0) {
          newTotalTextInput = []; // Remove the subtask section if the subtask and maintask is both empty
        }
        isRemove = true;
      }
    }
    if (!isRemove) newTotalTextInput[index] = text;

    setTotalTextInput(newTotalTextInput);
  }

  const addTextInput = () => {
    setTotalTextInput([...totalTextInput, ""]);
  };

  const removeTextInput = () => {
    totalTextInput.pop();
    setTotalTextInput([...totalTextInput]);
  };

  return (
    <GestureHandlerRootView>
      <View>
        <TextInput
          value={mainTask}
          onChangeText={setTask}
          placeholder="Write a new task..."
          placeholderTextColor={"#ccc"}
          style={styles.inputText}
        />
      </View>

      <ScrollView>
        {totalTextInput.map((value, index) => {
          return (
            <View
              key={index.toString()}
              style={[
                commonStyles.row,
                {
                  alignItems: "center",
                  paddingHorizontal: SPACING.md,
                  paddingVertical: SPACING.sm,
                  gap: SPACING.md,
                },
              ]}
            >
              <CheckBox checked={false} disabled />
              <TextInput
                value={value}
                onChangeText={(text) => {
                  setSubTasks(text, index);
                }}
                placeholder="Add subtask"
                placeholderTextColor={"#ccc"}
                style={styles.inputSubTaskText}
              />
            </View>
          );
        })}
      </ScrollView>
    </GestureHandlerRootView>
  );
}

export default MultiTextInput;

const styles = StyleSheet.create({
  inputText: {
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: FONT_SIZES.xxl,
  },
  inputSubTaskText: {
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: FONT_SIZES.md,
    width: "100%",
  },
});
