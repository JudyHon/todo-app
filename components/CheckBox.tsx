import React from "react";
import { View, StyleSheet, ViewStyle, Pressable } from "react-native";
import Icon from "../components/Icon";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  ICON_SIZES,
  WIDTH,
} from "../utils/theme";

interface ICheckBoxProps {
  onPress?: () => void;
  checked: boolean;
  containerStyle?: ViewStyle;
  borderRadius?: number;
  disabled?: boolean;
  size?: number;
}

const defaultCheckBoxProps: ICheckBoxProps = {
  onPress: () => {},
  checked: false,
  containerStyle: {},
  borderRadius: BORDER_RADIUS.lg,
  disabled: false,
  size: WIDTH.md,
};

function CheckBox(props: ICheckBoxProps) {
  const propsWithDefaults = { ...defaultCheckBoxProps, ...props };

  const { containerStyle, borderRadius, disabled, onPress, checked, size } =
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
            { width: size, height: size },
          ]}
        >
          {checked && (
            <Icon name="check" size={size! / 1.5} color={COLORS.white} />
          )}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  checkBoxContainer: {},
  checkBoxWrapper: {
    padding: 2,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
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
