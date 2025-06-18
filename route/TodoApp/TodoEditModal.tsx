import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import {
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  ICON_SIZES,
  SPACING,
} from "../../utils/theme";
import commonStyles from "../../styles/commonStyles";
import Button from "../../components/Button";
import { useState } from "react";

interface ITodoEditModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (text: string) => Promise<void>;
}

function TodoEditModal({ isVisible, onClose, onSave }: ITodoEditModalProps) {
  const [text, setText] = useState<string>("");

  async function addTask() {
    await onSave(text.trim());
    setText("");
    onClose();
  }

  return (
    <Modal
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
    >
      <SafeAreaView style={styles.modalContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={commonStyles.grow}
        >
          <TouchableOpacity style={commonStyles.alignEnd} onPress={onClose}>
            <Icon name="x" size={ICON_SIZES.md} />
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Write a new task..."
              placeholderTextColor={"#ccc"}
              style={styles.inputText}
            />
          </View>
          <View style={styles.buttonsContainer}>
            {/* <Button
              icon="clock"
              color={COLORS.grey}
              iconStyle={{color: COLORS.white}}
              containerStyle={{ paddingVertical: SPACING.md }}
            /> */}
            <Button
              title="Save"
              color={COLORS.blackLight}
              containerStyle={styles.buttonContainer}
              disabled={!text.trim()}
              onPress={addTask}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
export default TodoEditModal;

const styles = StyleSheet.create({
  modalContainer: {
    height: "100%",
    width: "100%",
    position: "absolute",
    padding: 20,
  },
  buttonsContainer: { flexDirection: "row", gap: SPACING.sm },
  buttonContainer: {
    paddingVertical: SPACING.md,
    flex: 1,
  },
  inputText: {
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: FONT_SIZES.xxl,
  },
  inputContainer: {
    flex: 1,
    padding: SPACING.sm,
    paddingVertical: SPACING.md,
  },
});
