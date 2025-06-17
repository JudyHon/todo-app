import {
  Button,
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
import { COLORS, FONT_SIZES, FONT_WEIGHTS } from "../../utils/theme";
import commonStyles from "../../styles/commonStyles";

interface ITodoEditModalProps {
  isVisible: boolean;
  onClose: () => void;
}

function TodoEditModal({ isVisible, onClose }: ITodoEditModalProps) {
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
          <TouchableOpacity style={{ alignSelf: "flex-end" }}>
            <Icon name="x" size={30} />
          </TouchableOpacity>
          <View style={{ flex: 1, padding: 20 }}>
            <TextInput
              placeholder="Write a new task..."
              placeholderTextColor={"#ccc"}
              style={{
                fontWeight: FONT_WEIGHTS.medium,
                fontSize: FONT_SIZES.xxl,
              }}
            />
          </View>
          <TouchableOpacity style={{ paddingVertical: 12 }}>
            <Button title="Save" color={COLORS.blue} />
          </TouchableOpacity>
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
});
