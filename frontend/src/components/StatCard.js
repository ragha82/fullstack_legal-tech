import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-card-icon" style={{ backgroundColor: `${color}15`, color: color }}>
          {Icon && <Icon size={24} />}
        </div>
        <div className="stat-card-content">
          <h3 className="stat-card-title">{title}</h3>
          <p className="stat-card-value">{value}</p>
          {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
          {trend && (
            <span className={`stat-card-trend ${trend.type}`}>
              {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;

