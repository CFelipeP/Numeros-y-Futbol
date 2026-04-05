const getApiBase = () => {
  const host = window.location.hostname;
  if (host.includes("ngrok")) {
    return "https://limnologic-carline-nontelescoping.ngrok-free.dev/backend/";
  }
  return "http://numeros-y-futbol.test/backend/";
};

export const API_BASE = getApiBase();

// Arregla URLs de imágenes que vienen de la DB con http:// quemado
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