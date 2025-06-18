import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  ICON_SIZES,
  SPACING,
} from "../utils/theme";

interface IButtonProps {
  onPress?: () => void;
  title?: string;
  icon?: string;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  iconStyle?: TextStyle;
  color?: string;
  borderRadius?: number;
  disabled: boolean;
}

const defaultButtonProps: IButtonProps = {
  onPress: () => {},
  title: "",
  icon: "",
  containerStyle: {},
  titleStyle: {},
  iconStyle: {},
  color: "",
  borderRadius: BORDER_RADIUS.lg,
  disabled: false,
};

function Button(props: IButtonProps) {
  const propsWithDefaults = { ...defaultButtonProps, ...props };

  const {
    onPress,
    title,
    icon,
    containerStyle,
    iconStyle,
    titleStyle,
    color,
    borderRadius,
    disabled,
  } = propsWithDefaults;

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.buttonContainer,
          color && { backgroundColor: color },
          disabled && { backgroundColor: COLORS.disableBackground },
          { borderRadius },
        ]}
        disabled={disabled}
      >
        {icon && (
          <Icon
            name={icon}
            size={ICON_SIZES.md}
            style={[
              styles.icon,
              iconStyle,
              disabled && { color: COLORS.disableText },
            ]}
          />
        )}
        {title && (
          <Text
            style={[
              styles.title,
              titleStyle,
              disabled && { color: COLORS.grey },
            ]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

Button.defaultProps = defaultButtonProps;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: COLORS.blue,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
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

export default Button;
