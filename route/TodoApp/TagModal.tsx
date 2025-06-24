import {
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import commonStyles from "../../styles/commonStyles";
import { BORDER_RADIUS, COLORS, ICON_SIZES, SPACING } from "../../utils/theme";
import { Subheading } from "../../components/StyleText";
import ITag from "./models/tag.model";
import { useCallback, useEffect, useState } from "react";
import {
  deleteTag,
  getAllTags,
  getLastInsertTagId,
  saveTags,
} from "../../utils/db-service/db-service";
import Tag from "./components/Tag";
import { COLORS_COMBINATION } from "./constants/tags-color-constant";
import { normalize } from "../../utils/dimensionUtil";
import { KeyboardAvoidingView } from "../../components/KeyboardAvoidingView";
import TagColorSelectButton from "./components/TagColorSelectButton";
import IconButton from "../../components/IconButton";

interface ITagModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: () => void;
  onRefresh: () => void;
}

function TagModal({ isVisible, onClose, onSelect, onRefresh }: ITagModalProps) {
  const [tags, setTags] = useState<ITag[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>(
    COLORS_COMBINATION[0].name
  );
  const [newTagName, setNewTagName] = useState<string>("");

  // Check Todo Database
  const getTagsCallback = useCallback(async function () {
    try {
      await refreshTagList();
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

  async function addTag() {
    const newId = (await getLastInsertTagId()) + 1;
    const newTag: ITag = { id: newId, name: newTagName, color: selectedColor };
    await saveTags([newTag]);

    await refreshTagList();
    setNewTagName("");
  }

  async function refreshTagList(): Promise<void> {
    const tagList = await getAllTags();
    onRefresh();
    setTags(tagList);
  }

  async function removeTag(id: number) {
    await deleteTag(id);
    refreshTagList();
  }

  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      transparent
    >
      <SafeAreaView style={styles.modalContainer}>
        <TouchableWithoutFeedback onPressOut={Keyboard.dismiss}>
          <KeyboardAvoidingView style={styles.modalWrapper}>
            <View style={styles.modalInner}>
              <View style={styles.titleContainer}>
                <Subheading>All Tags</Subheading>
                <IconButton icon="x" onPress={onClose} />
              </View>
              <ScrollView style={commonStyles.grow}>
                <View style={styles.tagsContainer}>
                  {tags.map((tag) => (
                    <View key={tag.id} style={styles.tag}>
                      <Tag
                        tagId={tag.id}
                        tagName={tag.name}
                        color={tag.color}
                        active
                        onPress={onSelect}
                      />
                      <IconButton
                        onPress={() => {
                          removeTag(tag.id);
                        }}
                        icon="trash"
                        iconSize={ICON_SIZES.xs}
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
              <View style={styles.addTagContainer}>
                <View style={[commonStyles.row, commonStyles.gapSmall]}>
                  {COLORS_COMBINATION.map((value) => (
                    <TagColorSelectButton
                      key={value.name}
                      color={value.color}
                      isSelected={selectedColor === value.name}
                      onPress={() => {
                        setSelectedColor(value.name);
                      }}
                    />
                  ))}
                </View>
                <TextInput
                  placeholder="Add a new tag..."
                  style={styles.textInputContainer}
                  onChangeText={setNewTagName}
                  value={newTagName}
                />
                <IconButton onPress={addTag} icon="arrow-up" />
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </Modal>
  );
}

export default TagModal;

const styles = StyleSheet.create({
  modalContainer: {
    height: "100%",
    width: "100%",
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalInner: {
    height: normalize(300),
    backgroundColor: "white",
    borderTopStartRadius: BORDER_RADIUS.xl,
    borderTopEndRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  titleContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  tagsContainer: {
    gap: SPACING.md,
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  addTagContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  textInputContainer: {
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
});
