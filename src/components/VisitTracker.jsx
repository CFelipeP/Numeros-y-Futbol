import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { API_BASE } from "../config";

const BROWSER_TOKEN_KEY = "nyf_browser_token";
const LAST_TRACK_KEY = "nyf_last_track";

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function isAuthenticated() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return !!(user && (user.rol === "admin" || user.rol === "editor"));
  } catch {
    return !!(localStorage.getItem("token") && localStorage.getItem("user"));
  }
}

const trackPageVisit = (pagina) => {
  if (isAuthenticated()) return;
  fetch(`${API_BASE}track_visita.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pagina,
      user_agent: navigator.userAgent || "",
      referer: document.referrer || "",
    }),
  }).catch(() => {});
};

const trackBrowserVisit = () => {
  if (isAuthenticated()) return;

  const lastTrack = localStorage.getItem(LAST_TRACK_KEY);
  const now = Date.now();

  if (lastTrack) {
    const diffMin = (now - parseInt(lastTrack, 10)) / 60000;
    if (diffMin < 60) return;
  }

  let token = localStorage.getItem(BROWSER_TOKEN_KEY);
  if (!token) {
    token = generateUUID();
    localStorage.setItem(BROWSER_TOKEN_KEY, token);
  }

  fetch(`${API_BASE}track_browser_visit.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      browser_token: token,
      user_agent: navigator.userAgent || "",
    }),
  })
    .then(() => {
      localStorage.setItem(LAST_TRACK_KEY, String(now));
    })
    .catch(() => {});
};

const VisitTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (!import.meta.env.PROD) return;
    trackBrowserVisit();
  }, []);

  useEffect(() => {
    if (!import.meta.env.PROD) return;
    trackPageVisit(location.pathname);
  }, [location.pathname]);

  return null;
};

export default VisitTracker;
