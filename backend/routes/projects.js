import express from 'express';
import Project from '../models/Project.js';

const router = express.Router();

// GET /api/projects - Fetch map project markers
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching projects' });
  }
});

// POST /api/projects - Add new installation
router.post('/', async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
