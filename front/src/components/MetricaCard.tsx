import React from 'react';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
}

const MetricaCard: React.FC<MetricCardProps> = ({ title, value, icon, trend }) => {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-blue-500'
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="mt-2 flex items-center">
        {trend !== 'neutral' && (
          <span className={`text-sm ${trendColors[trend]}`}>
            {trend === 'up' ? '↑' : '↓'} 
          </span>
        )}
      </div>
    </div>
  );
};

export default MetricaCard;