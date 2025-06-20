import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_WEIGHTS,
  SPACING,
} from "../../../utils/theme";

const COLORS_COMBINATION = [
  { name: "blue", backgroundColor: COLORS.blueLight, color: COLORS.blue },
  { name: "green", backgroundColor: COLORS.greenLight, color: COLORS.green },
  { name: "purple", backgroundColor: COLORS.purpleLight, color: COLORS.purple },
  { name: "grey", backgroundColor: COLORS.greyUltraLight, color: COLORS.grey },
];

interface ITagProps {
  tagId: number;
  tagName: string;
  color: string;
  active?: boolean;
  onPress?: (id: number) => void;
}

const defaultTagProps: ITagProps = {
  tagId: 0,
  tagName: "",
  color: "",
  active: false,
};

function Tag(props: ITagProps) {
  const propsWithDefaults = { ...defaultTagProps, ...props };

  const { tagId, tagName, color, active, onPress } = propsWithDefaults;

  const chosenColor = COLORS_COMBINATION.find((value) => value.name === color);
  const backgroundColor = chosenColor?.backgroundColor;
  const textColor = chosenColor?.color;

  function toggleTag() {
    onPress!(tagId);
  }

  return (
    <Pressable onPress={toggleTag} disabled={!onPress}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: active
              ? backgroundColor
              : COLORS.disableBackground,
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            { color: active ? textColor : COLORS.disableText },
          ]}
        >
          {tagName.toUpperCase()}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.blueLight,
    // minWidth: 100,
    padding: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: BORDER_RADIUS.sm,
  },
  text: {
    color: COLORS.blue,
    fontWeight: FONT_WEIGHTS.medium,
  },
});

export default Tag;
