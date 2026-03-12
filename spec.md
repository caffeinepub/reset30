# Reset30

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Challenge selection screen with 4 challenges: Glow Up, Fitness Reset, Mental Health Reset, Money Saving Challenge
- 30 days of tasks per challenge (3 tasks per day)
- Home dashboard: current challenge, today's tasks with checkboxes, streak counter, Day X/30 progress bar
- Day completion celebration message when all 3 tasks are checked
- Points system: earn points per task completed
- Badge unlocks at Day 3, 7, 15, 30
- Random motivational quotes shown on day completion
- Persistent state stored in backend (challenge, completed tasks, streak, points, badges)

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: store user's active challenge, per-day task completion, streak, points, earned badges
2. Backend: query endpoints for current state, mark task complete, get today's tasks, get badges
3. Frontend: ChallengeSelect screen (shown when no active challenge)
4. Frontend: Dashboard (home) with today's tasks, streak, progress bar
5. Frontend: Task checkboxes with optimistic updates
6. Frontend: Day completion modal/banner with motivational quote
7. Frontend: Badges/rewards section showing earned and locked badges
8. Frontend: All challenge task data defined as static content in frontend
