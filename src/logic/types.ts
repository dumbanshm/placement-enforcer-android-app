export interface DSATopic {
    name: string;
    questions: number;
}

export interface DSAPhase {
    name: string;
    days: [number, number];
    daily_questions: number;
    topics: DSATopic[];
}

export interface DSADailyRules {
    default_daily_questions: number;
    heavy_day_questions: number;
    light_day_questions: number;
    difficulty_split: {
        easy: number;
        medium: number;
        hard: number;
    };
    missed_day_penalty: string;
}

export interface DSAPlan {
    source: string;
    phases: DSAPhase[];
    daily_rules: DSADailyRules;
}

export interface CoreBlock {
    subject: string;
    hours: number;
}

export interface CoreDay {
    day: number;
    blocks: CoreBlock[];
}

export interface CoreSubjectsPlan {
    light_schedule: {
        daily_hours: number;
        weekly_cycle: CoreDay[];
    };
    heavy_schedule: {
        daily_hours: number;
        weekly_cycle: CoreDay[];
    };
    rules: {
        heavy_start_day: number;
    };
}

export interface MockRound {
    type: string;
    minutes: number;
    questions?: string;
}

export interface MockInterview {
    id: number;
    day: number;
    goal: string;
    rounds: MockRound[];
}

export interface MasterPlan {
    meta: {
        total_days: number;
        daily_focus_hours: number;
        philosophy: string;
    };
    dsa_plan: DSAPlan;
    core_subjects_plan: CoreSubjectsPlan;
    misc_placement_prep: {
        resume: {
            tasks: { name: string; deadline_day: number }[];
        };
        lld: {
            window: [number, number];
            problems: string[];
        };
        behavioral_hr: {
            window: [number, number];
            topics: string[];
        };
    };
    mock_interviews: {
        full_mocks: MockInterview[];
    };
}

export interface AppState {
    hasStarted: boolean;
    startDate: string | null; // ISO Date String
    lastCheckInDate: string | null; // ISO Date String "YYYY-MM-DD"
    dsaPenaltyCounter: number;
    dailyProgress: Record<string, boolean>; // TaskID -> completed
    finalChecklist: Record<string, boolean>; // ItemID -> completed
    history: {
        [day: number]: {
            completed: boolean;
            failed: boolean;
        };
    };
}

export interface DailyTask {
    id: string;
    category: 'DSA' | 'CORE' | 'MISC' | 'MOCK';
    text: string;
    isCompleted: boolean;
    isInfoOnly?: boolean;
}
