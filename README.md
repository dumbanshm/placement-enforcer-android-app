# Placement (Antigravity) Protocol

> "Execution over feelings."

This is a personal execution enforcement tool designed to ensure completion of the "Placement Master Plan". It is not a productivity app. It is a boss that lives in your phone.

## How to Run

1. **Install Dependencies**:
   ```bash
   cd mobile
   npm install
   ```

2. **Start Server**:
   ```bash
   npx expo start --tunnel
   ```
   *Note: `--tunnel` is required if you are on a restricted network (e.g., college wifi).*

3. **Run on Device**:
   - Install **Expo Go** on Android.
   - Scan the QR code.

## Architecture

- **Stack**: React Native (Expo) + TypeScript.
- **Storage**: `AsyncStorage` (Local only).
- **Logic**: 
  - `src/logic/engine.ts`: The brain. parses `master_plan.json`.
  - `src/services/storage.ts`: Persistence.
- **Rules**:
  - Days never pause.
  - Missed DSA adds penalties (+2 questions/day).
  - No settings. No negotiation.

## Features

- **Daily Dashboard**: Auto-generated tasks based on Day #.
- **Night Check-in**: Accountability modal. Recording failure increases penalty.
- **Stats Tracking**: View backlog and consistency metrics.
