const express = require('express');
const router = express.Router();
const Case = require('../models/Case');

// Get all cases with optional filters
router.get('/', async (req, res) => {
  try {
    const { status, caseType, clientName, assignedLawyer, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (caseType) query.caseType = caseType;
    if (clientName) query.clientName = new RegExp(clientName, 'i');
    if (assignedLawyer) query.assignedLawyer = new RegExp(assignedLawyer, 'i');
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { caseNumber: new RegExp(search, 'i') },
        { clientName: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const cases = await Case.find(query).sort({ startDate: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get case by ID
router.get('/:id', async (req, res) => {
  try {
    const caseDoc = await Case.findById(req.params.id);
    
    if (!caseDoc) {
      return res.status(404).json({ error: 'Case not found' });
    }
    
    res.json(caseDoc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new case
router.post('/', async (req, res) => {
  try {
    const caseDoc = new Case(req.body);
    await caseDoc.save();
    res.status(201).json(caseDoc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update case
router.put('/:id', async (req, res) => {
  try {
    const caseDoc = await Case.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!caseDoc) {
      return res.status(404).json({ error: 'Case not found' });
    }
    
    res.json(caseDoc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete case
router.delete('/:id', async (req, res) => {
  try {
    const caseDoc = await Case.findByIdAndDelete(req.params.id);
    
    if (!caseDoc) {
      return res.status(404).json({ error: 'Case not found' });
    }
    
    res.json({ message: 'Case deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get case statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Case.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const byType = await Case.aggregate([
      {
        $group: {
          _id: '$caseType',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Case.countDocuments();
    
    res.json({
      total,
      byStatus: stats,
      byType: byType
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

