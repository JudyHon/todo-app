import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import TodoList from "./components/TodoList";
import { Heading } from "../../components/StyleText";
import commonStyles from "../../styles/commonStyles";
import Icon from "react-native-vector-icons/Feather";

const defaultTasks = [
    { id: 1, text: 'Doctor Appointment', completed: true },
    { id: 2, text: 'Meeting at School', completed: false },
]

function TodoApp() {
    // State Hooks
    const [tasks, setTasks] = useState(defaultTasks);
    const [text, setText] = useState('');

    function addTask() {
        const newTask = { id: Date.now(), text, completed: false };
        setTasks([...tasks, newTask]);
        setText('');
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.todoListContainer}
        >
            <Heading>TASKS</Heading>
            <TodoList
                tasks={tasks}
                setTasks={setTasks}
            />
            <View style={styles.textInputContainer}>
                <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder="New Task"
                    style={commonStyles.grow}

                />
                {text &&
                    <TouchableOpacity onPress={addTask} >
                        <Icon name="arrow-up" size={30} color="#333" />
                    </TouchableOpacity>
                }
            </View>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    todoListContainer: {
        height: "100%",
        width: "100%",
        padding: 20,
    },

    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingVertical: 8,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: '#ddd',
    }
})

export default TodoApp;
