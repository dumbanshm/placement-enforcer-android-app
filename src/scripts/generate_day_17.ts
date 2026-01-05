import { Engine } from '../logic/engine';
import { AppState } from '../logic/types';

const mockState: AppState = {
    hasStarted: true,
    startDate: "2026-01-01T00:00:00.000Z", // Irrelevant as we force day 17
    lastCheckInDate: "2026-01-16",
    dsaPenaltyCounter: 0,
    dailyProgress: {},
    history: {}
};

const tasks = Engine.generateTasks(17, mockState);

console.log("------------------------------------------");
console.log("DAY 17 GENERATED TASKS");
console.log("------------------------------------------");
tasks.forEach(t => {
    console.log(`[${t.category}] ${t.text}`);
});
console.log("------------------------------------------");
