const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// @route   GET /api/projects
// @desc    Fetch all projects (Fixes the 404 error)
router.get('/', async (req, res) => {
    try {
        // We use .populate to get the admin's name instead of just their ID
        const projects = await Project.find().populate('admin', 'name');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch projects: " + err.message });
    }
});

// @route   POST /api/projects
// @desc    Create a new project
router.post('/', async (req, res) => {
    try {
        const { name, admin } = req.body;
        const newProject = new Project({ name, admin });
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (err) {
        res.status(400).json({ error: "Project creation failed: " + err.message });
    }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project by ID
router.delete('/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.json({ message: "Project deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Delete operation failed: " + err.message });
    }
});

module.exports = router;