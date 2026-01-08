import { Engine } from '../logic/engine';
import { AppState, DailyTask } from '../logic/types';

// Mock helpers
const createMockState = (day: number, penalty = 0): AppState => ({
    hasStarted: true,
    // Reverse engineer startDate from day number
    // calculatedDay = diff(now, start) + 1
    // => diff = day - 1
    // => start = now - (day - 1)
    startDate: new Date(Date.now() - (day - 1) * 24 * 60 * 60 * 1000).toISOString(),
    lastCheckInDate: null,
    dsaPenaltyCounter: penalty,
    dailyProgress: {},
    finalChecklist: {},
    history: {}
});

console.log("=== ANTIGRAVITY STRESS TEST ===\n");

// TEST 1: DAY 1 INITIALIZATION
console.log("[TEST 1] Day 1 content");
const stateDay1 = createMockState(1);
const tasksDay1 = Engine.generateTasks(1, stateDay1);
console.log(`- Day 1 Tasks: ${tasksDay1.length}`);
const dsaTask1 = tasksDay1.find(t => t.category === 'DSA');
console.log(`- DSA: ${dsaTask1?.text}`); // Should be 7 questions form Binary Search
console.log("");

// TEST 2: DAY 10 (Penalty Simulation)
// Scenario: User failed Day 9. Penalty is +2.
console.log("[TEST 2] Day 10 with +2 Penalty from Day 9 failure");
const stateDay10 = createMockState(10, 2);
const tasksDay10 = Engine.generateTasks(10, stateDay10);
const dsaTask10 = tasksDay10.find(t => t.category === 'DSA');
// Day 10 is Phase 1. 7 base questions + 2 penalty = 9.
console.log(`- DSA Task: ${dsaTask10?.text}`);
if (dsaTask10?.text.includes("9 DSA questions")) {
    console.log("✅ PASSED: Penalty applied correctly.");
} else {
    console.log("❌ FAILED: Penalty logic incorrect.");
}
console.log("");

// TEST 3: DAY 36 (Mock Interview Day)
console.log("[TEST 3] Day 36 - Mock Interview");
const stateDay36 = createMockState(36);
const tasksDay36 = Engine.generateTasks(36, stateDay36);
const isMock = tasksDay36.some(t => t.category === 'MOCK');
console.log(`- Is Mock Day? ${isMock}`);
tasksDay36.filter(t => t.category === 'MOCK').forEach(t => console.log(`  > ${t.text}`));
if (isMock) {
    console.log("✅ PASSED: Mock day identified.");
} else {
    console.log("❌ FAILED: Mock day not generated.");
}
console.log("");

// TEST 4: DAY 51 (End of Plan)
console.log("[TEST 4] Day 50/51 (End of Plan)");
const stateDay50 = createMockState(50);
const tasksDay50 = Engine.generateTasks(50, stateDay50);
// Day 50 is Phase 6.
console.log(`- Day 50 DSA: ${tasksDay50.find(t => t.category === 'DSA')?.text}`);

// Day 51 -> Logic clamps to 50
const startDay51 = new Date(Date.now() - (50) * 24 * 60 * 60 * 1000).toISOString();
const calculatedDay = Engine.calculateDay(startDay51);
console.log(`- Input Day 51 -> Calculated Day: ${calculatedDay}`);
if (calculatedDay === 50) {
    console.log("✅ PASSED: Day clamping works (Plan max 50).");
} else {
    console.log(`❌ FAILED: Calculated day ${calculatedDay} (Expected 50).`);
}

// TEST 5: DSA Phase Transitions
console.log("\n[TEST 5] Phase Transitions");
// Check Day 11 (Phase 2 start). Phase 2 is Bit Manipulation etc.
const stateDay11 = createMockState(11);
const taskDay11 = Engine.generateTasks(11, stateDay11).find(t => t.category === 'DSA');
console.log(`- Day 11 DSA: ${taskDay11?.text}`);
// Check Day 40 (DP Phase).
const stateDay40 = createMockState(40);
const taskDay40 = Engine.generateTasks(40, stateDay40).find(t => t.category === 'DSA');
console.log(`- Day 40 DSA: ${taskDay40?.text}`);

console.log('\n[TEST 6] DSA Revision Day (Day 7)');
console.log(`- Day 7 % 7 === 0: ${7 % 7 === 0}`);
// Test Day 7
const stateRev = createMockState(7);
const tasksRev = Engine.generateTasks(7, stateRev);
const revTask = tasksRev.find(t => t.text.includes('REVISION DAY'));
if (revTask) console.log('✅ PASSED: Revision task found: ' + revTask.text);
else console.error('❌ FAILED: No revision task found on Day 7');

console.log('\n=== TEST COMPLETE ===');
