import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { ChallengeId } from "../backend";
import { CHALLENGES } from "../data/challenges";
import { useStartChallenge } from "../hooks/useQueries";

const ocidMap: Record<ChallengeId, string> = {
  [ChallengeId.glowUp]: "challenge.glowup_button",
  [ChallengeId.fitnessReset]: "challenge.fitness_button",
  [ChallengeId.mentalHealth]: "challenge.mentalhealth_button",
  [ChallengeId.moneySaving]: "challenge.moneysaving_button",
};

export default function ChallengeSelect() {
  const { mutate: startChallenge, isPending, variables } = useStartChallenge();

  return (
    <div className="min-h-screen app-bg flex flex-col">
      {/* Header */}
      <header className="pt-10 pb-6 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-4xl animate-float">🔄</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold text-foreground tracking-tight">
            Reset<span className="text-primary">30</span>
          </h1>
          <p className="mt-2 text-muted-foreground font-body text-lg">
            Choose your 30-day challenge and start your transformation
          </p>
        </motion.div>
      </header>

      {/* Challenge Cards */}
      <main className="flex-1 px-4 pb-12 max-w-2xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CHALLENGES.map((challenge, i) => {
            const isLoading = isPending && variables === challenge.id;
            return (
              <motion.button
                key={challenge.id}
                data-ocid={ocidMap[challenge.id]}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => startChallenge(challenge.id)}
                disabled={isPending}
                className="relative overflow-hidden rounded-2xl p-6 text-left shadow-card border border-white/60 bg-white/80 backdrop-blur-sm group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-shadow hover:shadow-glow"
              >
                {/* Gradient accent top bar */}
                <div
                  className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${challenge.gradient}`}
                />

                <div className="flex items-start gap-3">
                  <span className="text-4xl leading-none mt-0.5">
                    {challenge.emoji}
                  </span>
                  <div className="flex-1">
                    <h2
                      className={`font-display font-bold text-lg leading-tight ${challenge.textColor}`}
                    >
                      {challenge.name}
                    </h2>
                    <p className="text-xs text-muted-foreground font-body mt-0.5 mb-2">
                      {challenge.subtitle}
                    </p>
                    <p className="text-sm text-foreground/80 font-body leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    30 Days
                  </span>
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : (
                    <span
                      className={`text-sm font-bold ${challenge.textColor} group-hover:translate-x-1 transition-transform`}
                    >
                      Start →
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
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
