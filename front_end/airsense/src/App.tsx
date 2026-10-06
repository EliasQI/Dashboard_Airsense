import { useState, useEffect } from "react";
import { Sidebar, Topbar } from "./components/Layout";
import { Greeting } from "./components/Greeting";
import { QualityHero } from "./components/QualityHero";
import { MetricCard } from "./components/MetricCard";
import { AiAssistant } from "./components/AiAssistant";
import { TrendChart } from "./components/TrendChart";
import { Recommendations } from "./components/Recommendations";
import { ModelPerformance } from "./components/ModelPerformance";
import { buildMetrics, getCurrent, Risk } from "./data/mock";

export default function App() {
  const [leituraBanco, setLeituraBanco] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  // Faz a conexão com a API em Flask
  useEffect(() => {
    const buscarDados = async () => {
      try {
        const resposta = await fetch('http://localhost:5000/api/leituras');
        const dados = await resposta.json();
        
        if (dados && dados.length > 0) {
          setLeituraBanco(dados[0]); // Salva a leitura mais recente
        }
      } catch (erro) {
        console.error("Erro ao buscar dados do Flask:", erro);
      } finally {
        setCarregando(false);
      }
    };

    buscarDados();
    const intervalo = setInterval(buscarDados, 5000); 
    return () => clearInterval(intervalo);
  }, []);

  if (carregando) {
    return <div className="app"><div className="content">Conectando ao banco de dados...</div></div>;
  }

  // =========================================================================
  // AQUI É A TRADUÇÃO: Pegamos a "leituraBanco" e preparamos para o Dashboard
  // =========================================================================
  
  // 1. Extrai os valores exatos que vieram do PostgreSQL
  const tempReal = leituraBanco ? leituraBanco.temperatura : 0;
  const umidReal = leituraBanco ? leituraBanco.umidade : 0;
  const gasReal = leituraBanco ? leituraBanco.leitura_gas_bruta : 0;

// 2. Define o Risco usando as strings e forçando o tipo
  let riscoCalculado = "Low" as Risk; 
  
  if (gasReal > 3000) {
    riscoCalculado = "High" as Risk;
  } else if (gasReal > 1500) {
    riscoCalculado = "Moderate" as Risk;
  }

  // 3. Monta os cards de métricas usando os dados reais
  const metricsReais = [
    { id: "1", title: "Nível de Gás", value: gasReal, unit: "ppm", trend: "neutral" },
    { id: "2", title: "Temperatura", value: tempReal, unit: "°C", trend: "neutral" },
    { id: "3", title: "Umidade", value: umidReal, unit: "%", trend: "neutral" }
  ];

  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <Topbar />
        <main className="page">
          <Greeting />
          <div className="grid">
            <div className="area-hero">
              {/* O dashboard agora usa o Gás e o Risco reais calculados acima */}
              <QualityHero index={gasReal} risk={riscoCalculado} />
            </div>
            <div className="area-assistant">
              <AiAssistant risk={riscoCalculado} />
            </div>
            <div className="area-metrics">
              {/* Os cards de métricas agora mostram Temp, Umid e Gás do banco */}
              {metricsReais.map((m: any) => (
                <MetricCard key={m.id} metric={m} />
              ))}
            </div>
            <div className="area-chart">
              <TrendChart />
            </div>
            <div className="area-recs">
              <Recommendations risk={riscoCalculado} />
            </div>
            <div className="area-model">
              <ModelPerformance />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}