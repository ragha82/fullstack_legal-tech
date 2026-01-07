import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, CheckSquare, Clock } from 'lucide-react';
import { tasksAPI } from '../services/api';
import { format } from 'date-fns';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, priorityFilter, searchTerm]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await tasksAPI.getAll(params);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.delete(id);
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Not Started': '#9ca3af',
      'In Progress': '#3b82f6',
      'Completed': '#10b981',
      'On Hold': '#f59e0b',
      'Cancelled': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && !tasks.find(t => t._id === tasks.find(t => t.dueDate === dueDate)?._id)?.status === 'Completed';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Tasks</h1>
          <p>Manage all your legal tasks</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Add Task
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search tasks..."
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
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select
          className="filter-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Assigned To</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    <CheckSquare size={48} />
                    <p>No tasks found</p>
                  </td>
                </tr>
              ) : (
                tasks.map((task) => {
                  const progress = task.estimatedHours > 0 
                    ? Math.min((task.actualHours / task.estimatedHours) * 100, 100)
                    : 0;
                  const overdue = isOverdue(task.dueDate) && task.status !== 'Completed';

                  return (
                    <tr key={task._id} className={overdue ? 'row-overdue' : ''}>
                      <td>
                        <div className="table-cell-title">{task.title}</div>
                        {task.description && (
                          <div className="table-cell-subtitle">{task.description}</div>
                        )}
                      </td>
                      <td>{task.assignedTo}</td>
                      <td>{task.category}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{ backgroundColor: `${getStatusColor(task.status)}20`, color: getStatusColor(task.status) }}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td>
                        <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        <div className={`due-date ${overdue ? 'overdue' : ''}`}>
                          {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                          {overdue && <Clock size={14} />}
                        </div>
                      </td>
                      <td>
                        <div className="progress-bar-container">
                          <div 
                            className="progress-bar"
                            style={{ width: `${progress}%`, backgroundColor: progress === 100 ? '#10b981' : '#3b82f6' }}
                          />
                          <span className="progress-text">{progress.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-icon" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button
                            className="btn-icon btn-danger"
                            onClick={() => handleDelete(task._id)}
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

export default Tasks;

