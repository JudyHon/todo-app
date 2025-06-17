import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import ITodo from '../models/todo.model';
import { CheckBox } from '@rneui/base';
import Icon from 'react-native-vector-icons/Feather'
import { BodyText } from '../../../components/StyleText';
import commonStyles from '../../../styles/commonStyles';
import { ICON_SIZES } from '../../../utils/theme';

interface ITodoProps {
    task: ITodo;
    deleteTask: (id: number) => void;
    toggleCompleted: (id: number) => void;
}

function TodoItem(props: ITodoProps) {
    const { task, deleteTask, toggleCompleted } = props;
    return (
        <View style={styles.todoContainer}>
            <TouchableOpacity
                onPress={() => toggleCompleted(task.id)}
                style={styles.todoInner} >
                <CheckBox
                    checked={task.completed === 1}
                    onPress={() => toggleCompleted(task.id)}
                    containerStyle={commonStyles.transparentBackground}
                />
                <BodyText style={[
                    styles.todoTitle,
                    task.completed ? styles.todoCompleted : {}
                ]}>
                    {task.text}
                </BodyText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(task.id)}  >
                <Icon name="trash-2" size={ICON_SIZES.sm} color='#333' />
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
    todoInner: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    todoCompleted: {
        textDecorationLine: 'line-through',
        color: '#888'
    }
})

export default TodoItem;