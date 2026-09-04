import express from 'express';
import Project from '../models/Project.js';
import { initialProjects } from './seed.js';

const router = express.Router();

let memoryProjects = [...initialProjects.map((p, idx) => ({ ...p, _id: `proj_${idx + 1}` }))];

// GET /api/projects - Fetch map project markers
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    if (projects.length > 0) {
      return res.json({ success: true, count: projects.length, projects });
    }
    return res.json({ success: true, count: memoryProjects.length, projects: memoryProjects, source: 'initial' });
  } catch (error) {
    return res.json({ success: true, count: memoryProjects.length, projects: memoryProjects, fallback: true });
  }
});

// GET /api/projects/:id - Fetch single project
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let project = null;
    try {
      project = await Project.findById(id);
    } catch (dbErr) {
      project = memoryProjects.find(p => p._id === id || p.title.toLowerCase().includes(id.toLowerCase()));
    }

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    return res.json({ success: true, project });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching project' });
  }
});

// POST /api/projects - Add new project installation
router.post('/', async (req, res) => {
  try {
    const { title, locationName, latitude, longitude, cropDrying, dryerType, capacity, imageUrl, description } = req.body;
    
    if (!title || !locationName || !latitude || !longitude || !cropDrying || !dryerType || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields (title, locationName, latitude, longitude, cropDrying, dryerType, capacity)'
      });
    }

    let project = null;
    try {
      project = await Project.create({ title, locationName, latitude, longitude, cropDrying, dryerType, capacity, imageUrl, description });
    } catch (dbErr) {
      project = {
        _id: 'proj_' + Date.now(),
        title,
        locationName,
        latitude: Number(latitude),
        longitude: Number(longitude),
        cropDrying,
        dryerType,
        capacity,
        imageUrl: imageUrl || '',
        description: description || ''
      };
      memoryProjects.unshift(project);
    }

    return res.status(201).json({ success: true, message: 'Project created successfully', project });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Error creating project' });
  }
});

// PUT /api/projects/:id - Update existing project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let updated = null;
    try {
      updated = await Project.findByIdAndUpdate(id, req.body, { new: true });
    } catch (dbErr) {
      const idx = memoryProjects.findIndex(p => p._id === id);
      if (idx !== -1) {
        memoryProjects[idx] = { ...memoryProjects[idx], ...req.body };
        updated = memoryProjects[idx];
      }
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Project not found to update' });
    }
    return res.json({ success: true, message: 'Project updated successfully', project: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating project' });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Project.findByIdAndDelete(id);
    } catch (dbErr) {
      memoryProjects = memoryProjects.filter(p => p._id !== id);
    }
    return res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting project' });
  }
});

export default router;

