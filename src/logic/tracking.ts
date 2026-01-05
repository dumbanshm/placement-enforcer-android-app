import { AppState, MasterPlan } from './types';
import { Engine } from './engine';

export interface AppStats {
    daysCompleted: number;
    daysPassed: number;
    dsaBacklog: number;
    completionRate: number;
    estimatedHours: number;
}

export const TrackingLogic = {
    calculateStats(state: AppState): AppStats {
        const plan = Engine.getPlan();
        const daysPassed = Engine.calculateDay(state.startDate) - 1; // Don't count today as passed yet? 
        // Actually, "Total Days" in header is today. So days *passed* (fully) is today - 1. 
        // But completion rate usually includes history.

        let completedCount = 0;
        let totalEstimatedHours = 0;

        // Iterate through history
        Object.entries(state.history).forEach(([dayStr, status]) => {
            if (status.completed) {
                completedCount++;

                const dayNum = parseInt(dayStr, 10);

                // Calculate hours for this day
                // Core Hours
                const coreDayIndex = (dayNum - 1) % 7;
                const coreSchedule = plan.core_subjects_plan.weekly_cycle[coreDayIndex];
                let dailyHours = 0;
                if (coreSchedule) {
                    dailyHours += coreSchedule.blocks.reduce((sum, b) => sum + b.hours, 0);
                }

                // DSA Hours (estimate)
                // Phase logic
                const dsaPhase = plan.dsa_plan.phases.find(p => dayNum >= p.days[0] && dayNum <= p.days[1]);
                if (dsaPhase) {
                    // Estimate: ~20 mins per question? 7 questions = ~2.5 hours
                    // Let's just say 2 hours basic + difficulty
                    dailyHours += 2.0;
                }

                totalEstimatedHours += dailyHours;
            }
        });

        return {
            daysCompleted: completedCount,
            daysPassed: Math.max(1, daysPassed),
            dsaBacklog: state.dsaPenaltyCounter || 0,
            completionRate: daysPassed > 0 ? (completedCount / daysPassed) : 0,
            estimatedHours: Math.round(totalEstimatedHours * 10) / 10
        };
    }
};
