// Sending a quote / contact enquiry to the backend (/api/leads), shared by the Quote and Contact forms.
import { API_BASE } from './api';

export const WHATSAPP_NUMBER = '918098613422';
export const whatsappLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// Only WhatsApp links are opened from a server reply
const safeWhatsappUrl = (url) => (typeof url === 'string' && /^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(url) ? url : null);

// 10 digits (Indian mobile), optionally with a +91 / 91 / 0 prefix; spaces and dashes allowed
export const isValidPhone = (value) => {
  const digits = String(value || '').replace(/[\s()-]/g, '');
  return /^(\+?91|0)?[0-9]{10}$/.test(digits);
};

// The enquiry as a WhatsApp message (used when the online form cannot be sent)
export const leadMessage = (lead) => [
  'Hi ZeniTEK Team!',
  `I am ${lead.name}${lead.district ? ` from ${lead.district}${lead.state ? `, ${lead.state}` : ''}` : ''}.`,
  lead.clientType && `Category: ${lead.clientType}`,
  lead.capacityNeeded && `Interested in: ${lead.capacityNeeded}`,
  lead.cropType && `Crop: ${lead.cropType}`,
  lead.message && `Message: ${lead.message}`,
  `Phone: ${lead.phone}`,
].filter(Boolean).join('\n');

// Resolves to { ok: true, whatsappUrl } only when the server confirms it saved the enquiry;
// otherwise { ok: false } (network error, server error, rejected fields, or no reply in 15 s).
export async function sendLead(lead) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
      signal: controller.signal,
    });
    const body = await res.json().catch(() => ({}));
    return res.ok && body.success === true ? { ok: true, whatsappUrl: safeWhatsappUrl(body.whatsappUrl) } : { ok: false };
  } catch {
    return { ok: false };
  } finally {
    clearTimeout(timer);
  }
}
