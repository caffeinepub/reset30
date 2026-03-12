import { ChallengeId } from "../backend";

export interface ChallengeConfig {
  id: ChallengeId;
  name: string;
  subtitle: string;
  emoji: string;
  description: string;
  gradient: string;
  accentColor: string;
  textColor: string;
  tasks: string[][];
}

export const CHALLENGES: ChallengeConfig[] = [
  {
    id: ChallengeId.glowUp,
    name: "30 Day Glow Up",
    subtitle: "Skincare • Wellness • Self-Care",
    emoji: "✨",
    description:
      "Transform your skin, body, and confidence with daily self-care rituals.",
    gradient: "from-pink-400 via-rose-400 to-orange-400",
    accentColor: "#f43f5e",
    textColor: "text-rose-600",
    tasks: [
      [
        "Drink 8 glasses of water",
        "Apply SPF 30+ sunscreen",
        "Do a 5-min face massage",
      ],
      [
        "Try a new healthy breakfast",
        "Exfoliate your skin",
        "Walk for 20 minutes",
      ],
      [
        "Write 3 things you love about yourself",
        "Use a face mask",
        "Stretch for 10 minutes",
      ],
      [
        "Meditate for 5 minutes",
        "Stay screen-free for 1 hour",
        "Moisturize morning & night",
      ],
      ["Cook a healthy meal", "Take a relaxing bath", "Write in your journal"],
      [
        "Try a new workout video",
        "Drink herbal tea",
        "Practice deep breathing",
      ],
      [
        "Sleep 8 hours tonight",
        "Treat yourself to something small",
        "Review your week",
      ],
    ],
  },
  {
    id: ChallengeId.fitnessReset,
    name: "30 Day Fitness Reset",
    subtitle: "Exercise • Movement • Health",
    emoji: "🏋️",
    description:
      "Build strength, stamina, and healthy movement habits in 30 days.",
    gradient: "from-orange-400 via-amber-400 to-yellow-400",
    accentColor: "#f97316",
    textColor: "text-orange-600",
    tasks: [
      ["Do 20 push-ups", "Walk 5,000 steps", "Stretch for 10 minutes"],
      ["Do 30 squats", "Drink 2L of water", "Take the stairs today"],
      [
        "Run or walk for 20 minutes",
        "Do 3 sets of planks (30 sec each)",
        "Eat a protein-rich meal",
      ],
      [
        "Do 15 minutes of yoga",
        "Avoid sugary drinks today",
        "Do 20 jumping jacks",
      ],
      [
        "Workout for 30 minutes",
        "Stretch all major muscle groups",
        "Go to bed by 10pm",
      ],
      [
        "Do bodyweight circuit (3 rounds)",
        "Meal prep for tomorrow",
        "Take a 10-min walk after eating",
      ],
      [
        "Active rest: light walk or swim",
        "Reflect on your fitness week",
        "Plan next week's workouts",
      ],
    ],
  },
  {
    id: ChallengeId.mentalHealth,
    name: "30 Day Mental Health Reset",
    subtitle: "Mindfulness • Journaling • Rest",
    emoji: "🧠",
    description:
      "Quiet your mind, build resilience, and nurture your inner peace.",
    gradient: "from-violet-400 via-purple-400 to-indigo-400",
    accentColor: "#8b5cf6",
    textColor: "text-violet-600",
    tasks: [
      [
        "Write 3 things you're grateful for",
        "Meditate for 5 minutes",
        "Call or text someone you love",
      ],
      [
        "Go outside for 15 minutes",
        "Write about your feelings",
        "Do one thing just for you",
      ],
      [
        "Practice deep breathing (5 min)",
        "Limit social media to 30 min",
        "Read for 20 minutes",
      ],
      [
        "Write a positive affirmation",
        "Take a long calming shower",
        "Do something creative",
      ],
      [
        "Do a digital detox for 2 hours",
        "Cook something nourishing",
        "Listen to calming music",
      ],
      [
        "Write what made you smile today",
        "Stretch or do gentle yoga",
        "Journal your goals",
      ],
      [
        "Reflect on your week's progress",
        "Treat yourself kindly",
        "Plan a fun activity for next week",
      ],
    ],
  },
  {
    id: ChallengeId.moneySaving,
    name: "30 Day Money Saving Challenge",
    subtitle: "Budgeting • Saving • Habits",
    emoji: "💰",
    description:
      "Take control of your finances and build powerful saving habits.",
    gradient: "from-emerald-400 via-teal-400 to-cyan-400",
    accentColor: "#10b981",
    textColor: "text-emerald-600",
    tasks: [
      [
        "Track all spending today",
        "Skip one unnecessary purchase",
        "Make coffee at home",
      ],
      [
        "Review your subscriptions",
        "Pack lunch instead of buying",
        "Move $5 to savings",
      ],
      [
        "Find one thing to sell or donate",
        "Cook dinner at home",
        "Research one money-saving tip",
      ],
      [
        "Set a weekly budget",
        "Use a discount code or coupon",
        "Cancel one unused subscription",
      ],
      [
        "Audit your grocery list",
        "Try a no-spend afternoon",
        "Move $10 to savings",
      ],
      [
        "Compare prices before buying",
        "Make a free activity plan",
        "Review your savings goal",
      ],
      [
        "Calculate money saved this week",
        "Reward yourself (free treat)",
        "Plan next week's budget",
      ],
    ],
  },
];

export function getChallenge(id: ChallengeId): ChallengeConfig {
  return CHALLENGES.find((c) => c.id === id) ?? CHALLENGES[0];
}

export function getTasksForDay(
  challengeId: ChallengeId,
  day: number,
): string[] {
  const challenge = getChallenge(challengeId);
  const cycleIndex = (day - 1) % 7;
  return challenge.tasks[cycleIndex];
}

export const BADGES = [
  { day: 3, emoji: "🌱", name: "Starter", description: "Completed 3 days" },
  {
    day: 7,
    emoji: "⚡",
    name: "Week Warrior",
    description: "Completed 7 days",
  },
  {
    day: 15,
    emoji: "🏆",
    name: "Halfway Hero",
    description: "Completed 15 days",
  },
  {
    day: 30,
    emoji: "👑",
    name: "Champion",
    description: "Completed all 30 days",
  },
];

export const MOTIVATIONAL_QUOTES = [
  "You're building the best version of yourself, one day at a time.",
  "Small steps lead to massive changes. Keep going!",
  "Every completed day is proof of your strength.",
  "You showed up today. That's everything.",
  "Your future self is cheering you on!",
  "Consistency beats perfection. You're doing amazing.",
  "One more day closer to the new you!",
  "Discipline is just choosing between what you want now and what you want most.",
];

export function getRandomQuote(): string {
  return MOTIVATIONAL_QUOTES[
    Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
  ];
}
