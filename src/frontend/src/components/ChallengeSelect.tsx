import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { ChallengeId } from "../backend";
import { CHALLENGES } from "../data/challenges";
import { useStartChallenge } from "../hooks/useQueries";

interface Props {
  onStarted: () => void;
}

const CHALLENGE_ORDER: ChallengeId[] = [
  ChallengeId.glowUp,
  ChallengeId.fitnessReset,
  ChallengeId.mentalHealth,
  ChallengeId.moneySaving,
];

export default function ChallengeSelect({ onStarted }: Props) {
  const { mutate: startChallenge, isPending, variables } = useStartChallenge();

  const orderedChallenges = CHALLENGE_ORDER.map(
    (id) => CHALLENGES.find((c) => c.id === id)!,
  );

  const handleStart = (challengeId: ChallengeId) => {
    startChallenge(challengeId, {
      onSuccess: () => {
        onStarted();
      },
    });
  };

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
          {orderedChallenges.map((challenge, i) => {
            const isLoading = isPending && variables === challenge.id;
            const cardOcid = `challenge.item.${i + 1}`;
            const btnOcid = `challenge.select_button.${i + 1}`;
            return (
              <motion.div
                key={challenge.id}
                data-ocid={cardOcid}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className="relative overflow-hidden rounded-2xl shadow-card border border-white/60 bg-white/80 backdrop-blur-sm"
              >
                {/* Gradient accent top bar */}
                <div
                  className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${challenge.gradient}`}
                />

                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
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

                  <Button
                    data-ocid={btnOcid}
                    onClick={() => handleStart(challenge.id)}
                    disabled={isPending}
                    className={`w-full font-display font-bold text-base py-5 bg-gradient-to-r ${challenge.gradient} text-white border-0 hover:opacity-90 transition-opacity shadow-md`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Starting...
                      </>
                    ) : (
                      "Start Challenge →"
                    )}
                  </Button>
                </div>
              </motion.div>
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
