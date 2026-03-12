# Reset30

## Current State
No files exist. Full rebuild required.

## Requested Changes (Diff)

### Add
- Challenge selection screen with 4 challenges: 30 Day Glow Up, 30 Day Fitness Reset, 30 Day Mental Health Reset, 30 Day Money Saving Challenge
- Home screen showing current challenge, today's tasks (3 per day), streak counter, and progress bar (Day X of 30)
- Task checkboxes that mark tasks complete and save state per user
- Daily completion celebration message when all 3 tasks are done
- Points system: points awarded per task completion
- Badge milestones at Day 3, 7, 15, 30
- Random motivational quote shown on daily completion
- Progress tracked per day (days 1-30), persisted in backend

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: store active challenge, daily task completions, streak, total points, badges earned per user (using principal)
2. Backend: expose APIs to get/set challenge, get today's tasks, mark task complete, get progress/streak/points/badges
3. Frontend: challenge picker screen on first launch
4. Frontend: home screen with today's tasks, streak, progress bar
5. Frontend: task checkboxes with optimistic UI
6. Frontend: celebration modal on day completion
7. Frontend: badges display and motivational quotes
