import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from '../logic/types';

const STORAGE_KEY = 'ANTIGRAVITY_STATE_V1';

const DEFAULT_STATE: AppState = {
    hasStarted: false,
    startDate: null,
    lastCheckInDate: null,
    dsaPenaltyCounter: 0,
    dailyProgress: {},
    finalChecklist: {},
    history: {},
};

export const StorageService = {
    async getState(): Promise<AppState> {
        try {
            const json = await AsyncStorage.getItem(STORAGE_KEY);
            if (!json) return DEFAULT_STATE;
            return JSON.parse(json);
        } catch (e) {
            console.error('Failed to load state', e);
            return DEFAULT_STATE;
        }
    },

    async saveState(state: AppState): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('Failed to save state', e);
        }
    },

    async resetState(): Promise<void> {
        await AsyncStorage.removeItem(STORAGE_KEY);
    }
};
