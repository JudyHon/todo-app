import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  Pressable,
} from "react-native";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  ICON_SIZES,
  SPACING,
} from "../utils/theme";
import Icon from "../components/Icon";

interface IButtonProps {
  onPress?: () => void;
  title?: string;
  icon?: string;
  containerStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  titleStyle?: TextStyle;

  iconStyle?: TextStyle;
  color?: string;
  borderRadius?: number;
  disabled?: boolean;
}

const defaultButtonProps: IButtonProps = {
  onPress: () => {},
  title: "",
  icon: undefined,
  containerStyle: {},
  buttonStyle: {},
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
    buttonStyle,
    iconStyle,
    titleStyle,
    color,
    borderRadius,
    disabled,
  } = propsWithDefaults;

  return (
    <View style={containerStyle}>
      <Pressable
        onPress={onPress}
        style={[
          styles.buttonContainer,
          buttonStyle && buttonStyle,
          color && { backgroundColor: color },
          disabled && { backgroundColor: COLORS.disableBackground },
          { borderRadius },
        ]}
        disabled={disabled}
      >
        <View style={{ gap: SPACING.xs }}>
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
        </View>
      </Pressable>
    </View>
  );
}

Button.defaultProps = defaultButtonProps;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: COLORS.blue,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    justifyContent: "center",
    alignItems: "center",
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
