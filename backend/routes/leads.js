import express from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Lead from '../models/Lead.js';
import { requireAdmin } from '../middleware/auth.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// In-memory fallback array for standby mode
const inMemoryLeads = [];

// Nodemailer Transporter Setup (Mock/Configurable)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'mock_user',
    pass: process.env.SMTP_PASS || 'mock_pass'
  }
});

// POST /api/leads - Submit new lead enquiry
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('state').trim().notEmpty().withMessage('State is required'),
    body('district').trim().notEmpty().withMessage('District is required'),
    body('clientType').trim().notEmpty().withMessage('Client type is required'),
    body('cropType').trim().notEmpty().withMessage('Crop type is required'),
    body('capacityNeeded').trim().notEmpty().withMessage('Capacity needed is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array().map(e => e.msg).join('; '), errors: errors.array() });
    }

    try {
      const {
        name,
        phone,
        whatsappPreference = true,
        state,
        district,
        clientType,
        cropType,
        capacityNeeded,
        message = ''
      } = req.body;

      // 1. Save to Database or fallback array
      let lead = null;
      try {
        lead = await Lead.create({
          name,
          phone,
          whatsappPreference,
          state,
          district,
          clientType,
          cropType,
          capacityNeeded,
          message
        });
      } catch (dbErr) {
        console.warn('MongoDB Lead Save skipped or failed, using in-memory fallback:', dbErr.message);
        lead = {
          _id: 'mem_' + Date.now().toString(),
          name,
          phone,
          whatsappPreference,
          state,
          district,
          clientType,
          cropType,
          capacityNeeded,
          message,
          submittedAt: new Date()
        };
        inMemoryLeads.unshift(lead);
      }

      // 2. Format custom WhatsApp API pre-filled text
      const waNumber = process.env.WHATSAPP_NUMBER || '918098613422';
      const waMessage = `Hi ZeniTEK Team! 👋\n\nI am *${name}* from *${district}, ${state}* (${clientType}).\nI am interested in a *${capacityNeeded}* Solar Thermal Dryer for *${cropType}*.\n\n*Phone:* ${phone}\n*Note:* ${message || 'Please send subsidy details & price quote.'}`;
      
      const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

      // 3. Send Notification Email (Non-blocking fallback)
      try {
        await transporter.sendMail({
          from: '"ZeniTEK Website Lead" <no-reply@zenitek.in>',
          to: process.env.ADMIN_EMAIL || 'sales@zenitek.in',
          subject: `🚨 New Lead: ${name} (${cropType} - ${capacityNeeded})`,
          text: `New Lead Details:\nName: ${name}\nPhone: ${phone}\nLocation: ${district}, ${state}\nType: ${clientType}\nCrop: ${cropType}\nCapacity: ${capacityNeeded}\nMessage: ${message}`
        });
      } catch (mailErr) {
        console.log('Admin email notification logger:', { name, phone, cropType, capacityNeeded, district, state });
      }

      return res.status(201).json({
        success: true,
        message: 'Enquiry submitted successfully! Redirecting to WhatsApp...',
        lead,
        whatsappUrl
      });
    } catch (error) {
      console.error('Lead processing error:', error);
      return res.status(500).json({ success: false, message: 'Server error processing lead' });
    }
  }
);

const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isMemId = id => typeof id === 'string' && id.startsWith('mem_');

// GET /api/leads?search=&sort=newest|oldest&limit= - Fetch leads (client admin)
router.get('/', requireAdmin, async (req, res) => {
  const sortDir = req.query.sort === 'oldest' ? 1 : -1;
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 1000, 1), 5000);
  const term = typeof req.query.search === 'string' ? req.query.search.trim().slice(0, 100) : '';
  try {
    const query = {};
    if (term) {
      const rx = new RegExp(escapeRegex(term), 'i');
      query.$or = ['name', 'phone', 'state', 'district', 'clientType', 'cropType', 'capacityNeeded', 'message']
        .map(field => ({ [field]: rx }));
    }
    const leads = await Lead.find(query).sort({ submittedAt: sortDir }).limit(limit).select('-__v').lean();
    return res.json({ success: true, count: leads.length, leads });
  } catch (error) {
    return res.json({ success: true, count: inMemoryLeads.length, leads: inMemoryLeads, fallback: true });
  }
});

// GET /api/leads/:id - Fetch single lead by ID
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    let lead = null;
    if (isMemId(id)) lead = inMemoryLeads.find(l => l._id === id) || null;
    else if (mongoose.isValidObjectId(id)) lead = await Lead.findById(id).select('-__v').lean();
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    return res.json({ success: true, lead });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching lead' });
  }
});

// DELETE /api/leads/:id - Delete lead by ID
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = null;
    if (isMemId(id)) {
      const idx = inMemoryLeads.findIndex(l => l._id === id);
      if (idx !== -1) deleted = inMemoryLeads.splice(idx, 1)[0];
    } else if (mongoose.isValidObjectId(id)) {
      deleted = await Lead.findByIdAndDelete(id);
    }
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    return res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting lead' });
  }
});

export default router;

