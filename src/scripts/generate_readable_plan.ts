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

    for (let day = 1; day <= totalDays; day++) {
        const phaseName = Engine.getPhaseForDay(day);
        const tasks = Engine.generateTasks(day, MOCK_STATE);

        md += `### Day ${day}`;
        if (phaseName) md += ` : ${phaseName}`;
        md += `\n`;

        // Group by Category
        const dsaTasks = tasks.filter(t => t.category === 'DSA');
        const coreTasks = tasks.filter(t => t.category === 'CORE');
        const miscTasks = tasks.filter(t => t.category === 'MISC');
        const mockTasks = tasks.filter(t => t.category === 'MOCK');

        if (mockTasks.length > 0) {
            md += `🔴 **MOCK INTERVIEW DAY**\n`;
            mockTasks.forEach(t => md += `- ${t.text}\n`);
        } else {
            if (dsaTasks.length > 0) {
                md += `**DSA**\n`;
                dsaTasks.forEach(t => {
                    if (!t.isInfoOnly) md += `- [ ] ${t.text}\n`;
                    else md += `  > *${t.text}*\n`;
                });
            }

            if (coreTasks.length > 0) {
                md += `**Core Subjects**\n`;
                coreTasks.forEach(t => md += `- [ ] ${t.text}\n`);
            }

            if (miscTasks.length > 0) {
                md += `**Misc / Prep**\n`;
                miscTasks.forEach(t => md += `- [ ] ${t.text}\n`);
            }
        }

        md += `\n---\n\n`;
    }

    fs.writeFileSync(OUTPUT_FILE, md);
    console.log(`Successfully generated plan at: ${OUTPUT_FILE}`);
}

generateMarkdown();
