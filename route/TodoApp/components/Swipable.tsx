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

const TOUCH_SLOP = 5;
const TIME_TO_ACTIVATE_PAN = 100;

const Swipable: React.FC<ISwipable> = ({ onRemove, children }) => {
  const swipeTranslateX = useSharedValue(0);
  const initialTouch = useSharedValue<{
    x: number;
    y: number;
    time: number;
  } | null>(null);
  const isDragging = useSharedValue(false);

  const pan = Gesture.Pan()
    .manualActivation(true)
    .onTouchesDown((e) => {
      initialTouch.value = {
        x: e.changedTouches[0].x,
        y: e.changedTouches[0].y,
        time: Date.now(),
      };
    })
    .onTouchesMove((e, state) => {
      if (!initialTouch.value || !e.changedTouches.length) {
        state.fail();
        return;
      }

      const xDiff = Math.abs(e.changedTouches[0].x - initialTouch.value.x);
      const yDiff = Math.abs(e.changedTouches[0].y - initialTouch.value.y);

      const isHorizontalPanning = xDiff > yDiff;

      const isClick = xDiff < 0.5 && yDiff < 0.5;

      const timeToCheck = Date.now() - initialTouch.value.time;

      if (timeToCheck <= 50) {
        if (isClick) state.fail();
        else if (isHorizontalPanning) {
          state.activate();
        } else {
          if (!isDragging.value) state.fail();
          else state.activate();
        }
      }
    })
    .onStart(() => {
      isDragging.value = true;
    })
    .onChange((event) => {
      if (event.translationX < 0) {
        swipeTranslateX.value = event.translationX;
      }
    })
    .onFinalize(() => {
      isDragging.value = false;
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
            size={ICON_SIZES.xs}
            color={COLORS.white}
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
    backgroundColor: COLORS.redLight,
  },
  icon: { alignSelf: "flex-end", padding: SPACING.md },
});

export default Swipable;
