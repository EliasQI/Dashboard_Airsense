import { Sparkles } from "lucide-react";
import { riskLevels, type Risk } from "../data/mock";
import { riskIcon, riskStyle } from "./RiskBadge";

interface Props {
  index: number;
  risk: Risk;
}

const SIZE = 220;
const STROKE = 14;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

export function QualityHero({ index, risk }: Props) {
  const info = riskLevels[risk];
  const Icon = riskIcon[risk];
  const offset = C * (1 - index / 100);
  return (
    <section className="card hero" style={riskStyle(risk)}>
      <div className="gauge" role="img" aria-label={`Risco ${info.label}, índice ${index} de 100`}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} className="gauge-track" strokeWidth={STROKE} />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            className="gauge-value"
            strokeWidth={STROKE}
            strokeDasharray={C}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        </svg>
        <div className="gauge-center">
          <small>Risco do ar</small>
          <strong>{info.label}</strong>
          <span>{index} / 100</span>
        </div>
      </div>
      <div className="hero-text">
        <h2>
          <Icon size={24} className="lv-icon" /> {info.title}
        </h2>
        <p>{info.summary}</p>
        <button className="pill-btn">
          <Sparkles size={14} /> IA: Resumo geral
        </button>
      </div>
    </section>
  );
}
