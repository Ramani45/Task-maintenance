const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// @route   GET /api/tasks/dashboard
// @desc    Requirement #4: Get dashboard metrics
router.get('/dashboard', async (req, res) => {
    try {
        const stats = await Task.aggregate([
            {
                $facet: {
                    totalTasks: [{ $count: "count" }],
                    statusCounts: [
                        { $group: { _id: "$status", count: { $sum: 1 } } }
                    ],
                    overdueTasks: [
                        { 
                            $match: { 
                                deadline: { $lt: new Date() }, 
                                status: { $ne: "Done" } 
                            } 
                        },
                        { $count: "count" }
                    ]
                }
            }
        ]);

        res.json({
            total: stats[0].totalTasks[0]?.count || 0,
            byStatus: stats[0].statusCounts,
            overdue: stats[0].overdueTasks[0]?.count || 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   GET /api/tasks/project/:projectId
// @desc    Fix: Filter tasks by a specific project ID for the Workspace view
router.get('/project/:projectId', async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId })
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST /api/tasks
// @desc    Requirement #3: Create a new task
router.post('/', async (req, res) => {
    try {
        const { title, description, priority, deadline, assignedTo, project } = req.body;
        
        const newTask = new Task({
            title,
            description,
            priority,
            deadline,
            assignedTo,
            project // Ensure the project ID is saved
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   GET /api/tasks
// @desc    Get all tasks with User details
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   PUT /api/tasks/:id
// @desc    Update task status
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   DELETE /api/tasks/:id
// @desc    Fix: Delete task from database (Solves "Delete failed" error)
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CRITICAL: This fixes your TypeError
module.exports = router;