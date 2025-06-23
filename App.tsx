import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import TodoApp from "./route/TodoApp/TodoApp";
import { COLORS } from "./utils/theme";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <TodoApp />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: COLORS.white,
  },
});
