export interface Task {
  text: string;
  completed: boolean;
}

export interface Profile {
  challengeId: bigint;
  challengeName: string;
  currentDay: bigint;
  streak: bigint;
  points: bigint;
  badges: string[];
}

export interface Backend {
  getProfile(): Promise<Profile>;
  selectChallenge(id: bigint): Promise<void>;
  getTodayTasks(): Promise<Task[]>;
  markTask(taskIdx: bigint): Promise<void>;
  advanceDay(): Promise<{ ok: bigint } | { err: string }>;
}

export declare const backend: Backend;
