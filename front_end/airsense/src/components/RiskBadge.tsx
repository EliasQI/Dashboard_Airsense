import type { CSSProperties } from "react";
import { AlertCircle, AlertOctagon, AlertTriangle, CheckCircle2, type LucideIcon } from "lucide-react";
import { riskLevels, type Risk } from "../data/mock";

// Cada nível tem cor E ícone de formato diferente, então a informação
// nunca depende só da cor (daltonismo, impressão).
export const riskIcon: Record<Risk, LucideIcon> = {
  baixo: CheckCircle2,
  moderado: AlertCircle,
  alto: AlertTriangle,
  critico: AlertOctagon,
};

/** Expõe a cor do nível como variável CSS --lv para o elemento e seus filhos. */
export const riskStyle = (risk: Risk): CSSProperties => ({ "--lv": riskLevels[risk].color }) as CSSProperties;

interface Props {
  risk: Risk;
  label?: string;
  size?: number;
}

export function RiskBadge({ risk, label, size = 14 }: Props) {
  const Icon = riskIcon[risk];
  return (
    <span className="badge" style={riskStyle(risk)}>
      <Icon size={size} />
      {label ?? riskLevels[risk].label}
    </span>
  );
}
