import React, { useMemo } from 'react';
import { View, StyleSheet, SectionList, StatusBar, Alert, Text } from 'react-native';
import { Header } from '../components/Header';
import { CheckboxTask } from '../components/CheckboxTask';
import { DailyTask } from '../logic/types';
import { CheckInModal } from '../components/CheckInModal';

interface Props {
    day: number;
    totalDays: number;
    phaseName: string | null;
    tasks: DailyTask[];
    onToggleTask: (id: string) => void;
    onCheckIn: (success: boolean) => void;
}

export const DashboardScreen: React.FC<Props> = ({
    day,
    totalDays,
    phaseName,
    tasks,
    onToggleTask,
    onCheckIn
}) => {
    const [modalVisible, setModalVisible] = React.useState(false);

    // Group tasks by category for SectionList
    const sections = useMemo(() => {
        const grouped = {
            DSA: [] as DailyTask[],
            CORE: [] as DailyTask[],
            MOCK: [] as DailyTask[],
            MISC: [] as DailyTask[],
        };

        tasks.forEach(t => {
            if (grouped[t.category]) {
                grouped[t.category].push(t);
            }
        });

        const result = [];
        if (grouped.MOCK.length > 0) {
            result.push({ title: 'TODAY – MOCK INTERVIEW', data: grouped.MOCK });
        } else {
            if (grouped.DSA.length > 0) result.push({ title: 'TODAY – DSA', data: grouped.DSA });
            if (grouped.CORE.length > 0) result.push({ title: 'TODAY – CORE SUBJECTS', data: grouped.CORE });
            if (grouped.MISC.length > 0) result.push({ title: 'TODAY – MISC', data: grouped.MISC });
        }
        return result;
    }, [tasks]);

    const handleCheckInPress = () => {
        setModalVisible(true);
    };

    const handleConfirm = (success: boolean) => {
        setModalVisible(false);
        onCheckIn(success);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Header day={day} totalDays={totalDays} phaseName={phaseName} />

            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <CheckboxTask task={item} onToggle={onToggleTask} />
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionText}>{title}</Text>
                    </View>
                )}
                contentContainerStyle={styles.listContent}
                stickySectionHeadersEnabled={false}
            />

            <View style={styles.footer}>
                <View style={styles.checkInButtonContainer}>
                    <Text style={styles.checkInButton} onPress={handleCheckInPress}>
                        ATTEMPT CHECK-IN
                    </Text>
                </View>
            </View>

            <CheckInModal
                visible={modalVisible}
                onConfirm={handleConfirm}
                onCancel={() => setModalVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Dark Mode
    },
    listContent: {
        paddingBottom: 150, // Extra padding for footer
    },
    sectionHeader: {
        paddingHorizontal: 20,
        paddingTop: 32,
        paddingBottom: 12,
        backgroundColor: '#000', // Dark Mode
    },
    sectionText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        paddingBottom: 40,
        backgroundColor: 'transparent',
    },
    checkInButtonContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    checkInButton: {
        color: '#000',
        fontWeight: '900',
        fontSize: 18,
        letterSpacing: 2,
        textTransform: 'uppercase',
    }
});
