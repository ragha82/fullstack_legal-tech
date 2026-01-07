import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, FileText, UploadCloud, CheckCircle, XCircle, Clock } from 'lucide-react';
import { documentsAPI, smartUploadAPI } from '../services/api';
import { format } from 'date-fns';
import './Documents.css';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Smart Upload state - MULTIPLE FILES
  const [smartFiles, setSmartFiles] = useState([]);
  const [smartForm, setSmartForm] = useState({
    userEmail: '',
    userName: '',
  });
  const [smartUploading, setSmartUploading] = useState(false);
  const [smartError, setSmartError] = useState('');
  const [smartResults, setSmartResults] = useState([]);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [docMeta, setDocMeta] = useState({
    expiryDate: '',
    documentNumber: '',
  });

  useEffect(() => {
    fetchDocuments();
  }, [statusFilter, typeFilter, searchTerm]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.documentType = typeFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await documentsAPI.getAll(params);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentsAPI.delete(id);
        fetchDocuments();
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Failed to delete document');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#f59e0b',
      'In Review': '#3b82f6',
      'Approved': '#10b981',
      'Rejected': '#ef4444',
      'Archived': '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': '#10b981',
      'Medium': '#f59e0b',
      'High': '#ef4444',
      'Urgent': '#dc2626'
    };
    return colors[priority] || '#6b7280';
  };

  const handleSmartInputChange = (e) => {
    const { name, value } = e.target;
    setSmartForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSmartFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setSmartFiles(files);
    setSmartResults([]);
    setSmartError('');
  };

  const handleMetaChange = (e) => {
    const { name, value } = e.target;
    setDocMeta((prev) => ({ ...prev, [name]: value }));
  };

  const handleSmartUpload = async (e) => {
    e.preventDefault();
    setSmartError('');
    setSmartResults([]);
    setUploadProgress([]);

    if (smartFiles.length === 0) {
      setSmartError('Please select at least one document file to upload.');
      return;
    }
    if (!smartForm.userEmail) {
      setSmartError('Please enter the user email.');
      return;
    }

    try {
      setSmartUploading(true);
      
      // Initialize progress tracking
      const initialProgress = smartFiles.map((file, idx) => ({
        fileName: file.name,
        status: 'uploading',
        progress: 0
      }));
      setUploadProgress(initialProgress);

      const formData = new FormData();
      
      // Append all files
      smartFiles.forEach(file => {
        formData.append('files', file);
      });
      
      formData.append('userEmail', smartForm.userEmail);
      formData.append('userName', smartForm.userName);

      const response = await smartUploadAPI.bulkUpload(formData);
      
      // Prefer documents array from backend; fallback to results if present
      setSmartResults(response.data.documents || response.data.results || []);
      
      // Update progress to completed
      setUploadProgress(smartFiles.map((file, idx) => ({
        fileName: file.name,
        status: 'completed',
        progress: 100
      })));

      // Clear form
      setSmartFiles([]);
      setSmartForm((prev) => ({
        userEmail: prev.userEmail,
        userName: prev.userName,
      }));

      // Reset file input
      const fileInput = document.getElementById('smart-file-input');
      if (fileInput) fileInput.value = '';

      // Refresh documents list
      fetchDocuments();
    } catch (error) {
      console.error('Smart upload error:', error);
      setSmartError(error.response?.data?.error || 'Failed to upload and verify documents. Please try again.');
      
      setUploadProgress(smartFiles.map((file, idx) => ({
        fileName: file.name,
        status: 'failed',
        progress: 0
      })));
    } finally {
      setSmartUploading(false);
    }
  };

  const handleDetectTypeOnly = async (e) => {
    e.preventDefault();
    setSmartError('');
    setSmartResults([]);
    setUploadProgress([]);

    if (smartFiles.length === 0) {
      setSmartError('Please select at least one document file to detect.');
      return;
    }

    const file = smartFiles[0]; // detect first file only for now
    try {
      setSmartUploading(true);
      setUploadProgress([{ fileName: file.name, status: 'detecting', progress: 50 }]);

      const formData = new FormData();
      formData.append('file', file);
      if (docMeta.expiryDate) formData.append('expiryDate', docMeta.expiryDate);
      if (docMeta.documentNumber) formData.append('documentNumber', docMeta.documentNumber);

      const response = await smartUploadAPI.classifyVerify(formData);

      setSmartResults([
        {
          fileName: file.name,
          detectedType: response.data.detectedType,
          status: response.data.verification?.status || 'Detected',
          verification: response.data.verification,
        },
      ]);

      setUploadProgress([{ fileName: file.name, status: 'completed', progress: 100 }]);
    } catch (error) {
      console.error('Detect type error:', error);
      setSmartError(error.response?.data?.error || 'Failed to detect document type. Please try again.');
      setUploadProgress([{ fileName: file.name, status: 'failed', progress: 0 }]);
    } finally {
      setSmartUploading(false);
    }
  };

  const getVerificationIcon = (status) => {
    switch (status) {
      case 'Verified':
      case 'Approved':
        return <CheckCircle size={16} color="#10b981" />;
      case 'Expired':
      case 'Rejected':
      case 'Invalid':
        return <XCircle size={16} color="#ef4444" />;
      default:
        return <Clock size={16} color="#f59e0b" />;
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Documents</h1>
          <p>Manage all your legal documents</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Add Document
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search documents..."
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
          <option value="Pending">Pending</option>
          <option value="In Review">In Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Archived">Archived</option>
        </select>
        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Passport">Passport</option>
          <option value="ID Card">ID Card</option>
          <option value="PAN Card">PAN Card</option>
          <option value="Aadhaar Card">Aadhaar Card</option>
          <option value="Driving License">Driving License</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* SMART UPLOAD SECTION - TOP PRIORITY */}
      <div className="smart-upload-section">
        <div className="smart-upload-header">
          <h2>
            <UploadCloud size={24} /> Smart Bulk Upload
          </h2>
          <p>
            Upload multiple documents (Passport, ID, PAN, Aadhaar, etc.). We'll automatically detect types, verify, and notify you.
          </p>
        </div>

        {smartError && <div className="alert-error">{smartError}</div>}

        <form className="smart-upload-form" onSubmit={handleSmartUpload}>
          <div className="form-row">
            <div className="form-group">
              <label>User Email *</label>
              <input
                type="email"
                name="userEmail"
                value={smartForm.userEmail}
                onChange={handleSmartInputChange}
                placeholder="user@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>User Name</label>
              <input
                type="text"
                name="userName"
                value={smartForm.userName}
                onChange={handleSmartInputChange}
                placeholder="Optional user name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Document Number (optional)</label>
              <input
                type="text"
                name="documentNumber"
                value={docMeta.documentNumber}
                onChange={handleMetaChange}
                placeholder="Passport/ID/License number"
              />
            </div>
            <div className="form-group">
              <label>Expiry Date (optional)</label>
              <input
                type="date"
                name="expiryDate"
                value={docMeta.expiryDate}
                onChange={handleMetaChange}
              />
            </div>
          </div>

          <div className="form-group-full">
            <label>Select Documents (Multiple Files) *</label>
            <input 
              id="smart-file-input"
              type="file" 
              accept=".pdf,.jpg,.jpeg,.png,.heic" 
              onChange={handleSmartFileChange}
              multiple
              required
            />
            {smartFiles.length > 0 && (
              <div className="smart-files-list">
                <p><strong>{smartFiles.length}</strong> file(s) selected:</p>
                <ul>
                  {smartFiles.map((file, idx) => (
                    <li key={idx}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-primary" disabled={smartUploading}>
              {smartUploading ? 'Processing...' : `Upload & Verify ${smartFiles.length > 0 ? `(${smartFiles.length} files)` : ''}`}
            </button>
            <button type="button" className="btn-secondary" onClick={handleDetectTypeOnly} disabled={smartUploading || smartFiles.length === 0}>
              {smartUploading ? 'Processing...' : 'Detect Type (no save)'}
            </button>
          </div>
        </form>

        {/* Upload Progress */}
        {uploadProgress.length > 0 && (
          <div className="upload-progress-section">
            <h3>Upload Progress</h3>
            {uploadProgress.map((item, idx) => (
              <div key={idx} className="progress-item">
                <span>{item.fileName}</span>
                <span className={`status-${item.status}`}>{item.status}</span>
              </div>
            ))}
          </div>
        )}

        {/* Results Display */}
        {smartResults.length > 0 && (
          <div className="smart-results-section">
            <h3>Verification Results ({smartResults.length} documents)</h3>
            <div className="results-grid">
              {smartResults.map((result, idx) => (
                <div key={idx} className={`result-card result-${(result.verification?.status || result.status || '').toLowerCase()}`}>
                  <div className="result-header">
                    {getVerificationIcon(result.verification?.status || result.status)}
                    <h4>{result.document?.title || result.fileName || 'Detected Document'}</h4>
                  </div>
                  <div className="result-body">
                    <p><strong>Type:</strong> {result.document?.documentType || result.detectedType || '—'}</p>
                    <p><strong>Status:</strong> {result.verification?.status || result.status || 'Not saved'}</p>
                    {result.verification?.details && Array.isArray(result.verification.details) && (
                      <ul className="result-details-list">
                        {result.verification.details.map((d, i) => <li key={i}>{d}</li>)}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="smart-note">
              📧 Verification emails will be sent to <strong>{smartForm.userEmail}</strong> if email is configured.
            </p>
          </div>
        )}
      </div>

      {/* DOCUMENTS TABLE */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading documents...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Client</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <FileText size={48} />
                    <p>No documents found</p>
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc._id}>
                    <td>
                      <div className="table-cell-title">{doc.title}</div>
                      {doc.description && (
                        <div className="table-cell-subtitle">{doc.description}</div>
                      )}
                    </td>
                    <td>{doc.documentType}</td>
                    <td>{doc.clientName}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: `${getStatusColor(doc.status)}20`, color: getStatusColor(doc.status) }}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td>
                      <span
                        className="priority-badge"
                        style={{ backgroundColor: `${getPriorityColor(doc.priority)}20`, color: getPriorityColor(doc.priority) }}
                      >
                        {doc.priority}
                      </span>
                    </td>
                    <td>{format(new Date(doc.uploadedDate), 'MMM dd, yyyy')}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn-icon btn-danger"
                          onClick={() => handleDelete(doc._id)}
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
    </div>
  );
};

export default Documents;