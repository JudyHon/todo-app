import React from "react";
import { View, StyleSheet, ViewStyle, Pressable } from "react-native";
import Icon from "../components/Icon";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  HEIGHT,
  ICON_SIZES,
  SPACING,
  WIDTH,
} from "../utils/theme";

interface ICheckBoxProps {
  onPress?: () => void;
  checked: boolean;
  containerStyle?: ViewStyle;
  borderRadius?: number;
  disabled?: boolean;
}

const defaultCheckBoxProps: ICheckBoxProps = {
  onPress: () => {},
  checked: false,
  containerStyle: {},
  borderRadius: BORDER_RADIUS.lg,
  disabled: false,
};

function CheckBox(props: ICheckBoxProps) {
  const propsWithDefaults = { ...defaultCheckBoxProps, ...props };

  const { containerStyle, borderRadius, disabled, onPress, checked } =
    propsWithDefaults;

  return (
    <View style={containerStyle}>
      <Pressable
        onPress={onPress}
        style={[styles.checkBoxContainer, { borderRadius }]}
        disabled={disabled}
      >
        <View
          style={[
            styles.checkBoxWrapper,
            checked ? styles.checked : styles.unchecked,
          ]}
        >
          {checked && (
            <Icon name="check" size={ICON_SIZES.xs} color={COLORS.white} />
          )}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  checkBoxContainer: {
    // paddingHorizontal: SPACING.md,
  },
  checkBoxWrapper: {
    padding: 2,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    width: WIDTH.md,
    height: HEIGHT.md,
  },
  checked: {
    borderColor: COLORS.greyLight,
    backgroundColor: COLORS.greyLight,
  },
  unchecked: {
    borderColor: COLORS.border,
  },
  title: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    fontWeight: FONT_WEIGHTS.medium,
    alignSelf: "center",
  },
  icon: {
    fontSize: ICON_SIZES.sm,
    color: COLORS.white,
    alignSelf: "center",
  },
});

export default CheckBox;
