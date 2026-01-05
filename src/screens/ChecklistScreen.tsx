import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';
import { AppState } from '../logic/types';
import { StorageService } from '../services/storage';

interface Props {
    state: AppState;
    onUpdate: (newState: AppState) => void;
    onClose: () => void;
}

const CHECKLIST_ITEMS = [
    { id: 'sheet_a2z', label: 'Striver A2Z DSA Sheet' },
    { id: 'sheet_blind75', label: 'Blind 75 Sheet' },
    { id: 'core_oops', label: 'Object Oriented Programming' },
    { id: 'core_os', label: 'Operating Systems' },
    { id: 'core_dbms', label: 'Database Management Systems' },
    { id: 'core_cn', label: 'Computer Networks' },
    { id: 'core_lld', label: 'Low Level Design (LLD)' },
    { id: 'ml_basics', label: 'Machine Learning Basics' },
    { id: 'prep_resume', label: 'Resume Polish' },
    { id: 'prep_projects', label: 'Major Projects (2+)' },
    { id: 'prep_mock', label: 'Mock Interviews (5+)' },
];

export const ChecklistScreen: React.FC<Props> = ({ state, onUpdate, onClose }) => {

    const handleToggle = async (id: string) => {
        const newState = { ...state };
        if (!newState.finalChecklist) newState.finalChecklist = {};

        // Toggle
        newState.finalChecklist[id] = !newState.finalChecklist[id];

        onUpdate(newState);
        await StorageService.saveState(newState);
    };

    const completedCount = CHECKLIST_ITEMS.filter(i => state.finalChecklist?.[i.id]).length;
    const totalCount = CHECKLIST_ITEMS.length;
    const progress = Math.round((completedCount / totalCount) * 100);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.header}>FINAL CHECKLIST</Text>

            <View style={styles.progressContainer}>
                <Text style={styles.progressText}>{progress}% READY</Text>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                </View>
            </View>

            <View style={styles.list}>
                {CHECKLIST_ITEMS.map(item => {
                    const isChecked = !!state.finalChecklist?.[item.id];
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.item}
                            onPress={() => handleToggle(item.id)}
                            activeOpacity={0.7}
                        >
                            <Checkbox
                                value={isChecked}
                                onValueChange={() => handleToggle(item.id)}
                                color={isChecked ? '#0aff0a' : '#666'}
                                style={styles.checkbox}
                            />
                            <Text style={[styles.label, isChecked && styles.labelDone]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>RETURN</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        padding: 24,
        paddingTop: 60,
    },
    header: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 32,
        letterSpacing: 2,
    },
    progressContainer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    progressText: {
        color: '#0aff0a',
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 12,
    },
    progressBarBg: {
        width: '100%',
        height: 8,
        backgroundColor: '#333',
        borderRadius: 4,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#0aff0a',
        borderRadius: 4,
    },
    list: {
        gap: 16,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#111',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
    },
    checkbox: {
        marginRight: 16,
    },
    label: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    labelDone: {
        color: '#666',
        textDecorationLine: 'line-through',
    },
    closeButton: {
        marginTop: 40,
        alignItems: 'center',
        padding: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: '900',
        letterSpacing: 2,
    }
});
