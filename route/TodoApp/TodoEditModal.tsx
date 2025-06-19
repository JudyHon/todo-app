import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "../../components/Icon";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  ICON_SIZES,
  SPACING,
} from "../../utils/theme";
import commonStyles from "../../styles/commonStyles";
import Button from "../../components/Button";
import { useCallback, useEffect, useState } from "react";
import Tag from "./components/Tag";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import ITag from "./models/tag.model";
import { getAllTags } from "../../utils/db-service/db-service";

interface ITodoEditModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (task_name: string, tags: number[]) => Promise<void>;
}

function TodoEditModal({ isVisible, onClose, onSave }: ITodoEditModalProps) {
  const [text, setText] = useState<string>("");
  const [tags, setTags] = useState<ITag[]>([]);

  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  // Check Todo Database
  const getTagsCallback = useCallback(async function () {
    try {
      const tags = await getAllTags();
      setTags(tags);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(
    function () {
      getTagsCallback();
    },
    [getTagsCallback]
  );

  async function addTask() {
    await onSave(text.trim(), selectedTagIds);
    setText("");
    setSelectedTagIds([]);
    onClose();
  }

  function selectTag(tagId: number) {
    const isExist = selectedTagIds.find((value) => value == tagId);
    var newTags = [];
    if (isExist) {
      newTags = selectedTagIds.filter((value) => value !== tagId);
    } else {
      newTags = [...selectedTagIds, tagId];
    }

    setSelectedTagIds(newTags);
  }

  function checkSelectedTag(tagId: number): boolean {
    const isExist = selectedTagIds.find((value) => value === tagId);
    if (isExist) return true;
    else return false;
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
          <Pressable style={commonStyles.alignEnd} onPress={onClose}>
            <Icon name="x" size={ICON_SIZES.md} />
          </Pressable>
          <View style={styles.inputContainer}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Write a new task..."
              placeholderTextColor={"#ccc"}
              style={styles.inputText}
            />
          </View>
          <GestureHandlerRootView
            style={{ flexDirection: "row", gap: SPACING.sm }}
          >
            <Button
              icon="plus"
              borderRadius={BORDER_RADIUS.sm}
              iconStyle={{ fontSize: ICON_SIZES.xs, color: COLORS.grey }}
              buttonStyle={{ padding: SPACING.xs }}
              color={COLORS.greyUltraLight}
            />
            <ScrollView horizontal contentContainerStyle={{ gap: SPACING.sm }}>
              {tags.map((tag) => (
                <Tag
                  key={tag.id}
                  tagId={tag.id}
                  tagName={tag.name}
                  color={tag.color}
                  active={checkSelectedTag(tag.id)}
                  onPress={selectTag}
                />
              ))}
            </ScrollView>
          </GestureHandlerRootView>

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
    padding: SPACING.lg,
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
