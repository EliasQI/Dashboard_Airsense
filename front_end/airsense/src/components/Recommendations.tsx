import { Lightbulb } from "lucide-react";
import { riskLevels, type Risk } from "../data/mock";
import { riskIcon, riskStyle } from "./RiskBadge";

export function Recommendations({ risk }: { risk: Risk }) {
  const info = riskLevels[risk];
  const Icon = riskIcon[risk];
  return (
    <section className="card recs" style={riskStyle(risk)}>
      <h3>
        <Lightbulb size={20} className="yellow" /> Recomendações da IA
      </h3>
      <ul>
        {info.recommendations.map((r) => (
          <li key={r}>
            <Icon size={18} className="lv-icon" /> {r}
          </li>
        ))}
      </ul>
      <p className="recs-footer">
        <Icon size={18} className="lv-icon" /> {info.footer}
      </p>
    </section>
  );
}
