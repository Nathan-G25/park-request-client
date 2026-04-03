import { useQuery } from "@tanstack/react-query";
import { BrainCircuit, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { z } from "zod";

// --- Schema & Fetcher ---
export const aiInsightResponseSchema = z.object({
  insight: z.string(),
});

export type AiInsightResponse = z.infer<typeof aiInsightResponseSchema>;

const fetchAiInsight = async (): Promise<AiInsightResponse> => {
  const storedUser = localStorage.getItem("user");
  const { accessToken } = JSON.parse(storedUser || "{}");

  const response = await fetch("http://localhost:3000/admin/ai-insight", {
    headers: { 
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
  });

  if (!response.ok) throw new Error("AI Insight generation failed");
  
  const data = await response.json();
  return aiInsightResponseSchema.parse(data);
};

const PredictiveInsightsCard = () => {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["ai-system-insight"],
    queryFn: fetchAiInsight,
    staleTime: 1000 * 60 * 15, 
    retry: false,
  });

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="border-b border-border px-5 py-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <BrainCircuit className="size-4 text-blue-600" />
            Predictive Insights
          </h3>
          <p className="text-sm text-muted-foreground">
            AI-generated system analysis
          </p>
        </div>
        {isFetching && !isLoading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
      </div>

      {/* Content */}
      <div className="p-5">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Loader2 className="size-8 animate-spin text-blue-500" />
            <p className="text-sm text-muted-foreground animate-pulse">
              Consulting Chief Operations AI...
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertCircle className="size-8 text-destructive mb-2" />
            <p className="text-sm font-medium text-destructive">Failed to load insights</p>
            <button 
              onClick={() => refetch()}
              className="mt-2 text-xs text-muted-foreground underline hover:text-primary"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="relative">
            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line italic border-l-2 border-blue-100 pl-4">
              {data?.insight}
            </p>
            
            <div className="mt-6 flex justify-end">
              <Badge variant="secondary" className="text-[10px] uppercase font-mono">
               Ai Analysis
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictiveInsightsCard;