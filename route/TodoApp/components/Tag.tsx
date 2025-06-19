import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { BORDER_RADIUS, COLORS, FONT_WEIGHTS, SPACING } from "../../../utils/theme";

const COLORS_COMBINATION = [
  { name: "blue", backgroundColor: COLORS.blueLight, color: COLORS.blue },
  { name: "green", backgroundColor: COLORS.greenLight, color: COLORS.green },
  { name: "purple", backgroundColor: COLORS.purpleLight, color: COLORS.purple },
  { name: "grey", backgroundColor: COLORS.greyUltraLight, color: COLORS.grey },
];

interface ITagProps {
  tagName: string;
  color: string;
  disabled?: boolean;
  onPress?: () => void;
}

const defaultTagProps: ITagProps = {
  tagName: "",
  color: "",
  disabled: false,
};

function Tag(props: ITagProps) {
  const propsWithDefaults = { ...defaultTagProps, ...props };

  const { tagName, color, disabled, onPress } = propsWithDefaults;

  const chosenColor = COLORS_COMBINATION.find((value) => value.name === color);
  const backgroundColor = chosenColor?.backgroundColor;
  const textColor = chosenColor?.color;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: disabled
            ? COLORS.disableBackground
            : backgroundColor,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: disabled ? COLORS.disableText : textColor },
        ]}
      >
        {tagName.toUpperCase()}
      </Text>
    </View>
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
