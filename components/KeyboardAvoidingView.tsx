import type React from "react";
import { useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  View,
  type KeyboardEventName,
  type ViewProps,
} from "react-native";

export function KeyboardAvoidingView({ children, style, ...props }: ViewProps) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscriptionEventName = Platform.select<KeyboardEventName>({
      android: "keyboardDidShow",
      ios: "keyboardWillShow",
    });

    const hideSubscriptionEventName = Platform.select<KeyboardEventName>({
      android: "keyboardDidHide",
      ios: "keyboardWillHide",
    });

    const showSubscription = Keyboard.addListener(
      showSubscriptionEventName!,
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const hideSubscription = Keyboard.addListener(
      hideSubscriptionEventName!,
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <View
      style={[
        {
          paddingBottom: keyboardHeight && keyboardHeight,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
