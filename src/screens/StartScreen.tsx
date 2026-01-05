import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';

interface Props {
    onStart: () => void;
}

export const StartScreen: React.FC<Props> = ({ onStart }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.content}>
                <Text style={styles.title}>PLACEMENT</Text>
                <Text style={styles.subtitle}>PROTOCOL</Text>

                <View style={styles.disclaimerBox}>
                    <Text style={styles.disclaimerText}>
                        This is not a productivity app.
                    </Text>
                    <Text style={styles.disclaimerText}>
                        This is an execution enforcer.
                    </Text>
                    <Text style={styles.disclaimerText}>
                        50 Days. No excuses.
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={onStart}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>START PROTOCOL</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 32,
    },
    title: {
        fontSize: 48,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 4,
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#666',
        marginBottom: 60,
        letterSpacing: 8,
    },
    disclaimerBox: {
        marginBottom: 60,
        alignItems: 'center',
        gap: 12,
    },
    disclaimerText: {
        color: '#888',
        fontSize: 16,
        fontFamily: 'System',
        fontWeight: '500',
    },
    button: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 40,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 2,
    },
});
