import express from 'express';
import { body, validationResult } from 'express-validator';
import Lead from '../models/Lead.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Nodemailer Transporter Setup (Mock/Configurable)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'mock_user',
    pass: process.env.SMTP_PASS || 'mock_pass'
  }
});

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
      return res.status(400).json({ success: false, errors: errors.array() });
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

      // 1. Save to Database (if DB connected)
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
        console.warn('MongoDB Lead Save skipped or failed:', dbErr.message);
        lead = { _id: Date.now().toString(), name, phone, state, district, clientType, cropType, capacityNeeded, message, submittedAt: new Date() };
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

// GET /api/leads - Admin list
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ submittedAt: -1 });
    res.json({ success: true, leads });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch leads' });
  }
});

export default router;
