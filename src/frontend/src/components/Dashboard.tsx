import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Loader2, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  BADGES,
  getChallenge,
  getRandomQuote,
  getTasksForDay,
} from "../data/challenges";
import {
  useGetProgress,
  useGetTodayCompletion,
  useMarkTaskComplete,
  useResetChallenge,
} from "../hooks/useQueries";

export default function Dashboard() {
  const { data: progress, isLoading: progressLoading } = useGetProgress();
  const { data: today, isLoading: todayLoading } = useGetTodayCompletion();
  const { mutate: markTask, isPending: markingTask } = useMarkTaskComplete();
  const { mutate: resetChallenge, isPending: resetting } = useResetChallenge();
  const [quote, setQuote] = useState("");

  const isLoading = progressLoading || todayLoading;

  const dayNumber = today ? Number(today[0]) : 1;
  const tasks = today
    ? today[1]
    : ([false, false, false] as [boolean, boolean, boolean]);
  const allDone = tasks[0] && tasks[1] && tasks[2];

  const challenge = progress ? getChallenge(progress.challengeId) : null;
  const dayTasks = challenge
    ? getTasksForDay(challenge.id, dayNumber)
    : ["Task 1", "Task 2", "Task 3"];
  const streak = progress ? Number(progress.streak) : 0;
  const points = progress ? Number(progress.points) : 0;
  const earnedBadges = progress ? progress.badges : [];
  const currentDay = progress ? Number(progress.currentDay) : 1;

  useEffect(() => {
    if (allDone) {
      setQuote(getRandomQuote());
    }
  }, [allDone]);

  const handleCheck = (taskIndex: number, checked: boolean) => {
    if (!checked || !today) return;
    markTask({ day: today[0], taskIndex: BigInt(taskIndex) });
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen app-bg flex items-center justify-center"
        data-ocid="dashboard.loading_state"
      >
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground font-body">
            Loading your challenge...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-bg flex flex-col">
      {/* Header */}
      <header className="px-4 pt-8 pb-4 max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
              Reset<span className="text-primary">30</span>
            </h1>
            {challenge && (
              <p
                className={`text-sm font-semibold ${challenge.textColor} mt-0.5`}
              >
                {challenge.emoji} {challenge.name}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/80 backdrop-blur-sm border border-border rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-xs">
              <span className="text-lg">⭐</span>
              <span className="font-display font-bold text-foreground text-sm">
                {points} pts
              </span>
            </div>
          </div>
        </motion.div>
      </header>

      <main className="flex-1 px-4 pb-10 max-w-2xl mx-auto w-full space-y-4">
        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-card border border-white/60"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Progress
              </p>
              <p className="font-display text-2xl font-extrabold text-foreground">
                Day {currentDay}{" "}
                <span className="text-muted-foreground font-normal text-lg">
                  of 30
                </span>
              </p>
            </div>
            <div
              data-ocid="dashboard.streak_panel"
              className="bg-gradient-to-br from-orange-100 to-amber-50 border border-orange-200 rounded-xl px-3 py-2 text-center"
            >
              <p className="text-xl">🔥</p>
              <p className="font-display font-bold text-sm text-orange-600">
                {streak} day{streak !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-orange-400">streak</p>
            </div>
          </div>

          {/* Progress bar */}
          <div data-ocid="dashboard.progress_bar" className="relative">
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min((currentDay / 30) * 100, 100)}%`,
                }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className="h-full rounded-full progress-gradient"
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">Day 1</span>
              <span className="text-xs font-semibold text-foreground">
                {Math.round((currentDay / 30) * 100)}%
              </span>
              <span className="text-xs text-muted-foreground">Day 30</span>
            </div>
          </div>
        </motion.div>

        {/* Today's Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-card border border-white/60"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📋</span>
            <div>
              <h2 className="font-display font-bold text-lg text-foreground">
                Today's Tasks
              </h2>
              <p className="text-xs text-muted-foreground">
                Day {dayNumber} • Complete all 3
              </p>
            </div>
            <div className="ml-auto">
              <span className="text-sm font-semibold text-muted-foreground">
                {tasks.filter(Boolean).length}/3
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {dayTasks.map((taskText, idx) => {
              const done = tasks[idx as 0 | 1 | 2];
              const ocid = `task.checkbox.${idx + 1}`;
              return (
                <motion.div
                  key={taskText}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.08 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    done
                      ? "bg-emerald-50 border border-emerald-200"
                      : "bg-muted/40 border border-transparent"
                  }`}
                >
                  <Checkbox
                    data-ocid={ocid}
                    id={`task-${idx}`}
                    checked={done}
                    onCheckedChange={(checked) => handleCheck(idx, !!checked)}
                    disabled={done || markingTask}
                    className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  />
                  <label
                    htmlFor={`task-${idx}`}
                    className={`flex-1 text-sm font-medium cursor-pointer ${
                      done
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {taskText}
                  </label>
                  {done && <span className="text-emerald-500 text-lg">✓</span>}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Celebration Banner */}
        <AnimatePresence>
          {allDone && (
            <motion.div
              data-ocid="dashboard.celebration_panel"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="celebrate-pulse bg-gradient-to-br from-amber-400 via-orange-400 to-pink-400 rounded-2xl p-5 shadow-glow text-white"
            >
              <div className="text-center">
                <p className="text-3xl mb-1">🎉</p>
                <h3 className="font-display text-xl font-extrabold">
                  Great job! Day {dayNumber} completed!
                </h3>
                {quote && (
                  <p className="mt-2 text-sm text-white/90 italic leading-relaxed">
                    &ldquo;{quote}&rdquo;
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badges */}
        <motion.div
          data-ocid="dashboard.badges_panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-card border border-white/60"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🏅</span>
            <h2 className="font-display font-bold text-lg text-foreground">
              Badges
            </h2>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {BADGES.map((badge) => {
              const earned =
                earnedBadges.includes(badge.name) || currentDay >= badge.day;
              return (
                <div
                  key={badge.day}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                    earned
                      ? "bg-gradient-to-b from-amber-50 to-orange-50 border-amber-200 badge-glow"
                      : "bg-muted/30 border-border opacity-40"
                  }`}
                >
                  <span className={`text-2xl ${earned ? "" : "grayscale"}`}>
                    {badge.emoji}
                  </span>
                  <p className="text-xs font-bold text-foreground leading-tight">
                    {badge.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Day {badge.day}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Reset */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center pb-2"
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                data-ocid="dashboard.reset_button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Switch Challenge
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Switch Challenge?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset your current progress, streak, and points. Are
                  you sure?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel data-ocid="dashboard.cancel_button">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  data-ocid="dashboard.confirm_button"
                  onClick={() => resetChallenge()}
                  disabled={resetting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {resetting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Yes, Reset"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground pb-6 px-4">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
