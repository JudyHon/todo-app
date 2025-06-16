import React from 'react';
import { View, Text, Button } from 'react-native';
import ITodo from '../models/todo.model';
import { CheckBox } from '@rneui/base';

interface ITodoProps {
    task: ITodo,
    deleteTask: (id: number) => void,
    toggleCompleted: (id: number) => void
}

export default function TodoItem(props: ITodoProps) {
    const { task, deleteTask, toggleCompleted } = props;
    return (
        <View>
            <CheckBox
                checked={task.completed}
                onPress={() => toggleCompleted(task.id)}
            />
            <Text style={{ textDecorationLine: task.completed ? 'line-through' : 'none' }}>
                {task.text}
            </Text>
            <Button title="X" onPress={() => deleteTask(task.id)} />
        </View>
    );
}