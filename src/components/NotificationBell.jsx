import { useState } from "react";

export default function NotificationBell() {

  const [notifications] = useState([
    "Nuevo usuario registrado",
    "Partido actualizado",
    "Nueva noticia publicada"
  ]);

  return (
    <div className="notification">

      🔔 {notifications.length}

      <div className="notification-dropdown">
        {notifications.map((n, i) => (
          <p key={i}>{n}</p>
        ))}
      </div>

    </div>
  );
}