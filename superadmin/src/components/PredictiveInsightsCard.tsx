import { Badge } from "./ui/badge";

interface InsightCard {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  type: "opportunity" | "warning" | "info";
}

const insights: InsightCard[] = [
  {
    title: "Peak Hour Overflow Risk",
    description:
      "Business District likely to exceed capacity between 11AM-2PM on weekdays",
    impact: "high",
    type: "warning",
  },
  {
    title: "Underutilized Zone",
    description:
      "Airport parking averaging 45% utilization - consider promotional pricing",
    impact: "medium",
    type: "opportunity",
  },
  {
    title: "Demand Surge Predicted",
    description:
      "City event scheduled for Saturday - expect 40% increase in Downtown",
    impact: "high",
    type: "info",
  },
];

const getImpactBadge = (impact: InsightCard["impact"]) => {
  switch (impact) {
    case "high":
      return (
        <Badge className="bg-destructive/10 text-destructive border-0">
          High Impact
        </Badge>
      );
    case "medium":
      return (
        <Badge className="bg-orange-100 text-orange-500 border-0">Medium</Badge>
      );
    case "low":
      return <Badge variant="outline">Low</Badge>;
  }
};

const PredictiveInsightsCard = () => {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h3 className="font-semibold">Predictive Insights</h3>
        <p className="text-sm text-muted-foreground">
          AI-generated recommendations
        </p>
      </div>
      <div className="divide-y divide-border">
        {insights.map((insight, index) => (
          <div key={index} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{insight.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {insight.description}
                </p>
              </div>
              {getImpactBadge(insight.impact)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictiveInsightsCard;
