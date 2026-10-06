import type { LucideIcon } from "lucide-react";
import { BrainCircuit, Droplet, Thermometer, Wind } from "lucide-react";

/* ------------------------------------------------------------------ *
 * Tipos e dados mockados do AirSense.
 * Tudo aqui segue o TCC: sensor MQ-135 (gases em PPM) + DHT22
 * (temperatura/umidade), leituras a cada 5 min e classificação de risco
 * da IA em 4 níveis: Baixo, Moderado, Alto e Crítico.
 * Quando houver backend (FastAPI), este arquivo é substituído por chamadas
 * de API que devolvem o mesmo formato.
 * ------------------------------------------------------------------ */

export type Risk = "baixo" | "moderado" | "alto" | "critico";
export type Range = "1h" | "6h" | "24h" | "7d";

export const riskOrder: Risk[] = ["baixo", "moderado", "alto", "critico"];

export interface RiskInfo {
  label: string;
  /** Paleta de status (good / warning / serious / critical). Sempre acompanhada de ícone + rótulo. */
  color: string;
  title: string;
  summary: string;
  gasInsight: string;
  riskInsight: string;
  assistantHeadline: string;
  assistantBody: string;
  assistantClosing: string;
  recommendations: string[];
  footer: string;
}

export const riskLevels: Record<Risk, RiskInfo> = {
  baixo: {
    label: "Baixo",
    color: "#0ca30c",
    title: "Parabéns!",
    summary:
      "O ar do ambiente está em boas condições. Continue mantendo os hábitos que ajudam a preservar essa qualidade!",
    gasInsight: "O nível de gases está baixo, o que indica boa ventilação e ar renovado no ambiente.",
    riskInsight:
      "O modelo Random Forest classificou o risco como baixo, com base nos gases, na temperatura e na umidade.",
    assistantHeadline:
      "O risco da qualidade do ar está baixo! Isso é ótimo para a saúde e o bem-estar de quem circula por aqui.",
    assistantBody:
      "Continue acompanhando o painel, principalmente nos horários de maior fluxo de veículos, quando os gases tendem a subir.",
    assistantClosing: "Tudo certo por enquanto!",
    recommendations: [
      "Mantenha a ventilação natural sempre que possível.",
      "Acompanhe os horários de pico de tráfego no gráfico.",
      "Se possível, adicione plantas que ajudam a purificar o ar.",
    ],
    footer: "Você está fazendo um ótimo trabalho! Continue assim!",
  },
  moderado: {
    label: "Moderado",
    color: "#fab219",
    title: "Atenção",
    summary:
      "A concentração de gases subiu. O ar ainda é aceitável, mas vale reduzir a exposição e reforçar a ventilação.",
    gasInsight: "A concentração de gases está acima do ideal. Fique atento à evolução nas próximas leituras.",
    riskInsight:
      "O modelo classificou o risco como moderado: os gases estão elevados para a temperatura e a umidade atuais.",
    assistantHeadline: "O risco da qualidade do ar está moderado.",
    assistantBody:
      "Evite longos períodos perto de vias movimentadas e abra as janelas em horários de menor tráfego.",
    assistantClosing: "Vou continuar monitorando para você.",
    recommendations: [
      "Reforce a ventilação em horários de menor tráfego.",
      "Evite atividade física intensa ao lado de vias movimentadas.",
      "Acompanhe as próximas leituras no gráfico.",
    ],
    footer: "Fique de olho nas próximas leituras.",
  },
  alto: {
    label: "Alto",
    color: "#ec835a",
    title: "Alerta",
    summary: "Os gases estão em nível alto. Reduza o tempo de exposição e evite atividades intensas no local.",
    gasInsight: "A concentração de gases está alta, típica de horários de grande fluxo de veículos.",
    riskInsight: "O modelo classificou o risco como alto. Recomenda-se reduzir a exposição.",
    assistantHeadline: "O risco da qualidade do ar está alto.",
    assistantBody:
      "Prefira ambientes fechados e bem ventilados e evite atividades físicas intensas ao ar livre.",
    assistantClosing: "Fique atento aos próximos minutos.",
    recommendations: [
      "Reduza o tempo de exposição ao ar externo.",
      "Evite exercícios intensos na região.",
      "Pessoas com problemas respiratórios devem redobrar a atenção.",
    ],
    footer: "Reduza a exposição enquanto o nível não baixar.",
  },
  critico: {
    label: "Crítico",
    color: "#d03b3b",
    title: "Crítico",
    summary: "Os gases atingiram nível crítico. Evite a exposição e procure um local com ar mais limpo.",
    gasInsight: "A concentração de gases está em nível crítico para a saúde.",
    riskInsight: "O modelo classificou o risco como crítico. Evite permanecer no local.",
    assistantHeadline: "O risco da qualidade do ar está crítico.",
    assistantBody:
      "Evite permanecer no local e procure um ambiente com ar mais limpo. Pessoas sensíveis devem ter atenção redobrada.",
    assistantClosing: "Siga as orientações das autoridades de saúde.",
    recommendations: [
      "Evite permanecer no local.",
      "Procure um ambiente fechado com ar mais limpo.",
      "Quem tem doença respiratória ou cardiovascular deve buscar atendimento se sentir sintomas.",
    ],
    footer: "Priorize sair da área afetada.",
  },
};

export interface Metric {
  id: "gas" | "temperature" | "humidity" | "risk";
  label: string;
  value: string;
  unit: string;
  badge: string;
  risk: Risk;
  insight: string;
  aiLabel: string;
  icon: LucideIcon;
}

export interface Environment {
  name: string;
  sensor: string;
  status: "online" | "offline";
  lastUpdate: string;
}

export interface Weather {
  temperature: number;
  condition: string;
  humidity: number;
  pressure: number;
}

export const user = { name: "Elias Mendonça", firstName: "Elias", initials: "EM" };

// Corresponde a tb_sensor.localizacao no modelo de dados do TCC.
export const environment: Environment = {
  name: "Av. Paulista - Sensor 01",
  sensor: "ESP32 + MQ-135 + DHT22",
  status: "online",
  lastUpdate: "12:42",
};

// Clima externo (não vem do protótipo; sugestão de API pública no futuro).
export const weather: Weather = {
  temperature: 24,
  condition: "Céu nublado",
  humidity: 58,
  pressure: 1013,
};

/* ----------------------------- Classificação ----------------------------- */

// O TCC não define limiares. Estes valores ilustrativos saem dos exemplos da
// Tabela 2 (410 = Baixo, 450 = Moderado, 480 = Alto). Na versão real, quem
// classifica é o modelo Random Forest no backend.
export function classifyGas(ppm: number): Risk {
  if (ppm >= 520) return "critico";
  if (ppm >= 470) return "alto";
  if (ppm >= 430) return "moderado";
  return "baixo";
}

// Índice 0-100 apenas para o anel do painel (o TCC não define um índice).
export function qualityIndex(ppm: number): number {
  return Math.max(0, Math.min(100, Math.round(100 - ((ppm - 380) / 180) * 100)));
}

export interface Current {
  ppm: number;
  risk: Risk;
  index: number;
  temperature: number;
  humidity: number;
}

export function getCurrent(): Current {
  const series = getSeries("1h");
  const ppm = series[series.length - 1].ppm;
  // Temperatura e umidade da última linha da Tabela 2 do TCC (15/06/2026 08:10).
  return { ppm, risk: classifyGas(ppm), index: qualityIndex(ppm), temperature: 23.1, humidity: 64 };
}

export function buildMetrics(c: Current): Metric[] {
  const info = riskLevels[c.risk];
  return [
    {
      id: "gas",
      label: "Gases (MQ-135)",
      value: String(c.ppm),
      unit: "ppm",
      badge: info.label,
      risk: c.risk,
      insight: info.gasInsight,
      aiLabel: "IA: Gases",
      icon: Wind,
    },
    {
      id: "temperature",
      label: "Temperatura",
      value: c.temperature.toFixed(1),
      unit: "°C",
      badge: "Ideal",
      risk: "baixo",
      insight: "A temperatura está confortável e interfere pouco na leitura do sensor de gás.",
      aiLabel: "IA: Temperatura",
      icon: Thermometer,
    },
    {
      id: "humidity",
      label: "Umidade",
      value: String(Math.round(c.humidity)),
      unit: "%",
      badge: "Ideal",
      risk: "baixo",
      insight:
        "Umidade em nível ideal. O modelo usa temperatura e umidade para compensar a variação do sensor MQ-135.",
      aiLabel: "IA: Umidade",
      icon: Droplet,
    },
    {
      id: "risk",
      label: "Risco (IA)",
      value: info.label,
      unit: "",
      badge: "Modelo RF",
      risk: c.risk,
      insight: info.riskInsight,
      aiLabel: "IA: Risco",
      icon: BrainCircuit,
    },
  ];
}

/* ------------------------------ Série temporal ------------------------------ */

export interface SeriesPoint {
  t: number;
  ppm: number;
  risk: Risk;
}

// Momento da última leitura (fixo, para o mock ser determinístico).
const END = new Date(2026, 9, 3, 12, 42).getTime();
const MINUTE = 60000;

const RANGE_CFG: Record<Range, { stepMin: number; count: number }> = {
  "1h": { stepMin: 5, count: 13 },
  "6h": { stepMin: 5, count: 73 },
  "24h": { stepMin: 15, count: 97 },
  "7d": { stepMin: 60, count: 169 },
};

const bump = (h: number, mu: number, s: number) => Math.exp(-((h - mu) ** 2) / (2 * s * s));

// Simula a hipótese H2 do TCC: picos de gases nos horários de maior fluxo
// de veículos (manhã e fim de tarde), mais fracos no fim de semana.
function gasAt(date: Date): number {
  const h = date.getHours() + date.getMinutes() / 60;
  const weekend = date.getDay() === 0 || date.getDay() === 6 ? 0.5 : 1;
  const traffic = weekend * (55 * bump(h, 8.5, 1.3) + 70 * bump(h, 18.5, 1.6));
  return Math.round(400 + traffic + 8 * Math.sin(h * 3.1) + 4 * Math.sin(h * 11));
}

export function getSeries(range: Range): SeriesPoint[] {
  const { stepMin, count } = RANGE_CFG[range];
  return Array.from({ length: count }, (_, i) => {
    const t = END - (count - 1 - i) * stepMin * MINUTE;
    const ppm = gasAt(new Date(t));
    return { t, ppm, risk: classifyGas(ppm) };
  });
}

export const ranges: Range[] = ["1h", "6h", "24h", "7d"];

/* --------------------------- Desempenho do modelo --------------------------- */

// Matrizes de confusão ILUSTRATIVAS (linhas = real, colunas = previsto), na
// ordem Baixo, Moderado, Alto, Crítico. 150 leituras = 15% de 1.000 (teste).
export const confusionMatrices = {
  rf: [
    [52, 5, 1, 0],
    [4, 41, 5, 0],
    [1, 4, 27, 2],
    [0, 0, 1, 7],
  ],
  baseline: [
    [46, 10, 2, 0],
    [9, 34, 7, 0],
    [2, 8, 22, 2],
    [0, 1, 3, 4],
  ],
};

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
}

// Acurácia global e médias macro de precisão, recall e F1, calculadas a partir da matriz.
export function computeMetrics(m: number[][]): ModelMetrics {
  const n = m.length;
  const total = m.reduce((s, row) => s + row.reduce((a, b) => a + b, 0), 0);
  const correct = m.reduce((s, row, i) => s + row[i], 0);
  let p = 0;
  let r = 0;
  let f = 0;
  for (let i = 0; i < n; i++) {
    const tp = m[i][i];
    const predicted = m.reduce((s, row) => s + row[i], 0);
    const actual = m[i].reduce((a, b) => a + b, 0);
    const prec = predicted ? tp / predicted : 0;
    const rec = actual ? tp / actual : 0;
    p += prec;
    r += rec;
    f += prec + rec ? (2 * prec * rec) / (prec + rec) : 0;
  }
  return { accuracy: correct / total, precision: p / n, recall: r / n, f1: f / n };
}
