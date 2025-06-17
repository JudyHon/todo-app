import React, { PropsWithChildren } from "react";
import {
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING } from "../utils/theme";

interface IStyledTextProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle | TextStyle>;
}

export const Heading = ({ children, style, ...props }: IStyledTextProps) => (
  <Text style={[styles.heading, style]} {...props}>
    {children}
  </Text>
);
export const Subheading = ({ children, style, ...props }: IStyledTextProps) => (
  <Text style={[styles.subheading, style]} {...props}>
    {children}
  </Text>
);
export const BodyText = ({ children, style, ...props }: IStyledTextProps) => (
  <Text style={[styles.body, style]} {...props}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  heading: {
    fontSize: FONT_SIZES.xxl,
    color: COLORS.text,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: SPACING.sm,
  },
  subheading: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  body: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },
});
