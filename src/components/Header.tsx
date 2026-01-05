import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
    day: number;
    totalDays: number;
    phaseName: string | null;
}

export const Header: React.FC<Props> = ({ day, totalDays, phaseName }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>DAY {day} / {totalDays}</Text>
            {phaseName && <Text style={styles.phase}>{phaseName}</Text>}
            <Text style={styles.subtitle}>EXECUTE OR FAIL.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: 1,
    },
    phase: {
        color: '#0aff0a', // Green for phase
        fontSize: 14,
        fontWeight: '700',
        marginTop: 4,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    subtitle: {
        color: '#888',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
});
