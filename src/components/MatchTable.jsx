import Swal from "sweetalert2";

export default function MatchTable({ matches, deleteMatch }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Local</th>
          <th>Visitante</th>
          <th>Resultado</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {matches.map((match) => (
          <tr key={match.id}>
            <td>{match.date}</td>
            <td>{match.home}</td>
            <td>{match.away}</td>
            <td>{match.score}</td>

            <td>
              <span
                className={`status ${
                  match.status === "Finalizado" ? "done" : "pending"
                }`}
              >
                {match.status}
              </span>
            </td>

            <td>
              <button
                className="btn-delete"
                onClick={() => deleteMatch(match.id)}
              >
                ❌
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}