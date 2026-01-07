import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Briefcase, CheckSquare, Calendar, AlertCircle, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard';
import { dashboardAPI } from '../services/api';
import './Dashboard.css';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getOverview();
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <AlertCircle size={48} color="#ef4444" />
          <p>{error || 'Failed to load data'}</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const documentStatusData = dashboardData.documents.stats.map(item => ({
    name: item._id,
    value: item.count
  }));

  const caseStatusData = dashboardData.cases.stats.map(item => ({
    name: item._id,
    value: item.count
  }));

  const caseTypeData = dashboardData.cases.byType.map(item => ({
    name: item._id,
    value: item.count
  }));

  const taskStatusData = dashboardData.tasks.stats.map(item => ({
    name: item._id,
    value: item.count
  }));

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome to your Legal Tech Dashboard</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Documents"
          value={dashboardData.documents.total}
          subtitle="Legal documents"
          icon={FileText}
          color="#3b82f6"
        />
        <StatCard
          title="Active Cases"
          value={dashboardData.cases.total}
          subtitle="Ongoing cases"
          icon={Briefcase}
          color="#10b981"
        />
        <StatCard
          title="Tasks"
          value={dashboardData.tasks.total}
          subtitle={`${dashboardData.tasks.completionRate}% completed`}
          icon={CheckSquare}
          color="#f59e0b"
          trend={{ type: 'positive', value: `${dashboardData.tasks.completionRate}%` }}
        />
        <StatCard
          title="Upcoming Deadlines"
          value={dashboardData.deadlines.upcoming}
          subtitle={`${dashboardData.deadlines.overdue} overdue`}
          icon={Calendar}
          color={dashboardData.deadlines.overdue > 0 ? '#ef4444' : '#8b5cf6'}
        />
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Document Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={documentStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {documentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Case Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={caseStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {caseStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Cases by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={caseTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Task Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <div className="activity-section">
          <h3>Recent Documents</h3>
          <div className="activity-list">
            {dashboardData.recent.documents.map((doc, index) => (
              <div key={index} className="activity-item">
                <FileText size={16} />
                <div className="activity-content">
                  <p className="activity-title">{doc.title}</p>
                  <p className="activity-meta">{doc.clientName} • {new Date(doc.uploadedDate).toLocaleDateString()}</p>
                </div>
                <span className={`status-badge status-${doc.status.toLowerCase().replace(' ', '-')}`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="activity-section">
          <h3>Recent Cases</h3>
          <div className="activity-list">
            {dashboardData.recent.cases.map((caseItem, index) => (
              <div key={index} className="activity-item">
                <Briefcase size={16} />
                <div className="activity-content">
                  <p className="activity-title">{caseItem.title}</p>
                  <p className="activity-meta">{caseItem.caseNumber} • {caseItem.clientName}</p>
                </div>
                <span className={`status-badge status-${caseItem.status.toLowerCase().replace(' ', '-')}`}>
                  {caseItem.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

