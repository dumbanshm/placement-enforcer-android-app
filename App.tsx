import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert, Text } from 'react-native';
import { StartScreen } from './src/screens/StartScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { ChecklistScreen } from './src/screens/ChecklistScreen';
import { StorageService } from './src/services/storage';
import { Engine } from './src/logic/engine';
import { AppState, DailyTask } from './src/logic/types';
import { format } from 'date-fns';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [appState, setAppState] = useState<AppState | null>(null);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [day, setDay] = useState(1);
  const [totalDays] = useState(Engine.getPlan().meta.total_days);
  const [view, setView] = useState<'dashboard' | 'stats' | 'checklist'>('dashboard');

  const loadState = useCallback(async () => {
    try {
      const state = await StorageService.getState();
      setAppState(state);

      if (state.hasStarted && state.startDate) {
        const currentDay = Engine.calculateDay(state.startDate);
        setDay(currentDay);

        // Generate new tasks for the day
        const rawTasks = Engine.generateTasks(currentDay, state);

        // Merge progress
        const mergedTasks = rawTasks.map(t => ({
          ...t,
          isCompleted: !!state.dailyProgress[t.id]
        }));

        setDailyTasks(mergedTasks);

        const todayStr = format(new Date(), 'yyyy-MM-dd');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadState();
  }, [loadState]);

  const handleStart = async () => {
    const newState: AppState = {
      hasStarted: true,
      startDate: new Date().toISOString(),
      lastCheckInDate: null,
      dsaPenaltyCounter: 0,
      dailyProgress: {},
      finalChecklist: {},
      history: {},
    };
    await StorageService.saveState(newState);
    await loadState(); // Reload to generate tasks
  };

  const handleToggleTask = async (id: string) => {
    if (!appState) return;

    setDailyTasks(prev => prev.map(t =>
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    ));

    const newProgress = { ...appState.dailyProgress };
    if (newProgress[id]) {
      delete newProgress[id];
    } else {
      newProgress[id] = true;
    }

    const newState = { ...appState, dailyProgress: newProgress };
    setAppState(newState);
    await StorageService.saveState(newState);
  };

  const handleCheckIn = async (success: boolean) => {
    if (!appState) return;
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const newState = { ...appState };
    newState.history[day] = {
      completed: success,
      failed: !success
    };
    newState.lastCheckInDate = todayStr;

    if (!success) {
      newState.dsaPenaltyCounter = (newState.dsaPenaltyCounter || 0) + 2;
    } else {
      newState.dsaPenaltyCounter = 0;
    }

    setAppState(newState);
    await StorageService.saveState(newState);
    Alert.alert("RECORDED", success ? "Good. consistency is key." : "Failure recorded. Expect heavier load tomorrow.");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!appState || !appState.hasStarted) {
    return <StartScreen onStart={handleStart} />;
  }

  if (view === 'stats' && appState) {
    return <StatsScreen state={appState} onClose={() => setView('dashboard')} />;
  }

  if (view === 'checklist' && appState) {
    return (
      <ChecklistScreen
        state={appState}
        onUpdate={setAppState}
        onClose={() => setView('dashboard')}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <DashboardScreen
        day={day}
        totalDays={totalDays}
        phaseName={Engine.getPhaseForDay(day)}
        tasks={dailyTasks}
        onToggleTask={handleToggleTask}
        onCheckIn={handleCheckIn}
      />
      <View style={styles.navContainer}>
        <Text style={styles.navButton} onPress={() => setView('stats')}>
          STATS
        </Text>
        <View style={styles.divider} />
        <Text style={styles.navButton} onPress={() => setView('checklist')}>
          CHECKLIST
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navContainer: {
    flexDirection: 'row',
    backgroundColor: '#000',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingBottom: 40,
  },
  navButton: {
    color: '#666',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 2,
    paddingHorizontal: 20,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: '#333',
  }
});
