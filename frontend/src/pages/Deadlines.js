import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import { deadlinesAPI } from '../services/api';
import { format, isPast, isToday, differenceInDays } from 'date-fns';
import './Deadlines.css';

const Deadlines = () => {
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchDeadlines();
  }, [statusFilter, typeFilter, searchTerm]);

  const fetchDeadlines = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.deadlineType = typeFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await deadlinesAPI.getAll(params);
      setDeadlines(response.data);
    } catch (error) {
      console.error('Error fetching deadlines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this deadline?')) {
      try {
        await deadlinesAPI.delete(id);
        fetchDeadlines();
      } catch (error) {
        console.error('Error deleting deadline:', error);
        alert('Failed to delete deadline');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Upcoming': '#3b82f6',
      'Due Soon': '#f59e0b',
      'Overdue': '#ef4444',
      'Completed': '#10b981',
      'Cancelled': '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getDaysUntilDeadline = (deadlineDate) => {
    const days = differenceInDays(new Date(deadlineDate), new Date());
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days`;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Deadlines</h1>
          <p>Track all your important deadlines</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Add Deadline
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search deadlines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Due Soon">Due Soon</option>
          <option value="Overdue">Overdue</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Court Filing">Court Filing</option>
          <option value="Contract Expiry">Contract Expiry</option>
          <option value="Compliance Deadline">Compliance Deadline</option>
          <option value="Response Required">Response Required</option>
          <option value="Hearing">Hearing</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading deadlines...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Client</th>
                <th>Assigned To</th>
                <th>Deadline Date</th>
                <th>Days Remaining</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deadlines.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    <Calendar size={48} />
                    <p>No deadlines found</p>
                  </td>
                </tr>
              ) : (
                deadlines.map((deadline) => {
                  const daysRemaining = getDaysUntilDeadline(deadline.deadlineDate);
                  const isOverdue = isPast(new Date(deadline.deadlineDate)) && deadline.status !== 'Completed';
                  const isDueToday = isToday(new Date(deadline.deadlineDate));

                  return (
                    <tr 
                      key={deadline._id} 
                      className={isOverdue ? 'row-overdue' : isDueToday ? 'row-due-today' : ''}
                    >
                      <td>
                        <div className="table-cell-title">{deadline.title}</div>
                        {deadline.description && (
                          <div className="table-cell-subtitle">{deadline.description}</div>
                        )}
                      </td>
                      <td>{deadline.deadlineType}</td>
                      <td>{deadline.clientName}</td>
                      <td>{deadline.assignedTo}</td>
                      <td>{format(new Date(deadline.deadlineDate), 'MMM dd, yyyy')}</td>
                      <td>
                        <div className={`days-remaining ${isOverdue ? 'overdue' : isDueToday ? 'due-today' : ''}`}>
                          {isOverdue && <AlertTriangle size={14} />}
                          {daysRemaining}
                        </div>
                      </td>
                      <td>
                        <span
                          className="status-badge"
                          style={{ backgroundColor: `${getStatusColor(deadline.status)}20`, color: getStatusColor(deadline.status) }}
                        >
                          {deadline.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-icon" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button
                            className="btn-icon btn-danger"
                            onClick={() => handleDelete(deadline._id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Deadlines;

