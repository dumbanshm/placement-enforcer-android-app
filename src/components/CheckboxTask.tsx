import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';
import { DailyTask } from '../logic/types';

interface Props {
    task: DailyTask;
    onToggle: (id: string) => void;
}

export const CheckboxTask: React.FC<Props> = ({ task, onToggle }) => {
    if (task.isInfoOnly) {
        return (
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>{task.text}</Text>
            </View>
        );
    }

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onToggle(task.id)}
            activeOpacity={0.7}
        >
            <Checkbox
                value={task.isCompleted}
                onValueChange={() => onToggle(task.id)}
                color={task.isCompleted ? '#fff' : '#666'}
                style={styles.checkbox}
            />
            <View style={styles.textContainer}>
                <Text style={[
                    styles.text,
                    task.isCompleted && styles.completedText,
                    task.category === 'MOCK' ? styles.mockText : null
                ]}>
                    {task.text}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16, // Increased padding
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333', // Dark divider
        backgroundColor: '#000', // Dark bg
    },
    infoContainer: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: '#000',
        paddingLeft: 56, // Indent to align with text
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderColor: '#666',
    },
    textContainer: {
        flex: 1,
        marginLeft: 16,
    },
    text: {
        fontSize: 18, // Increased font size
        color: '#fff', // White text
        fontFamily: 'System',
        fontWeight: '600',
        lineHeight: 24,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#555', // Dimmed
    },
    infoText: {
        fontSize: 14,
        color: '#666', // Faded
        fontStyle: 'italic',
        fontWeight: '500',
    },
    mockText: {
        color: '#ff4444',
        fontWeight: 'bold',
    },
});
