import React from "react";

const API_BASE = "http://numeros-y-futbol.test/backend/";

const logoUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

const posColor = (pos) => {
  switch (pos) {
    case "portero": return "#f59e0b";
    case "defensa": return "#3b82f6";
    case "medio": return "#10b981";
    case "delantero": return "#ef4444";
    default: return "#6b7280";
  }
};

const posLabel = (pos) => {
  switch (pos) {
    case "portero": return "POR";
    case "defensa": return "DEF";
    case "medio": return "MED";
    case "delantero": return "DEL";
    default: return pos;
  }
};

const posIcon = (pos) => {
  switch (pos) {
    case "portero": return "🧤";
    case "defensa": return "🛡️";
    case "medio": return "⚙️";
    case "delantero": return "⚽";
    default: return "👤";
  }
};

// Componente para la fila de cada jugador
const PlayerRow = ({ player, index }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: "36px 44px 1fr 60px 50px 50px 50px 50px 50px",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.7rem 0.8rem",
    borderRadius: "10px",
    background: index % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
    border: "1px solid rgba(255,255,255,0.03)",
    fontSize: "0.8rem",
    transition: "all 0.2s ease",
  }}
  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
  onMouseLeave={(e) => { e.currentTarget.style.background = index % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent"; }}
  >
    {/* Número */}
    <span style={{ textAlign: "center", fontWeight: 700, color: "var(--color-text-muted)", fontFamily: "var(--font-heading)" }}>
      {player.numero_camiseta || "-"}
    </span>

    {/* Foto */}
    <div style={{
      width: 36, height: 36, borderRadius: "50%",
      background: "rgba(255,255,255,0.06)", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      border: `2px solid ${posColor(player.posicion)}30`,
    }}>
      {player.foto ? (
        <img src={logoUrl(player.foto)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span style={{ fontSize: "1rem" }}>{posIcon(player.posicion)}</span>
      )}
    </div>

    {/* Nombre */}
    <div style={{ minWidth: 0 }}>
      <div style={{ fontWeight: 700, color: "var(--color-white)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {player.nombre}
      </div>
      <span style={{
        fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "1px", color: posColor(player.posicion),
        background: `${posColor(player.posicion)}15`,
        padding: "1px 6px", borderRadius: "3px",
      }}>
        {posLabel(player.posicion)}
      </span>
    </div>

    {/* PJ */}
    <span style={{ textAlign: "center", color: "var(--color-text-muted)", fontWeight: 600 }}>{player.pj}</span>

    {/* Goles */}
    <span style={{
      textAlign: "center", fontWeight: 800, color: player.goles > 0 ? "#10b981" : "var(--color-text-muted)",
      fontFamily: "var(--font-heading)",
    }}>
      {player.goles || 0}
    </span>

    {/* Asistencias */}
    <span style={{
      textAlign: "center", fontWeight: 700, color: player.asistencias > 0 ? "#3b82f6" : "var(--color-text-muted)",
    }}>
      {player.asistencias || 0}
    </span>

    {/* Amarillas */}
    <span style={{ textAlign: "center" }}>
      {player.amarillas > 0 ? (
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 22, height: 22, borderRadius: "4px",
          background: "rgba(234,179,8,0.15)", color: "#eab308",
          fontWeight: 800, fontSize: "0.75rem",
        }}>
          {player.amarillas}
        </span>
      ) : (
        <span style={{ color: "var(--color-text-muted)", opacity: 0.3 }}>0</span>
      )}
    </span>

    {/* Rojas */}
    <span style={{ textAlign: "center" }}>
      {player.rojas > 0 ? (
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 22, height: 22, borderRadius: "4px",
          background: "rgba(239,68,68,0.15)", color: "#ef4444",
          fontWeight: 800, fontSize: "0.75rem",
        }}>
          {player.rojas}
        </span>
      ) : (
        <span style={{ color: "var(--color-text-muted)", opacity: 0.3 }}>0</span>
      )}
    </span>

    {/* Minutos */}
    <span style={{ textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
      {player.minutos || 0}′
    </span>
  </div>
);

export default function TeamDetailModal({ equipo, jugadores, onClose }) {
  if (!equipo) return null;

  // Agrupar jugadores por posición
  const porteros = jugadores.filter((j) => j.posicion === "portero");
  const defensas = jugadores.filter((j) => j.posicion === "defensa");
  const medios = jugadores.filter((j) => j.posicion === "medio");
  const delanteros = jugadores.filter((j) => j.posicion === "delantero");

  const renderGroup = (title, players, icon) => {
    if (players.length === 0) return null;
    return (
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          marginBottom: "0.7rem", paddingBottom: "0.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          <span style={{ fontSize: "0.9rem" }}>{icon}</span>
          <span style={{
            fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase",
            letterSpacing: "1.5px", color: "var(--color-text-muted)",
          }}>
            {title} ({players.length})
          </span>
        </div>
        {/* Header de columnas */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "36px 44px 1fr 60px 50px 50px 50px 50px 50px",
          gap: "0.5rem", padding: "0 0.8rem 0.5rem",
          fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "1px", color: "rgba(255,255,255,0.3)",
        }}>
          <span style={{ textAlign: "center" }}>#</span>
          <span></span>
          <span>Jugador</span>
          <span style={{ textAlign: "center" }}>PJ</span>
          <span style={{ textAlign: "center" }}>GOL</span>
          <span style={{ textAlign: "center" }}>AST</span>
          <span style={{ textAlign: "center" }}>🟨</span>
          <span style={{ textAlign: "center" }}>🟥</span>
          <span style={{ textAlign: "center" }}>MIN</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {players.map((p, i) => (
            <PlayerRow key={p.id} player={p} index={i} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem", animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: "800px", maxHeight: "85vh",
          background: "linear-gradient(180deg, #141922 0%, #0d1117 100%)",
          borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          overflow: "hidden", display: "flex", flexDirection: "column",
          animation: "slideUp 0.3s ease",
        }}
      >
        {/* Header del modal */}
        <div style={{
          position: "relative", padding: "1.5rem 1.8rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "linear-gradient(135deg, rgba(255,0,77,0.05) 0%, transparent 60%)",
        }}>
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: "1rem", right: "1rem",
              width: 36, height: 36, borderRadius: "10px",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--color-text-muted)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.2rem", fontWeight: 300, lineHeight: 1,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "var(--color-text-muted)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
          >
            ✕
          </button>

          {/* Info del equipo */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              border: "2px solid rgba(255,255,255,0.1)",
              padding: "10px", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            }}>
              <img src={logoUrl(equipo.logo)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <div>
              <h2 style={{
                fontFamily: "var(--font-heading)", fontSize: "1.5rem",
                fontWeight: 900, color: "var(--color-white)", margin: "0 0 0.3rem 0",
              }}>
                {equipo.nombre}
              </h2>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {equipo.ciudad && (
                  <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    📍 {equipo.ciudad}
                  </span>
                )}
                {equipo.estadio && (
                  <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    🏟️ {equipo.estadio}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats rápidos del equipo */}
          {equipo.puntos !== null && (
            <div style={{
              display: "flex", gap: "0.8rem", marginTop: "1rem",
              padding: "0.8rem 1rem", borderRadius: "12px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}>
              {[
                { label: "PTS", value: equipo.puntos, color: "var(--color-accent)" },
                { label: "PJ", value: equipo.partidos_jugados, color: "var(--color-text-muted)" },
                { label: "G", value: equipo.ganados, color: "#10b981" },
                { label: "E", value: equipo.empatados, color: "#f59e0b" },
                { label: "P", value: equipo.perdidos, color: "#ef4444" },
                { label: "GF", value: equipo.goles_favor, color: "var(--color-text-main)" },
                { label: "GC", value: equipo.goles_contra, color: "var(--color-text-main)" },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: "1rem", fontWeight: 800, color: s.color, fontFamily: "var(--font-heading)", lineHeight: 1 }}>
                    {s.value ?? 0}
                  </div>
                  <div style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", marginTop: "0.2rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lista de jugadores */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 1.8rem" }}>
          {jugadores.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-text-muted)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem", opacity: 0.3 }}>👥</div>
              <p style={{ margin: 0 }}>No hay jugadores registrados</p>
            </div>
          ) : (
            <>
              {renderGroup("Porteros", porteros, "🧤")}
              {renderGroup("Defensas", defensas, "🛡️")}
              {renderGroup("Mediocampistas", medios, "⚙️")}
              {renderGroup("Delanteros", delanteros, "⚽")}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}