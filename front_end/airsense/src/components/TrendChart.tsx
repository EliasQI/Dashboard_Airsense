import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { LineChart as LineIcon, Table2 } from "lucide-react";
import { getSeries, ranges, type Range, type SeriesPoint } from "../data/mock";
import { RiskBadge } from "./RiskBadge";

const LINE = "#3987e5"; // série única: slot 1 da paleta categórica (azul), sem reaproveitar cores de status
const SURFACE = "#0e1530";

const timeFmt = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });
const dayFmt = new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "2-digit" });

const tickLabel = (range: Range, t: number) => (range === "7d" ? dayFmt.format(t) : timeFmt.format(t));
const fullLabel = (range: Range, t: number) =>
  range === "1h" || range === "6h" ? timeFmt.format(t) : `${dayFmt.format(t)} ${timeFmt.format(t)}`;

interface TipProps {
  range: Range;
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: SeriesPoint }>;
}

function ChartTooltip({ range, active, payload }: TipProps) {
  const p = payload?.[0]?.payload;
  if (!active || !p) return null;
  return (
    <div className="tooltip">
      <small>{fullLabel(range, p.t)}</small>
      <strong>{p.ppm} ppm</strong>
      <RiskBadge risk={p.risk} size={13} />
    </div>
  );
}

export function TrendChart() {
  const [range, setRange] = useState<Range>("6h");
  const [asTable, setAsTable] = useState(false);
  const points = useMemo(() => getSeries(range), [range]);
  const last = points[points.length - 1];
  const first = points[0];
  const ticks = Array.from({ length: 5 }, (_, k) => first.t + ((last.t - first.t) * k) / 4);

  return (
    <section className="card chart">
      <header>
        <div>
          <h3>
            <LineIcon size={20} className="accent" /> Concentração de Gases (MQ-135)
          </h3>
          <small>ppm · série temporal, com picos esperados nos horários de maior fluxo de veículos</small>
        </div>
        <div className="chart-actions">
          <button
            className={asTable ? "tab active" : "tab"}
            aria-pressed={asTable}
            onClick={() => setAsTable((v) => !v)}
            title="Alternar entre gráfico e tabela"
          >
            <Table2 size={14} /> Tabela
          </button>
          <div className="tabs" role="tablist">
            {ranges.map((r) => (
              <button
                key={r}
                role="tab"
                aria-selected={r === range}
                className={r === range ? "tab active" : "tab"}
                onClick={() => setRange(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </header>

      {asTable ? (
        <div className="chart-area table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Horário</th>
                <th>Gases (ppm)</th>
                <th>Risco</th>
              </tr>
            </thead>
            <tbody>
              {[...points].reverse().map((p) => (
                <tr key={p.t}>
                  <td>{fullLabel(range, p.t)}</td>
                  <td>{p.ppm}</td>
                  <td>
                    <RiskBadge risk={p.risk} size={13} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="chart-area">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="gasFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={LINE} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={LINE} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1c2745" vertical={false} />
              <XAxis
                dataKey="t"
                type="number"
                scale="time"
                domain={["dataMin", "dataMax"]}
                ticks={ticks}
                tickFormatter={(v: number) => tickLabel(range, v)}
                stroke="#8a93ad"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis
                domain={[0, 500]}
                ticks={[0, 100, 200, 300, 400, 500]}
                stroke="#8a93ad"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <Tooltip
                content={<ChartTooltip range={range} />}
                cursor={{ stroke: "#8a93ad", strokeDasharray: "3 3" }}
              />
              <Area
                type="monotone"
                dataKey="ppm"
                stroke={LINE}
                strokeWidth={2}
                fill="url(#gasFill)"
                dot={false}
                activeDot={{ r: 5, fill: LINE, stroke: SURFACE, strokeWidth: 2 }}
                isAnimationActive={false}
              />
              <ReferenceDot x={last.t} y={last.ppm} r={5} fill={LINE} stroke={SURFACE} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
