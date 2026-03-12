import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Tasks = [boolean, boolean, boolean];
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export enum ChallengeId {
    moneySaving = "moneySaving",
    mentalHealth = "mentalHealth",
    fitnessReset = "fitnessReset",
    glowUp = "glowUp"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProgress(): Promise<{
        streak: bigint;
        completedTasks: Array<[bigint, Tasks]>;
        badges: Array<string>;
        challengeId: ChallengeId;
        currentDay: bigint;
        points: bigint;
        startDate: Time;
    }>;
    getTodayCompletion(): Promise<[bigint, Tasks]>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markTaskComplete(day: bigint, taskIndex: bigint): Promise<void>;
    resetChallenge(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    startChallenge(challengeId: ChallengeId): Promise<void>;
}
