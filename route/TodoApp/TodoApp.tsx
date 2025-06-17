import React, { useCallback, useEffect, useState } from "react";
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import TodoList from "./components/TodoList";
import { Heading } from "../../components/StyleText";
import commonStyles from "../../styles/commonStyles";
import Icon from "react-native-vector-icons/Feather";
import { BORDER_RADIUS, ICON_SIZES, SPACING } from "../../utils/theme";
import { createDBTable, deleteDBItem, getDBConnection, getDBItems, saveDBItems } from "../../utils/db-service";
import ITodo from "./models/todo.model";
import { getData, storeData } from "../../utils/stoageHelper";

const HAS_LAUNCHED = "HAS_LAUNCHED";

const defaultTasks = [
    { id: 2, text: 'Meeting at School', completed: 0 },
    { id: 1, text: 'Doctor Appointment', completed: 1 },
]

function TodoApp() {

    const checkLaunchedCallback = useCallback(async function () {

        try {
            const hasLaunched = await getData(HAS_LAUNCHED); // Check if it is the first app launch
            const db = await getDBConnection();

            if (hasLaunched) {
                // Get the saved data
                const storedTodoItems = await getDBItems(db);
                if (storedTodoItems.length) {
                    setTasks(storedTodoItems);
                }
            } else {
                await createDBTable(db); // Create the new database
                await saveDBItems(db, defaultTasks); // Show the default data
                setTasks(defaultTasks);
                await storeData(HAS_LAUNCHED, "true")
            }
        } catch (error) {
            console.error(error);
        }
    }, [])

    useEffect(function () {
        checkLaunchedCallback();
    }, [checkLaunchedCallback]);

    // State Hooks
    const [tasks, setTasks] = useState<ITodo[]>(defaultTasks);
    const [text, setText] = useState<string>('');

    async function addTask() {
        try {
            const newTasks = [
                { id: Date.now(), text, completed: 0 },
                ...tasks];
            setTasks(newTasks);

            const db = await getDBConnection();
            await saveDBItems(db, newTasks);

            setText('');
        } catch (error) {
            console.error(error);
        }

    }

    async function toggleCallback(newTasks: ITodo[]) {
        try {
            const db = await getDBConnection();
            await saveDBItems(db, newTasks);
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteCallback(deletedTaskId: number) {
        try {
            const db = await getDBConnection();
            await deleteDBItem(db, deletedTaskId);
        } catch (error) {
            console.error(error);
        }
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
                toggleCallback={toggleCallback}
                deleteCallback={deleteCallback}
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
                        <Icon name="arrow-up" size={ICON_SIZES.sm} color="#333" />
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
        padding: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.round,
        borderWidth: 2,
        borderColor: '#ddd',
    }
})

export default TodoApp;
