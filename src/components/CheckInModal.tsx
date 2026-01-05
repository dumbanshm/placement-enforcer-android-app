import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

interface Props {
    visible: boolean;
    onConfirm: (success: boolean) => void;
    onCancel: () => void;
}

export const CheckInModal: React.FC<Props> = ({ visible, onConfirm, onCancel }) => {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.dialog}>
                    <Text style={styles.question}>
                        Did you complete ALL tasks today?
                    </Text>
                    <Text style={styles.subtext}>
                        Honesty is non-negotiable.
                    </Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, styles.failButton]}
                            onPress={() => onConfirm(false)}
                        >
                            <Text style={styles.failText}>NO</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.successButton]}
                            onPress={() => onConfirm(true)}
                        >
                            <Text style={styles.successText}>YES</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={onCancel} style={styles.cancelLink}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    dialog: {
        width: '100%',
        backgroundColor: '#111',
        padding: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
        alignItems: 'center',
    },
    question: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtext: {
        color: '#666',
        fontSize: 14,
        marginBottom: 32,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    buttonRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 16,
    },
    button: {
        flex: 1,
        paddingVertical: 18,
        alignItems: 'center',
        borderWidth: 1,
    },
    failButton: {
        backgroundColor: '#000',
        borderColor: '#333',
    },
    successButton: {
        backgroundColor: '#fff',
        borderColor: '#fff',
    },
    failText: {
        fontSize: 18,
        fontWeight: '900',
        color: '#fff',
    },
    successText: {
        fontSize: 18,
        fontWeight: '900',
        color: '#000',
    },
    cancelLink: {
        marginTop: 24,
        padding: 12,
    },
    cancelText: {
        color: '#444',
    },
});
