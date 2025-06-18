import React from "react";
import { View, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import Icon from "../components/Icon";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  ICON_SIZES,
  SPACING,
} from "../utils/theme";

interface ICheckBoxProps {
  onPress: () => void;
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
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.checkBoxContainer,
          disabled && { backgroundColor: COLORS.disableBackground },
          { borderRadius },
        ]}
        disabled={disabled}
      >
        <View
          style={[
            styles.checkBoxWrapper,
            checked ? styles.checked : styles.unchecked,
          ]}
        >
          <Icon name="check" size={18} color={COLORS.white} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  checkBoxContainer: {
    paddingHorizontal: SPACING.md,
  },
  checkBoxWrapper: {
    padding: 2,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
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
