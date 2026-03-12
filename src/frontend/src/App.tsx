import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import ChallengeSelect from "./components/ChallengeSelect";
import Dashboard from "./components/Dashboard";
import { useActor } from "./hooks/useActor";
import { useGetProgress } from "./hooks/useQueries";

const queryClient = new QueryClient();

function AppRouter() {
  const { isFetching: actorLoading } = useActor();
  const { data: progress, isLoading: progressLoading } = useGetProgress();

  if (actorLoading || progressLoading) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-float">🔄</div>
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground font-body text-sm">
            Loading Reset30...
          </p>
        </div>
      </div>
    );
  }

  if (!progress) {
    return <ChallengeSelect />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Toaster richColors />
    </QueryClientProvider>
  );
}
