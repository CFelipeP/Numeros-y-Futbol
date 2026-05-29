// Ruta relativa al servidor (funciona con IP local, ngrok, dominio, etc.)
const API_BASE = "/backend/";

export { API_BASE };

export const fixUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://numeros-y-futbol.test")) {
    return url.replace(
      "http://numeros-y-futbol.test",
      API_BASE.replace("/backend/", "")
    );
  }
  return url;
};