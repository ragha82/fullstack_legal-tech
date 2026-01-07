const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploaded documents
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/documents', require('./routes/documents'));
app.use('/api/cases', require('./routes/cases'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/deadlines', require('./routes/deadlines'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/smart-upload', require('./routes/smartUpload'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Legal Tech API is running' });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/legaltech';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});

