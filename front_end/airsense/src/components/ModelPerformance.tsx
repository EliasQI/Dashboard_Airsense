import { useState } from "react";
import { BrainCircuit } from "lucide-react";
import { computeMetrics, confusionMatrices, riskLevels, riskOrder, type Risk } from "../data/mock";
import { riskIcon, riskStyle } from "./RiskBadge";

// Rampa sequencial de uma só matiz (azul), do passo 700 ao 250. Em fundo escuro,
// o zero recua para a cor da superfície e o maior valor fica mais claro.
const RAMP = ["#0d366b", "#104281", "#184f95", "#1c5cab", "#256abf", "#2a78d6", "#3987e5", "#5598e7", "#6da7ec", "#86b6ef"];

const pct = (v: number) => `${(v * 100).toFixed(1).replace(".", ",")}%`;
const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);

function RiskTag({ risk }: { risk: Risk }) {
  const Icon = riskIcon[risk];
  return (
    <span className="risk-tag" style={riskStyle(risk)}>
      <Icon size={14} className="lv-icon" /> {riskLevels[risk].label}
    </span>
  );
}

export function ModelPerformance() {
  const rf = confusionMatrices.rf;
  const rows = [
    { name: "Random Forest", m: computeMetrics(confusionMatrices.rf) },
    { name: "Baseline", m: computeMetrics(confusionMatrices.baseline) },
  ];
  const max = Math.max(...rf.map((r) => Math.max(...r)));
  const total = sum(rf.map(sum));
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);

  let readout = "Passe o mouse ou foque em uma célula para ver os detalhes.";
  if (hover) {
    const v = rf[hover.r][hover.c];
    const rowTotal = sum(rf[hover.r]);
    const real = riskLevels[riskOrder[hover.r]].label;
    const pred = riskLevels[riskOrder[hover.c]].label;
    readout = `Real: ${real} · Previsto: ${pred} — ${v} ${v === 1 ? "leitura" : "leituras"} (${pct(
      rowTotal ? v / rowTotal : 0,
    )} das leituras reais de risco ${real}).`;
  }

  return (
    <section className="card model">
      <header>
        <h3>
          <BrainCircuit size={20} className="accent" /> Desempenho do Modelo
        </h3>
        <span className="tag-illustrative">Dados ilustrativos</span>
      </header>

      <div className="model-grid">
        <div>
          <table className="metrics-table">
            <caption>Conjunto de teste: {total} leituras (15% da base)</caption>
            <thead>
              <tr>
                <th>Algoritmo</th>
                <th>Acurácia</th>
                <th>Precisão (média)</th>
                <th>Recall (médio)</th>
                <th>F1-score</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ name, m }) => (
                <tr key={name}>
                  <th scope="row">{name}</th>
                  <td>{pct(m.accuracy)}</td>
                  <td>{pct(m.precision)}</td>
                  <td>{pct(m.recall)}</td>
                  <td>{pct(m.f1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="note">
            Os valores reais virão do treino com as leituras coletadas na Av. Paulista. As médias de precisão,
            recall e F1 são macro (média simples entre os 4 níveis de risco).
          </p>
        </div>

        <div>
          <div className="heat" role="group" aria-label="Matriz de confusão do Random Forest">
            <span className="heat-corner">Real ↓ · Previsto →</span>
            {riskOrder.map((r) => (
              <span key={r} className="heat-head">
                <RiskTag risk={r} />
              </span>
            ))}
            {rf.map((row, r) => (
              <div key={riskOrder[r]} className="heat-row">
                <span className="heat-label">
                  <RiskTag risk={riskOrder[r]} />
                </span>
                {row.map((v, c) => {
                  const idx = max ? Math.round((v / max) * (RAMP.length - 1)) : 0;
                  return (
                    <button
                      key={riskOrder[c]}
                      type="button"
                      className={r === c ? "cell diag" : "cell"}
                      style={{ background: RAMP[idx], color: idx >= 6 ? "#0b0b0b" : "#ffffff" }}
                      aria-label={`Real ${riskLevels[riskOrder[r]].label}, previsto ${riskLevels[riskOrder[c]].label}: ${v}`}
                      onMouseEnter={() => setHover({ r, c })}
                      onFocus={() => setHover({ r, c })}
                      onMouseLeave={() => setHover(null)}
                      onBlur={() => setHover(null)}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="scale" aria-hidden="true">
            <span>0</span>
            <i style={{ background: `linear-gradient(90deg, ${RAMP.join(",")})` }} />
            <span>{max}</span>
          </div>
          <p className="readout" aria-live="polite">
            {readout}
          </p>
        </div>
      </div>
    </section>
  );
}
