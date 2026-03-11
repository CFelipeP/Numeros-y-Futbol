import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { team: "Águila", goles: 15 },
  { team: "FAS", goles: 10 },
  { team: "Alianza", goles: 18 }
];

export default function GoalsChart() {

  return (

    <BarChart width={400} height={250} data={data}>
      <XAxis dataKey="team" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="goles" />
    </BarChart>

  );

} 