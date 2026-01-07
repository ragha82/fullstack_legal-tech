const express = require('express');
const router = express.Router();
const Deadline = require('../models/Deadline');

// Get all deadlines with optional filters
router.get('/', async (req, res) => {
  try {
    const { status, deadlineType, assignedTo, priority, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (deadlineType) query.deadlineType = deadlineType;
    if (assignedTo) query.assignedTo = new RegExp(assignedTo, 'i');
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { clientName: new RegExp(search, 'i') }
      ];
    }

    const deadlines = await Deadline.find(query)
      .populate('caseId', 'caseNumber title')
      .sort({ deadlineDate: 1 });

    res.json(deadlines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get deadline by ID
router.get('/:id', async (req, res) => {
  try {
    const deadline = await Deadline.findById(req.params.id)
      .populate('caseId', 'caseNumber title');
    
    if (!deadline) {
      return res.status(404).json({ error: 'Deadline not found' });
    }
    
    res.json(deadline);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new deadline
router.post('/', async (req, res) => {
  try {
    const deadline = new Deadline(req.body);
    await deadline.save();
    res.status(201).json(deadline);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update deadline
router.put('/:id', async (req, res) => {
  try {
    const deadline = await Deadline.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('caseId', 'caseNumber title');
    
    if (!deadline) {
      return res.status(404).json({ error: 'Deadline not found' });
    }
    
    res.json(deadline);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete deadline
router.delete('/:id', async (req, res) => {
  try {
    const deadline = await Deadline.findByIdAndDelete(req.params.id);
    
    if (!deadline) {
      return res.status(404).json({ error: 'Deadline not found' });
    }
    
    res.json({ message: 'Deadline deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get upcoming deadlines
router.get('/upcoming/list', async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcoming = await Deadline.find({
      deadlineDate: { $gte: today, $lte: nextWeek },
      status: { $in: ['Upcoming', 'Due Soon'] }
    })
      .populate('caseId', 'caseNumber title')
      .sort({ deadlineDate: 1 })
      .limit(10);

    res.json(upcoming);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

