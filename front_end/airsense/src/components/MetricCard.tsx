import { Sparkles } from "lucide-react";
import type { Metric } from "../data/mock";
import { RiskBadge, riskIcon, riskStyle } from "./RiskBadge";

export function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;
  const InsightIcon = riskIcon[metric.risk];
  return (
    <article className="card metric" style={riskStyle(metric.risk)}>
      <div className="metric-head">
        <Icon size={34} className="metric-icon" strokeWidth={1.6} />
        <div>
          <span className="metric-label">{metric.label}</span>
          <div className="metric-value">
            <strong>{metric.value}</strong>
            {metric.unit && <small>{metric.unit}</small>}
          </div>
          <RiskBadge risk={metric.risk} label={metric.badge} size={13} />
        </div>
      </div>
      <p className="insight">
        <InsightIcon size={16} className="lv-icon" />
        {metric.insight}
      </p>
      <button className="ai-link">
        <Sparkles size={14} /> {metric.aiLabel}
      </button>
    </article>
  );
}
