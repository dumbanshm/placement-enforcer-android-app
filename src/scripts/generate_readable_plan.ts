import fs from 'fs';
import path from 'path';
import { Engine } from '../logic/engine';
import { AppState } from '../logic/types';

const OUTPUT_FILE = path.join(__dirname, '../../READABLE_PLAN.md');

// Mock state with 0 penalties for the ideal plan
const MOCK_STATE: AppState = {
    hasStarted: true,
    startDate: new Date().toISOString(),
    lastCheckInDate: null,
    dsaPenaltyCounter: 0,
    dailyProgress: {},
    finalChecklist: {},
    history: {}
};

function generateMarkdown() {
    let md = `# Antigravity Placement Prep - 50 Day Schedule\n\n`;
    md += `> **Philosophy:** ${Engine.getPlan().meta.philosophy}\n`;
    md += `> **Total Days:** ${Engine.getPlan().meta.total_days}\n\n`;

    md += `## Legend\n`;
    md += `- **DSA**: Data Structures & Algorithms (Striver A2Z)\n`;
    md += `- **CORE**: Core Subjects (OS, DBMS, CN, OOP, System Design)\n`;
    md += `- **MISC**: Resume, Projects, LLD, HR\n\n`;

    md += `### DSA Topic Breakdown\n`;
    md += `| Phase | Days | Topics |\n`;
    md += `| :--- | :---: | :--- |\n`;

    Engine.getPlan().dsa_plan.phases.forEach(phase => {
        const duration = phase.days[1] - phase.days[0] + 1;
        const topicNames = phase.topics.map(t => t.name).join(', ');
        md += `| **${phase.name}** | ${duration} | ${topicNames} |\n`;
    });
    md += `\n---\n\n`;

    const totalDays = Engine.getPlan().meta.total_days;

    // Single Condensed Table
    md += `### Condensed Schedule\n\n`;
    md += `| Day | Phase | DSA Topic | Core Subject | Misc |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- |\n`;

    for (let d = 1; d <= totalDays; d++) {
        const phaseName = Engine.getPhaseForDay(d) || '-';
        // Shorten phase name by taking the part after the dash
        const shortPhase = phaseName.includes('–') ? phaseName.split('–')[1].trim() : phaseName;

        const tasks = Engine.generateTasks(d, MOCK_STATE);

        const dsaTasks = tasks.filter(t => t.category === 'DSA' && !t.isInfoOnly);
        const coreTasks = tasks.filter(t => t.category === 'CORE');
        const miscTasks = tasks.filter(t => t.category === 'MISC');
        const mockTasks = tasks.filter(t => t.category === 'MOCK');

        let dsaStr = '-';
        let coreStr = '-';
        let miscStr = '-';

        if (mockTasks.length > 0) {
            dsaStr = `**MOCK INTERVIEW**`;
            coreStr = 'Mock';
            miscStr = 'Mock';
        } else {
            const dsaTask = dsaTasks[0];
            if (dsaTask) {
                if (dsaTask.text.includes('REVISION DAY')) dsaStr = '**Revision**';
                else dsaStr = dsaTask.text.replace(/Solve \d+ DSA questions from /, '').trim();
            }

            if (coreTasks.length > 0) {
                coreStr = coreTasks.map(t => {
                    let clean = t.text.replace(/\[(LIGHT|HEAVY)\] /, '').replace(/\(\d+ hrs\)/, '').trim();
                    if (clean === 'Operating Systems') return 'OS';
                    if (clean === 'Computer Networks') return 'CN';
                    if (clean === 'System Design (HLD)') return 'HLD';
                    if (clean === 'OOP & Design Patterns') return 'OOP';
                    if (clean === 'Revision / Notes') return 'Revision';
                    if (clean === 'Weekly Review') return 'Review';
                    if (clean === 'Full Revision') return 'Full Revision';
                    if (clean === 'Mixed Review') return 'Mixed Review';
                    return clean;
                }).join(', ');
            }

            if (miscTasks.length > 0) {
                miscStr = miscTasks.map(t => {
                    if (t.text.includes('DUE TODAY:')) return t.text.replace('DUE TODAY:', 'Due:');
                    if (t.text.includes('LLD Session')) return 'LLD Practice';
                    return t.text;
                }).join(', ');
            }
        }

        md += `| ${d} | ${shortPhase} | ${dsaStr} | ${coreStr} | ${miscStr} |\n`;
    }

    fs.writeFileSync(OUTPUT_FILE, md);
    console.log(`Successfully generated plan at: ${OUTPUT_FILE}`);
}

generateMarkdown();
