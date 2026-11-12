import React, { useState, useEffect, useId } from 'react';
import { Send, Loader2, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { sendLead, isValidPhone } from '../utils/leads';
import LeadResult from './LeadResult';

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
  district: '',
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

const inputClass = 'w-full bg-[#F0F4FD] border border-[#123B92]/30 focus:border-[#002DC2] focus:ring-1 focus:ring-[#002DC2] rounded-xl px-3.5 py-2.5 text-base text-black aria-[invalid=true]:border-red-600';
const labelClass = 'block text-xs font-bold text-[#123B92] mb-1';

// Quote enquiry form (used by the /quote page). Posts to /api/leads; success is shown only when the
// server confirms it. If it cannot be sent, the visitor can send the same details on WhatsApp.
export default function LeadForm({ prefill }) {
  const { t } = useLanguage();
  const uid = useId();
  const id = (name) => `${uid}-${name}`;
  const [formData, setFormData] = useState(() => buildInitial(prefill));
  const [status, setStatus] = useState('idle');          // idle | sending | sent | failed
  const [whatsappUrl, setWhatsappUrl] = useState(null);
  const [phoneError, setPhoneError] = useState(false);

  useEffect(() => {
    setFormData(buildInitial(prefill));
    setStatus('idle');
  }, [prefill]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'phone' && phoneError) setPhoneError(!isValidPhone(value));
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    if (!isValidPhone(formData.phone)) {
      setPhoneError(true);
      document.getElementById(id('phone'))?.focus();
      return;
    }
    setStatus('sending');
    const lead = Object.fromEntries(Object.entries(formData).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]));
    const result = await sendLead(lead);
    setWhatsappUrl(result.whatsappUrl || null);
    setStatus(result.ok ? 'sent' : 'failed');
  };

  const sending = status === 'sending';
  const req = <span className="text-[#002DC2]" aria-hidden="true"> *</span>;

  return (
    <div className="bg-white rounded-3xl border-2 border-[#123B92] shadow-xl overflow-hidden">
      {(status === 'sent' || status === 'failed') && (
        <div className="m-4 sm:m-6">
          <LeadResult
            status={status}
            lead={formData}
            whatsappUrl={whatsappUrl}
            successTitle={t('common_form_success')}
            onRetry={() => setStatus('idle')}
          />
        </div>
      )}

      {status !== 'sent' && (
      <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-4" aria-busy={sending}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={id('name')} className={labelClass}>{t('yourName')}{req}</label>
            <input id={id('name')} type="text" name="name" required maxLength={80} autoComplete="name" placeholder={t('common_form_namePh')} value={formData.name} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label htmlFor={id('phone')} className={labelClass}>{t('whatsappNum')}{req}</label>
            <input
              id={id('phone')} type="tel" name="phone" required maxLength={20} inputMode="tel" autoComplete="tel"
              placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange}
              onBlur={() => formData.phone && setPhoneError(!isValidPhone(formData.phone))}
              aria-invalid={phoneError} aria-describedby={phoneError ? id('phone-error') : undefined}
              className={inputClass}
            />
            {phoneError && <p id={id('phone-error')} className="mt-1 text-xs font-semibold text-red-700">{t('common_form_phoneInvalid')}</p>}
          </div>

          <div>
            <label htmlFor={id('state')} className={labelClass}>{t('common_form_state')}{req}</label>
            <input id={id('state')} type="text" name="state" required maxLength={60} autoComplete="address-level1" placeholder={t('common_form_statePh')} value={formData.state} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label htmlFor={id('district')} className={labelClass}>{t('districtCity')}{req}</label>
            <input id={id('district')} type="text" name="district" required maxLength={60} autoComplete="address-level2" placeholder={t('common_form_districtPh')} value={formData.district} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label htmlFor={id('clientType')} className={labelClass}>{t('userCategory')}{req}</label>
            <select id={id('clientType')} name="clientType" value={formData.clientType} onChange={handleChange} className={`${inputClass} cursor-pointer`}>
              {CLIENT_TYPES.map(([v, , k]) => <option key={v} value={v}>{t(k)}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor={id('cropType')} className={labelClass}>{t('targetCrop')}{req}</label>
            <select id={id('cropType')} name="cropType" value={formData.cropType} onChange={handleChange} className={`${inputClass} cursor-pointer`}>
              {CROPS.map(([v, , k]) => <option key={v} value={v}>{t(k)}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor={id('capacityNeeded')} className={labelClass}>{t('desiredCapacity')}{req}</label>
          <select id={id('capacityNeeded')} name="capacityNeeded" value={formData.capacityNeeded} onChange={handleChange} className={`${inputClass} cursor-pointer`}>
            {CAPACITIES.map(([v, , k]) => <option key={v} value={v}>{t(k)}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor={id('message')} className={labelClass}>{t('additionalReqs')}</label>
          <textarea
            id={id('message')}
            name="message"
            rows="4"
            maxLength={1000}
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
            disabled={sending}
            className="w-full sm:w-auto py-3.5 px-7 bg-[#1A822B] hover:bg-[#002DC2] text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-wait cursor-pointer"
          >
            {sending ? (
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
      )}
    </div>
  );
}
