import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { BarChart3 } from 'lucide-react';

const GoalsChart = ({ data }) => {
  // Estado vacío cuando no hay datos
  if (!data || data.length === 0) {
    return (
      <div style={{
        width: '100%',
        height: 300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        color: '#475569',
      }}>
        <BarChart3 size={40} style={{ opacity: 0.15 }} />
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#64748b' }}>
          Sin datos de goles
        </p>
        <p style={{ margin: 0, fontSize: '12px', opacity: 0.5 }}>
          Los datos aparecerán cuando se jueguen partidos
        </p>
      </div>
    );
  }

  // Calcular min/max para que el eje Y se ajuste bien
  const maxGoles = Math.max(...data.map(d => d.goles), 1);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorGoles" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />

          <XAxis
            dataKey="name"
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, Math.ceil(maxGoles * 1.2)]}
            allowDecimals={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f9fafb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
              padding: '10px 14px',
            }}
            labelStyle={{ color: '#9ca3af', marginBottom: '5px', fontSize: '12px' }}
            itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
            // Muestra la fecha real en el tooltip si existe
            labelFormatter={(label, payload) => {
              if (payload && payload[0] && payload[0].payload.fecha) {
                return `${label} — ${payload[0].payload.fecha}`;
              }
              return label;
            }}
            formatter={(value) => [`${value} goles`, 'Total']}
          />

          <Area
            type="monotone"
            dataKey="goles"
            stroke="#3b82f6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorGoles)"
            dot={{ r: 5, fill: '#3b82f6', stroke: '#1e293b', strokeWidth: 2 }}
            activeDot={{ r: 7, fill: '#60a5fa', stroke: '#1e293b', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GoalsChart;