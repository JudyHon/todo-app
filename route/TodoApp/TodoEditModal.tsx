import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import TagModal from "./TagModal";
import IconButton from "../../components/IconButton";
import CheckBox from "../../components/CheckBox";
import MultiTextInput from "./components/MultiTextInput";

interface ITodoEditModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (
    task_name: string,
    tags: number[],
    subtasks_names: string[]
  ) => Promise<void>;
  onRefresh: () => void;
}

function TodoEditModal({
  isVisible,
  onClose,
  onSave,
  onRefresh,
}: ITodoEditModalProps) {
  const [tags, setTags] = useState<ITag[]>([]);

  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const [showTags, setShowTags] = useState<boolean>(false);

  const [mainTask, setMainTask] = useState<string>("");
  const [totalTextInput, setTotalTextInput] = useState<string[]>([]);

  // Check Tag Database
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
    const newTotalTextInput = totalTextInput
      .map((value) => value.trim())
      .filter((value) => value != "");
    await onSave(mainTask.trim(), selectedTagIds, newTotalTextInput);
    setMainTask("");
    setTotalTextInput([]);
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

  function openTags() {
    setShowTags(true);
  }

  function closeTags() {
    setShowTags(false);
  }

  async function refreshTagList() {
    const tagList = await getAllTags();
    setTags(tagList);
    onRefresh();
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={commonStyles.grow}
          >
            <TagModal
              isVisible={showTags}
              onClose={closeTags}
              onSelect={selectTag}
              onRefresh={refreshTagList}
            />
            <IconButton
              icon="x"
              iconSize={ICON_SIZES.md}
              style={commonStyles.selfEnd}
              onPress={onClose}
            />
            <View style={styles.inputContainer}>
              <MultiTextInput
                mainTask={mainTask}
                setMainTask={setMainTask}
                totalTextInput={totalTextInput}
                setTotalTextInput={setTotalTextInput}
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
                onPress={openTags}
              />
              <ScrollView
                horizontal
                contentContainerStyle={{ gap: SPACING.sm }}
                keyboardShouldPersistTaps="always"
              >
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
                disabled={!mainTask.trim()}
                onPress={addTask}
              />
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
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
  inputSubTaskText: {
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: FONT_SIZES.md,
  },
  inputContainer: {
    flex: 1,
    padding: SPACING.sm,
    paddingVertical: SPACING.md,
  },
});
