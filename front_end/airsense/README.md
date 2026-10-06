# AirSense — Front end

React + Vite + TypeScript. Dados mockados em `src/data/mock.ts`, alinhados ao TCC
(ESP32 + MQ-135 + DHT22, leituras a cada 5 min, risco em 4 níveis: Baixo, Moderado, Alto, Crítico).

```bash
npm install
npm run dev     # http://localhost:5173
npm run build
```

## Estrutura
- `src/data/mock.ts` — tipos e dados falsos (trocar por chamadas à API/FastAPI depois)
- `src/components/` — Layout, Greeting, QualityHero, MetricCard, AiAssistant, TrendChart, Recommendations, ModelPerformance, RiskBadge
- `src/styles.css` — tema escuro com variáveis CSS (`--lv` = cor do nível de risco atual)

## Observações
- Os limiares de risco em `classifyGas` e o índice 0-100 do anel são **ilustrativos**; o TCC não os define.
  No sistema real, quem classifica é o Random Forest no backend.
- A seção "Desempenho do Modelo" usa matrizes de confusão fictícias; as métricas são calculadas a partir delas.
