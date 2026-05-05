const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET all tasks (Fixes "Cannot GET /api/tasks")
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET tasks for a specific project (Crucial for the "View" button)
router.get('/project/:projectId', async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
                             .populate('assignedTo', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error filtering tasks: " + err.message });
  }
});

// GET Dashboard Analytics (The output you already saw working)
router.get('/dashboard', async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const stats = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const overdue = await Task.countDocuments({ 
      status: { $ne: 'Done' }, 
      deadline: { $lt: new Date() } 
    });
    res.json({ total, byStatus: stats, overdue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a task (Fixes the "Delete failed" alert)
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task successfully removed" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;