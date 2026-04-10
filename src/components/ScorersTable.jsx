import React from "react";

const API_BASE = "http://numeros-y-futbol.test/backend/";

const logoUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

const getPosStyle = (index) => {
  if (index === 0) return { bg: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#000", shadow: "0 0 15px rgba(251,191,36,0.4)" };
  if (index === 1) return { bg: "linear-gradient(135deg, #9ca3af, #6b7280)", color: "#000", shadow: "0 0 15px rgba(156,163,175,0.3)" };
  if (index === 2) return { bg: "linear-gradient(135deg, #d97706, #b45309)", color: "#000", shadow: "0 0 15px rgba(217,119,6,0.3)" };
  return null;
};

export default function ScorersTable({ data, title, type = "goles" }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)" }}>
        <p>No hay datos disponibles</p>
      </div>
    );
  }

  const maxGoles = data[0]?.goles || data[0]?.tarjetas_amarillas || 1;

  return (
    <div>
      {/* Encabezado */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(255,255,255,0.3)" }}>
          {data.length} {type === "goles" ? "goleadores" : type === "amarillas" ? "jugadores" : type === "rojas" ? "jugadores" : "porteros"}
        </span>
      </div>

      {/* Lista */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {data.map((player, index) => {
          const posStyle = getPosStyle(index);
          const mainValue = type === "goles" ? player.goles : type === "amarillas" ? player.tarjetas_amarillas : type === "rojas" ? player.tarjetas_rojas : player.goles_recibidos;

          return (
            <div
              key={player.id}
              style={{
                display: "flex", alignItems: "center", gap: "0.7rem",
                padding: "0.65rem 0.8rem", borderRadius: "10px",
                background: index === 0 ? "rgba(251,191,36,0.05)" : "rgba(255,255,255,0.02)",
                border: index === 0 ? "1px solid rgba(251,191,36,0.15)" : "1px solid rgba(255,255,255,0.03)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = index === 0 ? "rgba(251,191,36,0.05)" : "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = index === 0 ? "1px solid rgba(251,191,36,0.15)" : "1px solid rgba(255,255,255,0.03)"; }}
            >
              {/* Posición */}
              <div style={{ width: 28, flexShrink: 0, textAlign: "center" }}>
                {posStyle ? (
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 26, height: 26, borderRadius: "7px",
                    background: posStyle.bg, color: posStyle.color,
                    fontSize: "0.7rem", fontWeight: 900, fontFamily: "var(--font-heading)",
                    boxShadow: posStyle.shadow,
                  }}>
                    {index + 1}
                  </span>
                ) : (
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-muted)" }}>
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Foto o avatar */}
              <div style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                background: "rgba(255,255,255,0.06)", overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {player.foto ? (
                  <img src={logoUrl(player.foto)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: "1rem", opacity: 0.4 }}>👤</span>
                )}
              </div>

              {/* Nombre + equipo */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: "0.82rem", fontWeight: index < 3 ? 800 : 600,
                  color: index < 3 ? "var(--color-white)" : "var(--color-text-main)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {player.nombre}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "2px" }}>
                  {player.equipo_logo && (
                    <img src={logoUrl(player.equipo_logo)} alt="" style={{ width: 12, height: 12, objectFit: "contain" }} />
                  )}
                  <span style={{ fontSize: "0.65rem", color: "var(--color-text-muted)" }}>
                    {player.equipo_nombre}
                  </span>
                </div>
              </div>

              {/* Desglose de goles (solo para goleadores) */}
              {type === "goles" && (
                <div style={{
                  display: "flex", gap: "0.4rem", alignItems: "center",
                  marginRight: "0.3rem", flexShrink: 0,
                }}>
                  {player.goles_cabeza > 0 && (
                    <span style={{
                      fontSize: "0.55rem", fontWeight: 700, color: "#3b82f6",
                      background: "rgba(59,130,246,0.1)", padding: "2px 5px", borderRadius: "3px",
                    }} title="Goles de cabeza">
                      🗣️{player.goles_cabeza}
                    </span>
                  )}
                  {player.goles_tiro_libre > 0 && (
                    <span style={{
                      fontSize: "0.55rem", fontWeight: 700, color: "#8b5cf6",
                      background: "rgba(139,92,246,0.1)", padding: "2px 5px", borderRadius: "3px",
                    }} title="Goles de tiro libre">
                      TL{player.goles_tiro_libre}
                    </span>
                  )}
                  {player.goles_penal > 0 && (
                    <span style={{
                      fontSize: "0.55rem", fontWeight: 700, color: "#f59e0b",
                      background: "rgba(245,158,11,0.1)", padding: "2px 5px", borderRadius: "3px",
                    }} title="Goles de penalti">
                      ⚡{player.goles_penal}
                    </span>
                  )}
                </div>
              )}

              {/* Barra visual + valor principal */}
              <div style={{
                display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0,
              }}>
                <div style={{
                  width: 60, height: 4, borderRadius: "2px",
                  background: "rgba(255,255,255,0.06)", overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", borderRadius: "2px",
                    background: type === "goles"
                      ? "linear-gradient(90deg, #10b981, #34d399)"
                      : type === "amarillas"
                        ? "linear-gradient(90deg, #eab308, #facc15)"
                        : type === "rojas"
                          ? "linear-gradient(90deg, #ef4444, #f87171)"
                          : "linear-gradient(90deg, #f59e0b, #fbbf24)",
                    width: `${Math.min((mainValue / maxGoles) * 100, 100)}%`,
                    transition: "width 0.5s ease",
                  }} />
                </div>
                <span style={{
                  fontSize: "1rem", fontWeight: 900, minWidth: 30, textAlign: "right",
                  fontFamily: "var(--font-heading)",
                  color: type === "goles"
                    ? "var(--color-white)"
                    : type === "amarillas"
                      ? "#eab308"
                      : type === "rojas"
                        ? "#ef4444"
                        : "var(--color-white)",
                  textShadow: index === 0 ? "0 0 12px rgba(255,0,77,0.4)" : "none",
                }}>
                  {mainValue}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}