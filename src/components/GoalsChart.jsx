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

// Datos de ejemplo (puedes pasarlos por props si los sacas de una API en el futuro)
const data = [
  { name: 'Jornada 1', goles: 4 },
  { name: 'Jornada 2', goles: 3 },
  { name: 'Jornada 3', goles: 5 },
  { name: 'Jornada 4', goles: 2 },
  { name: 'Jornada 5', goles: 6 },
  { name: 'Jornada 6', goles: 4 },
  { name: 'Jornada 7', goles: 8 },
];

const GoalsChart = () => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {/* Definición del degradado para el área */}
          <defs>
            <linearGradient id="colorGoles" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          {/* Líneas de fondo (Grid) - Usamos el color de borde de tu tema */}
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          
          {/* Eje X (Abajo) */}
          <XAxis 
            dataKey="name" 
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          
          {/* Eje Y (Izquierda) */}
          <YAxis 
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          
          {/* Tooltip (Cuadro al pasar el mouse) - Estilo Dark Mode */}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f9fafb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
            }}
            labelStyle={{ color: '#9ca3af', marginBottom: '5px' }}
            itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
          />
          
          {/* El área rellena */}
          <Area 
            type="monotone" 
            dataKey="goles" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorGoles)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GoalsChart;