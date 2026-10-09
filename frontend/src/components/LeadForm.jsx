import React, { useState, useEffect } from 'react';
import { Send, ShieldCheck, CheckCircle, Loader2, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE } from '../utils/api';

// [submitted value, English label used for prefill matching, translation key for the shown label]
const CLIENT_TYPES = [
  ['Individual Farmer', 'Individual Farmer', 'common_client_farmer'],
  ['FPO / Cooperative Group', 'FPO / Farmer Cooperative', 'common_client_fpo'],
  ['Food Processor & Exporter', 'Food Processor & Exporter', 'common_client_processor'],
  ['Industrial/Sludge Processor', 'Industrial / Sludge Processor', 'common_client_industrial'],
  ['NGO / CSR Partner', 'NGO / CSR Partner', 'common_client_ngo'],
];

const CROPS = [
  ['Copra/Coconut', 'Copra / Coconut', 'common_form_cropCopra'],
  ['Moringa/Herbs', 'Moringa / Herbs / Tea', 'common_form_cropMoringa'],
  ['Spices/Chillies', 'Spices / Chillies / Pepper', 'common_form_cropSpices'],
  ['Fruits/Veggies', 'Fruits / Vegetables', 'common_form_cropFruits'],
  ['Fish/Seafood', 'Fish / Marine Seafood', 'common_form_cropFish'],
  ['Other', 'Other Agricultural / Industrial', 'common_form_cropOther'],
];

const CAPACITIES = [
  ['Under 50 kg (Portable)', 'Under 50 kg (Portable DIY)', 'common_cap_portable'],
  ['100 to 500 kg (Commercial)', '100 to 500 kg (Commercial Polyhouse)', 'common_cap_commercial'],
  ['1 Ton+ (Industrial)', '1 Ton+ (Industrial Multi-Tunnel)', 'common_cap_industrial'],
];

const DEFAULTS = {
  name: '',
  phone: '',
  whatsappPreference: true,
  state: 'Tamil Nadu',
  district: 'Coimbatore',
  clientType: 'Individual Farmer',
  cropType: 'Copra/Coconut',
  capacityNeeded: '100 to 500 kg (Commercial)',
  message: ''
};

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

// Matches a prefilled value (e.g. "Copra / Coconut") to a select option; null if none fits.
const matchOption = (options, value) => {
  if (!value) return null;
  const v = norm(value);
  const hit = options.find(([val, label]) => norm(val) === v || norm(label) === v)
    || options.find(([val, label]) => norm(label).includes(v) || v.includes(norm(val)));
  return hit ? hit[0] : null;
};

// Builds the starting form state from button prefill data. Values that don't match a
// dropdown option (e.g. a specific model name) are kept in the message instead of being lost.
const buildInitial = (prefill = {}) => {
  const data = { ...DEFAULTS };
  const notes = [];
  ['name', 'phone', 'state', 'district', 'message'].forEach((k) => { if (prefill[k]) data[k] = prefill[k]; });

  const crop = matchOption(CROPS, prefill.cropType);
  if (crop) data.cropType = crop; else if (prefill.cropType) notes.push(`Crop: ${prefill.cropType}`);

  const cap = matchOption(CAPACITIES, prefill.capacityNeeded);
  if (cap) data.capacityNeeded = cap; else if (prefill.capacityNeeded) notes.push(`Interested in: ${prefill.capacityNeeded}`);

  const client = matchOption(CLIENT_TYPES, prefill.clientType);
  if (client) data.clientType = client;

  if (notes.length) data.message = [notes.join(' · '), data.message].filter(Boolean).join('\n');
  return data;
};

const inputClass = 'w-full bg-[#F0F4FD] border border-[#123B92]/30 focus:border-[#002DC2] focus:ring-1 focus:ring-[#002DC2] rounded-xl px-3.5 py-2.5 text-base text-black';

// Quote & subsidy enquiry form (used by the /quote page). Posts to /api/leads and
// opens the WhatsApp chat link the API returns; falls back to a direct WhatsApp link.
export default function LeadForm({ prefill }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState(() => buildInitial(prefill));
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    setFormData(buildInitial(prefill));
    setSuccessMsg(null);
  }, [prefill]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const openWhatsAppFallback = () => {
    const waMsg = `Hi ZeniTEK Team! 👋\nI am *${formData.name}* from *${formData.district}, ${formData.state}*.\nInterested in *${formData.capacityNeeded}* for *${formData.cropType}*.\nPhone: ${formData.phone}`;
    window.open(`https://wa.me/918098613422?text=${encodeURIComponent(waMsg)}`, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);

    try {
      const response = await fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data.success) {
        setSuccessMsg(t('common_form_success'));
        if (data.whatsappUrl) setTimeout(() => window.open(data.whatsappUrl, '_blank'), 800);
      } else {
        openWhatsAppFallback();
      }
    } catch (err) {
      openWhatsAppFallback();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-[#123B92] shadow-xl overflow-hidden">
      {successMsg && (
        <div className="m-4 sm:m-6 p-4 rounded-2xl bg-[#F0F4FD] border-2 border-[#23AC39] text-black text-sm flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-[#002DC2] shrink-0" />
          <div>
            <p className="font-bold text-[#123B92]">{successMsg}</p>
            <p className="text-sm text-black/70">{t('common_form_openingWa')}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#123B92] mb-1">
              {t('yourName')} <span className="text-[#002DC2]">*</span>
            </label>
            <input type="text" name="name" required placeholder={t('common_form_namePh')} value={formData.name} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#123B92] mb-1">
              {t('whatsappNum')} <span className="text-[#002DC2]">*</span>
            </label>
            <input type="tel" name="phone" required placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#123B92] mb-1">{t('common_form_state')} *</label>
            <input type="text" name="state" required placeholder={t('common_form_statePh')} value={formData.state} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#123B92] mb-1">
              {t('districtCity')} <span className="text-[#002DC2]">*</span>
            </label>
            <input type="text" name="district" required placeholder={t('common_form_districtPh')} value={formData.district} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#123B92] mb-1">{t('userCategory')} *</label>
            <select name="clientType" value={formData.clientType} onChange={handleChange} className={`${inputClass} cursor-pointer`}>
              {CLIENT_TYPES.map(([v, , k]) => <option key={v} value={v}>{t(k)}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#123B92] mb-1">{t('targetCrop')} *</label>
            <select name="cropType" value={formData.cropType} onChange={handleChange} className={`${inputClass} cursor-pointer`}>
              {CROPS.map(([v, , k]) => <option key={v} value={v}>{t(k)}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#123B92] mb-1">{t('desiredCapacity')} *</label>
          <select name="capacityNeeded" value={formData.capacityNeeded} onChange={handleChange} className={`${inputClass} cursor-pointer`}>
            {CAPACITIES.map(([v, , k]) => <option key={v} value={v}>{t(k)}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#123B92] mb-1">{t('additionalReqs')}</label>
          <textarea
            name="message"
            rows="4"
            placeholder={t('common_form_messagePh')}
            value={formData.message}
            onChange={handleChange}
            className={inputClass}
          ></textarea>
        </div>

        <div className="pt-4 border-t border-[#123B92]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-black/60 flex items-center">
            <Lock className="w-4 h-4 text-[#002DC2] mr-1" /> {t('common_form_confidential')}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto py-3.5 px-7 bg-[#23AC39] hover:bg-[#002DC2] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('common_form_processing')}</span>
              </>
            ) : (
              <>
                <span>{t('chatWhatsapp')}</span>
                <Send className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
