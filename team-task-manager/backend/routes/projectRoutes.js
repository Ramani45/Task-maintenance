const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET all projects (Fixes "Cannot GET /api/projects")
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('admin', 'name');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects: " + err.message });
  }
});

// POST create a project
router.post('/', async (req, res) => {
  const project = new Project({
    name: req.body.name,
    admin: req.body.admin // Expects the MongoDB _id of the user
  });
  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: "Creation failed: " + err.message });
  }
});

// DELETE a project (Fixes the delete function)
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed: " + err.message });
  }
});

module.exports = router;