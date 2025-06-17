import { StyleSheet, TextInput, View } from "react-native";

function TodoEditModal() {
  return (
    <View style={styles.container}>
      <TextInput />
    </View>
  );
}
export default TodoEditModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
