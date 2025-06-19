import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  LinearTransition,
  StretchOutY,
} from "react-native-reanimated";
import Icon from "../../../components/Icon";
import { COLORS, ICON_SIZES, SPACING } from "../../../utils/theme";
import { SCREEN_WIDTH } from "../../../utils/dimensionUtil";

interface ISwipable extends PropsWithChildren {
  onRemove: () => void;
}

const Swipable: React.FC<ISwipable> = ({ onRemove, children }) => {
  const swipeTranslateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .onChange((event) => {
      if (event.translationX < 0) {
        swipeTranslateX.value = event.translationX;
      }
    })
    .onFinalize(() => {
      const isShouldDismiss = swipeTranslateX.value < -SCREEN_WIDTH * 0.3;
      if (isShouldDismiss) {
        swipeTranslateX.value = withTiming(
          -SCREEN_WIDTH,
          undefined,
          (isDone) => {
            if (isDone) {
              runOnJS(onRemove)();
            }
          }
        );
      } else {
        swipeTranslateX.value = withTiming(0);
      }
    });

  const transformStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: swipeTranslateX.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        layout={LinearTransition.duration(300)}
        exiting={StretchOutY.duration(50)}
      >
        <View style={styles.iconContainer}>
          <Icon
            name="trash-2"
            size={ICON_SIZES.sm}
            color={COLORS.blackLight}
            style={styles.icon}
          />
        </View>
        <Animated.View style={transformStyle}>{children}</Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: "absolute",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.error,
  },
  icon: { alignSelf: "flex-end", padding: SPACING.md },
});

export default Swipable;
