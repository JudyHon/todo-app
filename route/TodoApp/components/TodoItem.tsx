import React from 'react';
import { View, Text, Button, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import ITodo from '../models/todo.model';
import { CheckBox } from '@rneui/base';
import Icon from 'react-native-vector-icons/Feather'

interface ITodoProps {
    task: ITodo;
    deleteTask: (id: number) => void;
    toggleCompleted: (id: number) => void;
}

function TodoItem(props: ITodoProps) {
    const { task, deleteTask, toggleCompleted } = props;
    return (
        <View style={styles.todoContainer}>
            <TouchableOpacity style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }} onPress={() => toggleCompleted(task.id)}>
                <CheckBox
                    checked={task.completed}
                    onPress={() => toggleCompleted(task.id)}
                    containerStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}
                />
                <Text style={[styles.todoTitle, task.completed && styles.todoCompleted]}>
                    {task.text}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(task.id)}  >
                <Icon name="trash-2" size={30} color='#333' />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    todoContainer: {
        width: '100%',
        minHeight: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
    },
    todoTitle: {
        flex: 1
    },
    todoCompleted: {
        textDecorationLine: 'line-through',
        color: '#888'
    }
})

export default TodoItem;