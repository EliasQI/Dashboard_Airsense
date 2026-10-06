import { useState } from "react";
import { Bell, ChevronDown, Clock, Home, Leaf, Settings, SlidersHorizontal } from "lucide-react";
import { environment, user } from "../data/mock";

const items = [
  { id: "inicio", label: "Início", icon: Home },
  { id: "ambiente", label: "Ambiente", icon: SlidersHorizontal },
  { id: "historico", label: "Histórico", icon: Clock },
  { id: "config", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const [active, setActive] = useState("inicio");
  return (
    <aside className="sidebar">
      <div className="brand">
        <Leaf size={26} className="brand-leaf" />
        <span>AirSense</span>
      </div>
      <nav>
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${active === id ? "active" : ""}`}
            onClick={() => setActive(id)}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export function Topbar() {
  return (
    <header className="topbar">
      <p className="tagline">Ambientes mais saudáveis, sempre.</p>
      <div className="topbar-right">
        <div className="status">
          <span className="status-line">
            <i className={`dot ${environment.status}`} />
            {environment.status === "online" ? "Online" : "Offline"}
          </span>
          <small>Última atualização: {environment.lastUpdate}</small>
        </div>
        <span className="divider" />
        <button className="icon-btn" aria-label="Notificações">
          <Bell size={20} />
        </button>
        <div className="user">
          <span className="avatar">{user.initials}</span>
          <span>{user.name}</span>
          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
}
