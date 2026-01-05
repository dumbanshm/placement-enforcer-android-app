import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AppState } from '../logic/types';
import { TrackingLogic } from '../logic/tracking';

interface Props {
    state: AppState;
    onClose: () => void;
}

export const StatsScreen: React.FC<Props> = ({ state, onClose }) => {
    const stats = useMemo(() => TrackingLogic.calculateStats(state), [state]);

    const percentage = Math.round(stats.completionRate * 100);
    const isPassing = percentage >= 80;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.header}>PROTOCOL STATUS</Text>

            <View style={[styles.card, isPassing ? styles.cardGood : styles.cardBad]}>
                <Text style={styles.bigNumber}>{percentage}%</Text>
                <Text style={styles.label}>CONSISTENCY RATE</Text>
            </View>

            <View style={styles.row}>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{stats.daysCompleted}/{stats.daysPassed}</Text>
                    <Text style={styles.statLabel}>DAYS WON</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{stats.estimatedHours}</Text>
                    <Text style={styles.statLabel}>HOURS LOGGED</Text>
                </View>
            </View>

            <View style={[styles.backlogCard, stats.dsaBacklog > 0 ? styles.backlogDanger : null]}>
                <Text style={styles.backlogTitle}>DSA BACKLOG</Text>
                <Text style={styles.backlogValue}>{stats.dsaBacklog}</Text>
                <Text style={styles.backlogSub}>QUESTIONS PENDING</Text>
                {stats.dsaBacklog > 0 && (
                    <Text style={styles.punishment}>
                        PENALTY ACTIVE. CLEAR IMMEDIATELY.
                    </Text>
                )}
            </View>

            <View style={styles.returnContainer}>
                <Text style={styles.returnButton} onPress={onClose}>
                    RETURN TO EXECUTION
                </Text>
            </View>
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
        gap: 24,
    },
    header: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 20,
        letterSpacing: 2,
    },
    card: {
        backgroundColor: '#111',
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    cardGood: {
        borderColor: '#0f0',
    },
    cardBad: {
        borderColor: '#f00',
    },
    bigNumber: {
        color: '#fff',
        fontSize: 64,
        fontWeight: '900',
    },
    label: {
        color: '#888',
        fontSize: 12,
        fontWeight: '700',
        marginTop: 8,
        letterSpacing: 1,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#111',
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    statValue: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '700',
    },
    statLabel: {
        color: '#666',
        fontSize: 10,
        fontWeight: '700',
        marginTop: 4,
        letterSpacing: 1,
    },
    backlogCard: {
        backgroundColor: '#111',
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    backlogDanger: {
        borderColor: '#f00',
        backgroundColor: '#200',
    },
    backlogTitle: {
        color: '#888',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
    },
    backlogValue: {
        color: '#fff',
        fontSize: 48,
        fontWeight: '900',
        marginVertical: 8,
    },
    backlogSub: {
        color: '#888',
        fontSize: 12,
    },
    punishment: {
        color: '#f00',
        fontSize: 12,
        fontWeight: '900',
        marginTop: 12,
        textAlign: 'center',
    },
    returnContainer: {
        marginTop: 40,
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: '#fff',
    },
    returnButton: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 14,
        letterSpacing: 2,
    }
});
