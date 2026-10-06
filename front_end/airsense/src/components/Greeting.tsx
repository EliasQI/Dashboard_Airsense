import { ChevronRight, CloudSun, Droplet, Gauge, Home } from "lucide-react";
import { environment, user, weather } from "../data/mock";

export function Greeting() {
  return (
    <div className="greeting">
      <div>
        <h1>Olá, {user.firstName}!</h1>
        <p>Aqui está o status da qualidade do ar do seu ambiente.</p>
      </div>
      <button className="env-card">
        <Home size={30} className="accent" />
        <span className="env-text">
          <small>Ambiente</small>
          <strong>{environment.name}</strong>
        </span>
        <ChevronRight size={18} />
      </button>
      <div className="weather-card">
        <CloudSun size={36} />
        <div className="weather-main">
          <strong>{weather.temperature}°C</strong>
          <small>{weather.condition}</small>
        </div>
        <span className="vline" />
        <div className="weather-stat">
          <small>Umidade</small>
          <span>
            <Droplet size={13} className="accent" /> {weather.humidity}%
          </span>
        </div>
        <div className="weather-stat">
          <small>Pressão</small>
          <span>
            <Gauge size={13} /> {weather.pressure} hPa
          </span>
        </div>
      </div>
    </div>
  );
}
