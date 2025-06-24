import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { BORDER_RADIUS, COLORS, ICON_SIZES } from "../../../utils/theme";

import { normalize } from "../../../utils/dimensionUtil";
import Icon from "../../../components/Icon";
import IconButton from "../../../components/IconButton";

interface ITagColorSelectButtonProps {
  color: string;
  isSelected: boolean;
  onPress: () => void;
}

function TagColorSelectButton({
  color,
  isSelected,
  onPress,
}: ITagColorSelectButtonProps) {
  return (
    <IconButton
      onPress={onPress}
      style={[
        styles.buttonStyle,
        {
          backgroundColor: color,
          transform: [{ scale: isSelected ? 1.2 : 1 }],
        },
      ]}
      icon={isSelected ? "check" : ""}
      iconSize={ICON_SIZES.xs}
      iconColor={COLORS.white}
    />
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    height: normalize(25),
    width: normalize(25),
    borderRadius: BORDER_RADIUS.round,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TagColorSelectButton;
