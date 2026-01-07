import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Briefcase, X } from 'lucide-react';
import { casesAPI } from '../services/api';
import { format } from 'date-fns';
import './Cases.css';

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    caseNumber: '',
    title: '',
    caseType: 'Corporate',
    status: 'Open',
    clientName: '',
    assignedLawyer: '',
    startDate: new Date().toISOString().split('T')[0],
    expectedEndDate: '',
    priority: 'Medium',
    description: ''
  });

  useEffect(() => {
    fetchCases();
  }, [statusFilter, typeFilter, searchTerm]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.caseType = typeFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await casesAPI.getAll(params);
      setCases(response.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      try {
        await casesAPI.delete(id);
        fetchCases();
      } catch (error) {
        console.error('Error deleting case:', error);
        alert('Failed to delete case');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Open': '#3b82f6',
      'In Progress': '#10b981',
      'On Hold': '#f59e0b',
      'Closed': '#6b7280',
      'Archived': '#9ca3af'
    };
    return colors[status] || '#6b7280';
  };

  const resetForm = () => {
    setFormData({
      caseNumber: '',
      title: '',
      caseType: 'Corporate',
      status: 'Open',
      clientName: '',
      assignedLawyer: '',
      startDate: new Date().toISOString().split('T')[0],
      expectedEndDate: '',
      priority: 'Medium',
      description: ''
    });
    setError('');
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.caseNumber || !formData.title || !formData.clientName || !formData.assignedLawyer) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      await casesAPI.create(formData);
      await fetchCases();
      handleModalClose();
    } catch (err) {
      console.error('Error creating case:', err);
      setError('Failed to create case. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Cases</h1>
          <p>Manage all your legal cases</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Add Case
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search cases..."
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
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="On Hold">On Hold</option>
          <option value="Closed">Closed</option>
          <option value="Archived">Archived</option>
        </select>
        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Criminal">Criminal</option>
          <option value="Civil">Civil</option>
          <option value="Corporate">Corporate</option>
          <option value="Family">Family</option>
          <option value="Intellectual Property">Intellectual Property</option>
          <option value="Employment">Employment</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading cases...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Case Number</th>
                <th>Title</th>
                <th>Type</th>
                <th>Client</th>
                <th>Lawyer</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cases.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    <Briefcase size={48} />
                    <p>No cases found</p>
                  </td>
                </tr>
              ) : (
                cases.map((caseItem) => (
                  <tr key={caseItem._id}>
                    <td>
                      <span className="case-number">{caseItem.caseNumber}</span>
                    </td>
                    <td>
                      <div className="table-cell-title">{caseItem.title}</div>
                      {caseItem.description && (
                        <div className="table-cell-subtitle">{caseItem.description}</div>
                      )}
                    </td>
                    <td>{caseItem.caseType}</td>
                    <td>{caseItem.clientName}</td>
                    <td>{caseItem.assignedLawyer}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: `${getStatusColor(caseItem.status)}20`, color: getStatusColor(caseItem.status) }}
                      >
                        {caseItem.status}
                      </span>
                    </td>
                    <td>{format(new Date(caseItem.startDate), 'MMM dd, yyyy')}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn-icon btn-danger"
                          onClick={() => handleDelete(caseItem._id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Case</h3>
              <button className="btn-icon" onClick={handleModalClose} title="Close">
                <X size={16} />
              </button>
            </div>

            {error && <div className="alert-error">{error}</div>}

            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Case Number *</label>
                <input
                  type="text"
                  name="caseNumber"
                  value={formData.caseNumber}
                  onChange={handleChange}
                  placeholder="e.g., CASE-2024-010"
                  required
                />
              </div>

              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Case title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Case Type *</label>
                <select name="caseType" value={formData.caseType} onChange={handleChange}>
                  <option value="Criminal">Criminal</option>
                  <option value="Civil">Civil</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Family">Family</option>
                  <option value="Intellectual Property">Intellectual Property</option>
                  <option value="Employment">Employment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Closed">Closed</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="form-group">
                <label>Client Name *</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="Client name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Assigned Lawyer *</label>
                <input
                  type="text"
                  name="assignedLawyer"
                  value={formData.assignedLawyer}
                  onChange={handleChange}
                  placeholder="Assigned lawyer"
                  required
                />
              </div>

              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Expected End Date</label>
                <input
                  type="date"
                  name="expectedEndDate"
                  value={formData.expectedEndDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div className="form-group form-group-full">
                <label>Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add a short description"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleModalClose}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cases;

