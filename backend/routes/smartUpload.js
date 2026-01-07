const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const { detectDocumentType, detectDocumentTypeFromImage, ALLOWED_TYPES } = require('../services/openaiClient');
const { verifyByType } = require('../services/verificationRules');
const { verifyDocument } = require('../services/verificationService');
const { sendVerificationEmail } = require('../services/emailService');

const router = express.Router();

/* ============================
   MULTER CONFIG
============================ */
// Memory storage for vision-based detection (no disk, no DB write)
const memoryStorage = multer.memoryStorage();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${timestamp}_${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const memoryUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/* =====================================================
   1️⃣ BULK UPLOAD: USER DUMPS MANY FILES
   POST /api/smart-upload/upload
===================================================== */
router.post('/upload', upload.array('files', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    const { userEmail, userName } = req.body;

    if (!userEmail) {
      return res.status(400).json({ error: 'userEmail is required.' });
    }

    const savedDocuments = [];

    for (const file of req.files) {
      // Use allowed enum values from Document model (documentType: 'Other')
      const document = new Document({
        title: `Unmapped - ${file.originalname}`,
        documentType: 'Other', // must match enum in Document model
        status: 'Pending',
        clientName: userName || userEmail,
        uploadedDate: new Date(),
        priority: 'Medium',
        description: `Bulk upload by ${userEmail}. Awaiting agent mapping.`,
        fileUrl: `/uploads/${file.filename}`,
        // The following are extra fields not in the schema; they will be ignored unless added to the model
        // Keeping them here for forward-compatibility if schema is expanded.
        documentCategory: 'Unmapped',
        uploadedByEmail: userEmail,
        verificationStatus: 'Pending',
        verificationDetails: ['Awaiting agent verification'],
      });

      await document.save();
      savedDocuments.push(document);
    }

    return res.status(201).json({
      message: 'Files uploaded successfully. Awaiting agent mapping.',
      count: savedDocuments.length,
      documents: savedDocuments,
    });

  } catch (error) {
    console.error('Bulk upload error:', error);
    return res.status(500).json({ error: 'Failed to process bulk upload.' });
  }
});

/* =====================================================
   1b️⃣ DIRECT DETECTION VIA OPENAI VISION (NO DB STORE)
   POST /api/smart-upload/detect-type
   Body: multipart/form-data with single file field "file"
===================================================== */
router.post('/detect-type', memoryUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { originalname, mimetype, buffer } = req.file;
    const detectedType = await detectDocumentTypeFromImage({
      buffer,
      mimeType: mimetype,
      originalName: originalname,
    });

    return res.json({
      message: 'Detection complete (not stored).',
      detectedType,
      allowedTypes: ALLOWED_TYPES,
    });
  } catch (error) {
    console.error('Vision detect error:', error);
    return res.status(500).json({ error: 'Failed to detect document type.' });
  }
});

/* =====================================================
   1c️⃣ CLASSIFY + VERIFY (NO SAVE OR SAVE FLAG)
   POST /api/smart-upload/classify-verify
   Body: multipart/form-data with single file field "file"
   Optional fields: expiryDate, documentNumber, save (boolean "true"/"false"), userEmail, userName
===================================================== */
router.post('/classify-verify', memoryUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { originalname, mimetype, buffer } = req.file;
    const { expiryDate, documentNumber, save = 'false', userEmail, userName } = req.body;

    // 1) Detect type via vision
    const detectedType = await detectDocumentTypeFromImage({
      buffer,
      mimeType: mimetype,
      originalName: originalname,
    });

    // 2) Verify based on detected type and provided fields
    const verification = verifyByType(detectedType, { expiryDate, documentNumber });

    // 3) Optionally save to DB
    let saved = null;
    if (save === 'true') {
      saved = await Document.create({
        title: originalname,
        documentType: detectedType,
        status: verification.status === 'Verified' ? 'Approved' : 'Pending',
        clientName: userName || userEmail || 'Unknown',
        uploadedDate: new Date(),
        priority: 'Medium',
        description: `Uploaded by ${userEmail || 'unknown'}`,
        fileUrl: '', // not storing the file; adjust if you later store it
        documentCategory: detectedType,
        uploadedByEmail: userEmail || '',
        verificationStatus: verification.status,
        verificationDetails: verification.details,
      });
    }

    return res.json({
      message: 'Classify & verify complete',
      detectedType,
      verification,
      saved,
      allowedTypes: ALLOWED_TYPES,
    });
  } catch (error) {
    console.error('Classify-verify error:', error);
    return res.status(500).json({ error: 'Failed to classify and verify document.' });
  }
});

/* =====================================================
   2️⃣ AGENT / AI MAPPING FOR SINGLE DOCUMENT
   POST /api/smart-upload/map/:id
===================================================== */
router.post('/map/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { expiryDate, documentNumber, userEmail } = req.body;

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    // 1. Detect document type (AI or heuristic)
    const detectedType = await detectDocumentType({
      originalFileName: document.title,
      hintType: document.documentCategory,
    });

    // 2. Verify based on detected type
    const verification = verifyDocument(detectedType, {
      expiryDate,
      documentNumber,
    });

    const status =
      verification.status === 'Verified'
        ? 'Approved'
        : verification.status === 'Expired'
        ? 'Rejected'
        : 'Pending';

    // 3. Update document
    document.title = `${detectedType} - ${document.title.replace('Unmapped - ', '')}`;
    document.documentType = detectedType;
    document.status = status;
    document.documentCategory = detectedType;
    document.verificationStatus = verification.status;
    document.verificationDetails = verification.details;

    await document.save();

    // 4. Optional email
    if (userEmail) {
      try {
        await sendVerificationEmail({
          toEmail: userEmail,
          documentType: detectedType,
          verification,
          expiryDate,
          documentNumber,
        });
      } catch (emailError) {
        console.error('Email error:', emailError.message);
      }
    }

    return res.json({
      message: 'Document mapped and verified successfully.',
      document,
      verification,
    });

  } catch (error) {
    console.error('Agent mapping error:', error);
    return res.status(500).json({ error: 'Failed to map document.' });
  }
});

/* =====================================================
   3️⃣ BATCH AGENT MAPPING (MULTIPLE DOCUMENTS)
   POST /api/smart-upload/map-batch
===================================================== */
router.post('/map-batch', async (req, res) => {
  try {
    const { documentIds } = req.body;

    if (!documentIds || !Array.isArray(documentIds)) {
      return res.status(400).json({ error: 'documentIds must be an array.' });
    }

    const results = [];

    for (const id of documentIds) {
      const document = await Document.findById(id);
      if (!document) continue;

      const detectedType = await detectDocumentType({
        originalFileName: document.title,
        hintType: document.documentCategory,
      });

      const verification = verifyDocument(detectedType, {
        expiryDate: document.expiryDate,
        documentNumber: document.documentNumber,
      });

      document.documentType = detectedType;
      document.status = verification.status === 'Verified' ? 'Approved' : 'Rejected';
      document.documentCategory = detectedType;
      document.verificationStatus = verification.status;
      document.verificationDetails = verification.details;

      await document.save();

      results.push({ id, detectedType, status: verification.status });
    }

    return res.json({
      message: 'Batch mapping completed.',
      processed: results.length,
      results,
    });

  } catch (error) {
    console.error('Batch mapping error:', error);
    return res.status(500).json({ error: 'Batch mapping failed.' });
  }
});

module.exports = router;
