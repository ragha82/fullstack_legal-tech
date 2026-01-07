const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const Case = require('../models/Case');
const Task = require('../models/Task');
const Deadline = require('../models/Deadline');

// Get comprehensive dashboard data
router.get('/overview', async (req, res) => {
  try {
    // Document statistics
    const documentStats = await Document.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Case statistics
    const caseStats = await Case.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const caseTypeStats = await Case.aggregate([
      {
        $group: {
          _id: '$caseType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Task statistics
    const taskStats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const taskCompletion = await Task.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          }
        }
      }
    ]);

    // Deadline statistics
    const deadlineStats = await Deadline.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Upcoming deadlines
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcomingDeadlines = await Deadline.countDocuments({
      deadlineDate: { $gte: today, $lte: nextWeek },
      status: { $in: ['Upcoming', 'Due Soon'] }
    });

    const overdueDeadlines = await Deadline.countDocuments({
      deadlineDate: { $lt: today },
      status: { $in: ['Upcoming', 'Due Soon'] }
    });

    // Recent activities
    const recentDocuments = await Document.find()
      .sort({ uploadedDate: -1 })
      .limit(5)
      .select('title status uploadedDate clientName');

    const recentCases = await Case.find()
      .sort({ startDate: -1 })
      .limit(5)
      .select('caseNumber title status startDate clientName');

    res.json({
      documents: {
        stats: documentStats,
        total: await Document.countDocuments()
      },
      cases: {
        stats: caseStats,
        byType: caseTypeStats,
        total: await Case.countDocuments()
      },
      tasks: {
        stats: taskStats,
        completionRate: taskCompletion[0] 
          ? ((taskCompletion[0].completed / taskCompletion[0].total) * 100).toFixed(2)
          : 0,
        total: taskCompletion[0]?.total || 0
      },
      deadlines: {
        stats: deadlineStats,
        upcoming: upcomingDeadlines,
        overdue: overdueDeadlines,
        total: await Deadline.countDocuments()
      },
      recent: {
        documents: recentDocuments,
        cases: recentCases
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

