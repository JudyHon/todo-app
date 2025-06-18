import { normalize } from "./dimensionUtil";

export const COLORS = {
  blue: "#7990F8",
  green: "#46CF88",
  purple: "#BC5EAD",
  grey: "#908986",
  blueLight: "#F2F4FE",
  greenLight: "#ECFAF3",
  purpleLight: "#F8EFF7",
  black: "#121212",
  blackLight: "#393433",
  white: "#fff",
  greyLight: "#F4F3F3",
  text: "#121212",
  textLight: "#666666",
  disableBackground: "#dedede",
  disableText: "#898989",
  transparent: "rgba(0,0,0,0)",

  primary: "#3498db",
  primaryDark: "#2980b9",
  secondary: "#2ecc71",
  accent: "#e74c3c",
  background: "#f9f9f9",
  card: "#ffffff",
  border: "#dddddd",
  error: "#e74c3c",
  success: "#2ecc71",
};

export const SPACING = {
  xs: normalize(4),
  sm: normalize(8),
  md: normalize(16),
  lg: normalize(24),
  xl: normalize(32),
  xxl: normalize(48),
};
export const FONT_SIZES = {
  xs: normalize(12),
  sm: normalize(14),
  md: normalize(16),
  lg: normalize(18),
  xl: normalize(20),
  xxl: normalize(24),
  xxxl: normalize(30),
};

export const ICON_SIZES = {
  xs: normalize(16),
  sm: normalize(24),
  md: normalize(32),
  lg: normalize(48),
  xl: normalize(56),
  xxl: normalize(64),
};

type FontWeight =
  | "normal"
  | "bold"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

export const FONT_WEIGHTS = {
  regular: "normal" as FontWeight,
  medium: "500" as FontWeight,
  bold: "bold" as FontWeight,
};
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 20,
  round: 9999,
};
