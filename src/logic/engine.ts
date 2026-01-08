import { differenceInCalendarDays } from 'date-fns';
import masterPlanData from '../data/master_plan.json';
import { AppState, DailyTask, MasterPlan } from './types';

// Force cast the imported JSON to our typed interface
const PLAN = masterPlanData as unknown as MasterPlan;

export const Engine = {
    getPlan(): MasterPlan {
        return PLAN;
    },

    calculateDay(startDate: string | null): number {
        if (!startDate) return 1;
        const start = new Date(startDate);
        const now = new Date();
        // differenceInCalendarDays returns 0 if same day
        const diff = differenceInCalendarDays(now, start);
        // Day 1 is the first day (diff 0) -> return 1
        // But we clamp it between 1 and 50
        return Math.max(1, Math.min(diff + 1, PLAN.meta.total_days));
    },

    getPhaseForDay(day: number): string | null {
        const phase = PLAN.dsa_plan.phases.find(p => day >= p.days[0] && day <= p.days[1]);
        return phase ? phase.name : null;
    },

    generateTasks(day: number, state: AppState): DailyTask[] {
        const tasks: DailyTask[] = [];

        // 1. Check for Mock Interview
        const mock = PLAN.mock_interviews.full_mocks.find(m => m.day === day);
        if (mock) {
            tasks.push({
                id: `mock-${mock.id}`,
                category: 'MOCK',
                text: `FULL MOCK INTERVIEW DAY (Goal: ${mock.goal})`,
                isCompleted: false,
            });
            tasks.push({
                id: `mock-rounds-${mock.id}`,
                category: 'MOCK',
                text: `Complete rounds: ${mock.rounds.map(r => r.type).join(', ')}`,
                isCompleted: false,
            });
            tasks.push({
                id: `mock-sitting-${mock.id}`,
                category: 'MOCK',
                text: `Single sitting. No pauses.`,
                isCompleted: false,
            });
            return tasks; // Mock day overrides everything ??
        }

        // 2. DSA Tasks
        const dsaPhase = PLAN.dsa_plan.phases.find(p => day >= p.days[0] && day <= p.days[1]);
        if (dsaPhase) {
            const isRevisionDay = day % 7 === 0;

            if (isRevisionDay) {
                tasks.push({
                    id: `dsa-revision-${day}`,
                    category: 'DSA',
                    text: `REVISION DAY: Re-solve 5-7 'Tricky' or 'Hard' problems from this week.`,
                    isCompleted: false,
                });
                tasks.push({
                    id: `dsa-revision-notes-${day}`,
                    category: 'DSA',
                    text: `Review all notes/patterns from ${dsaPhase.name}`,
                    isCompleted: false,
                    isInfoOnly: true
                });
            } else {
                const baseQuestions = dsaPhase.daily_questions;
                // Penalty: If previous day failed, add penalty. 
                const totalQuestions = baseQuestions + state.dsaPenaltyCounter;

                // Determine topic
                // Simple rotation based on day number to ensure coverage
                // We exclude revision days from the rotation offset to keep ordering clean? 
                // Actually simple rotation is fine, just ensures we cycle through.
                const topicIndex = (day - dsaPhase.days[0]) % dsaPhase.topics.length;
                const topic = dsaPhase.topics[topicIndex];

                tasks.push({
                    id: `dsa-${day}`,
                    category: 'DSA',
                    text: `Solve ${totalQuestions} DSA questions from ${topic.name}`,
                    isCompleted: false,
                });

                tasks.push({
                    id: `dsa-split-${day}`,
                    category: 'DSA',
                    text: `Target split: Mostly Medium, Max 1 Hard`,
                    isCompleted: false,
                    isInfoOnly: true,
                });
            }
        }

        // 3. Core Subjects
        const coreRules = PLAN.core_subjects_plan.rules;
        const isHeavy = day >= coreRules.heavy_start_day;

        const schedule = isHeavy ? PLAN.core_subjects_plan.heavy_schedule : PLAN.core_subjects_plan.light_schedule;
        const coreDayIndex = (day - 1) % 7;

        const dailySchedule = schedule.weekly_cycle[coreDayIndex];

        if (dailySchedule) {
            dailySchedule.blocks.forEach((block, idx) => {
                tasks.push({
                    id: `core-${day}-${idx}`,
                    category: 'CORE',
                    text: `[${isHeavy ? 'HEAVY' : 'LIGHT'}] ${block.subject} (${block.hours} hrs)`,
                    isCompleted: false,
                });
            });
        }

        // 4. Misc
        // Resume
        const resumeTask = PLAN.misc_placement_prep.resume.tasks.find(t => t.deadline_day === day);
        if (resumeTask) {
            tasks.push({
                id: `misc-resume-${day}`,
                category: 'MISC',
                text: `DUE TODAY: ${resumeTask.name}`,
                isCompleted: false,
            });
        }

        // LLD (Alternate days starting day 18)
        const lldWindow = PLAN.misc_placement_prep.lld.window;
        if (day >= lldWindow[0] && day <= lldWindow[1]) {
            // logic for alternate days: (day - start) % 2 === 0
            if ((day - lldWindow[0]) % 2 === 0) {
                tasks.push({
                    id: `misc-lld-${day}`,
                    category: 'MISC',
                    text: `LLD Session: Practice System Design (60 mins)`,
                    isCompleted: false,
                });
            }
        }

        return tasks;
    }
};
