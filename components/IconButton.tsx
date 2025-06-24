import React from "react";
import { Pressable, ViewStyle } from "react-native";
import Icon from "./Icon";
import { COLORS, ICON_SIZES } from "../utils/theme";

interface IIconButtonProps {
  onPress: () => void;
  icon: string;
  iconSize?: number;
  iconColor?: string;
  style?: ViewStyle | ViewStyle[];
}

const defaultIconButtonProps: IIconButtonProps = {
  icon: "",
  iconColor: COLORS.black,
  iconSize: ICON_SIZES.sm,
  onPress: () => {},
  style: {},
};

function IconButton(props: IIconButtonProps) {
  const propsWithDefaults = { ...defaultIconButtonProps, ...props };
  const { icon, iconColor, iconSize, onPress, style } = propsWithDefaults;
  return (
    <Pressable style={style} onPress={onPress}>
      {icon && <Icon name={icon} size={iconSize} color={iconColor} />}
    </Pressable>
  );
}

export default IconButton;
