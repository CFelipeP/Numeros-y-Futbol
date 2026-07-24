import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: "100vh", padding: 40,
          background: "#0f172a", color: "#fff", fontFamily: "system-ui, sans-serif",
          textAlign: "center"
        }}>
          <h1 style={{ fontSize: 72, margin: 0, color: "#ff004d" }}>!</h1>
          <h2 style={{ fontSize: 24, marginTop: 16 }}>Algo sali mal</h2>
          <p style={{ color: "#94a3b8", maxWidth: 400, margin: "8px 0 24px" }}>
            Ocurri un error inesperado. Intent recargar la pgina.
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
            style={{
              background: "#ff004d", color: "#fff", border: "none",
              padding: "12px 32px", borderRadius: 8, cursor: "pointer",
              fontSize: 16, fontWeight: 600
            }}
          >
            Recargar pgina
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
