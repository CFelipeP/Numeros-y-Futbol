import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { API_BASE } from "../config";

const trackVisit = (pagina) => {
    const data = {
        pagina: pagina,
        user_agent: navigator.userAgent || "",
        referer: document.referrer || "",
    };
    fetch(`${API_BASE}track_visita.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).catch(() => {});
};

const VisitTracker = () => {
    const location = useLocation();
    const prevPath = useRef(null);

    useEffect(() => {
        if (prevPath.current !== location.pathname) {
            prevPath.current = location.pathname;
            trackVisit(location.pathname);
        }
    }, [location.pathname]);

    return null;
};

export default VisitTracker;
