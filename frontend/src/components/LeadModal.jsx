import React, { useState, useEffect } from 'react';
import { X, Send, MessageCircle, ShieldCheck, CheckCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LeadModal({ isOpen, onClose, initialData = {} }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsappPreference: true,
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    clientType: 'Individual Farmer',
    cropType: 'Copra/Coconut',
    capacityNeeded: '100 to 500 kg (Commercial)',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMsg(data.message || 'Quote requested successfully!');
        if (data.whatsappUrl) {
          setTimeout(() => {
            window.open(data.whatsappUrl, '_blank');
          }, 800);
        }
        setTimeout(() => {
          onClose();
          setSuccessMsg(null);
        }, 3000);
      } else {
        const waMsg = `Hi ZeniTEK Team! 👋\nI am *${formData.name}* from *${formData.district}, ${formData.state}*.\nInterested in *${formData.capacityNeeded}* for *${formData.cropType}*.\nPhone: ${formData.phone}`;
        window.open(`https://wa.me/919442589000?text=${encodeURIComponent(waMsg)}`, '_blank');
        setTimeout(() => onClose(), 2500);
      }
    } catch (err) {
      const waMsg = `Hi ZeniTEK Team! 👋\nI am *${formData.name}* from *${formData.district}, ${formData.state}*.\nInterested in *${formData.capacityNeeded}* for *${formData.cropType}*.\nPhone: ${formData.phone}`;
      window.open(`https://wa.me/919442589000?text=${encodeURIComponent(waMsg)}`, '_blank');
      setTimeout(() => onClose(), 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-900 via-blue-800 to-green-800 text-white">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-green-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                Official Enquiry
              </span>
            </div>
            <h3 className="text-xl font-bold mt-1">{t('getQuote')} & Subsidy Sizing</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="m-6 p-4 rounded-2xl bg-green-50 border border-green-300 text-green-800 text-sm flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
            <div>
              <p className="font-bold">{successMsg}</p>
              <p className="text-xs text-green-700">Redirecting to WhatsApp for engineer response...</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('yourName')} <span className="text-blue-600">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Ramesh Kumar"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('whatsappNum')} <span className="text-blue-600">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
              <input
                type="text"
                name="state"
                required
                placeholder="e.g. Tamil Nadu"
                value={formData.state}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('districtCity')} <span className="text-blue-600">*</span>
              </label>
              <input
                type="text"
                name="district"
                required
                placeholder="e.g. Pollachi / Coimbatore"
                value={formData.district}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('userCategory')} *</label>
              <select
                name="clientType"
                value={formData.clientType}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 cursor-pointer"
              >
                <option value="Individual Farmer">Individual Farmer</option>
                <option value="FPO / Cooperative Group">FPO / Farmer Cooperative</option>
                <option value="Food Processor & Exporter">Food Processor & Exporter</option>
                <option value="Industrial/Sludge Processor">Industrial / Sludge Processor</option>
                <option value="NGO / CSR Partner">NGO / CSR Partner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('targetCrop')} *</label>
              <select
                name="cropType"
                value={formData.cropType}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 cursor-pointer"
              >
                <option value="Copra/Coconut">Copra / Coconut</option>
                <option value="Moringa/Herbs">Moringa / Herbs / Tea</option>
                <option value="Spices/Chillies">Spices / Chillies / Pepper</option>
                <option value="Fruits/Veggies">Fruits / Vegetables</option>
                <option value="Fish/Seafood">Fish / Marine Seafood</option>
                <option value="Other">Other Agricultural / Industrial</option>
              </select>
            </div>

          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t('desiredCapacity')} *</label>
            <select
              name="capacityNeeded"
              value={formData.capacityNeeded}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 cursor-pointer"
            >
              <option value="Under 50 kg (Portable)">Under 50 kg (Portable DIY)</option>
              <option value="100 to 500 kg (Commercial)">100 to 500 kg (Commercial Polyhouse)</option>
              <option value="1 Ton+ (Industrial)">1 Ton+ (Industrial Multi-Tunnel)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t('additionalReqs')}</label>
            <textarea
              name="message"
              rows="3"
              placeholder="e.g. Please share subsidy documents and estimated installation time."
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-[10px] text-slate-500 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600 mr-1" /> 100% Confidential
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-3 px-6 bg-gradient-to-r from-blue-700 via-blue-600 to-green-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md hover:scale-105 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{t('chatWhatsapp')}</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
