import { Bot, Heart } from "lucide-react";
import { riskLevels, type Risk } from "../data/mock";
import { riskStyle } from "./RiskBadge";

export function AiAssistant({ risk }: { risk: Risk }) {
  const info = riskLevels[risk];
  return (
    <section className="card assistant" style={riskStyle(risk)}>
      <header>
        <div className="bot">
          <Bot size={44} strokeWidth={1.4} />
        </div>
        <div>
          <h3>Assistente de IA</h3>
          <p>Sua aliada por um ar melhor</p>
        </div>
      </header>
      <div className="bubble">
        <p className="bubble-strong">{info.assistantHeadline}</p>
        <p>{info.assistantBody}</p>
        <p>
          {info.assistantClosing} <Heart size={16} className="heart" fill="currentColor" />
        </p>
      </div>
    </section>
  );
}
