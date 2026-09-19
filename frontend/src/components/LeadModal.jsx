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
        window.open(`https://wa.me/918098613422?text=${encodeURIComponent(waMsg)}`, '_blank');
        setTimeout(() => onClose(), 2500);
      }
    } catch (err) {
      const waMsg = `Hi ZeniTEK Team! 👋\nI am *${formData.name}* from *${formData.district}, ${formData.state}*.\nInterested in *${formData.capacityNeeded}* for *${formData.cropType}*.\nPhone: ${formData.phone}`;
      window.open(`https://wa.me/918098613422?text=${encodeURIComponent(waMsg)}`, '_blank');
      setTimeout(() => onClose(), 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl border-2 border-[#123B92] shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-5 border-b-2 border-[#00FB00] flex items-center justify-between bg-[#123B92] text-white shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-black/40 text-[#00FB00] border border-[#00FB00]/50 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                Official Enquiry
              </span>
            </div>
            <h3 className="text-base sm:text-xl font-bold mt-0.5 text-white">{t('getQuote')} & Subsidy Sizing</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="m-4 sm:m-6 p-3 sm:p-4 rounded-2xl bg-[#F0F4FD] border-2 border-[#00FB00] text-black text-xs sm:text-sm flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#002DC2] shrink-0" />
            <div>
              <p className="font-bold text-[#123B92]">{successMsg}</p>
              <p className="text-[11px] sm:text-xs text-black/70">Redirecting to WhatsApp for engineer response...</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto bg-white">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-bold text-black mb-1">
                {t('yourName')} <span className="text-[#002DC2]">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Ramesh Kumar"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#F0F4FD] border border-[#123B92]/30 focus:border-[#002DC2] focus:ring-1 focus:ring-[#002DC2] rounded-xl px-3.5 py-2.5 text-xs text-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">
                {t('whatsappNum')} <span className="text-[#002DC2]">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-[#F0F4FD] border border-[#123B92]/30 focus:border-[#002DC2] focus:ring-1 focus:ring-[#002DC2] rounded-xl px-3.5 py-2.5 text-xs text-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">State *</label>
              <input
                type="text"
                name="state"
                required
                placeholder="e.g. Tamil Nadu"
                value={formData.state}
                onChange={handleChange}
                className="w-full bg-[#F0F4FD] border border-[#123B92]/30 focus:border-[#002DC2] focus:ring-1 focus:ring-[#002DC2] rounded-xl px-3.5 py-2.5 text-xs text-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">
                {t('districtCity')} <span className="text-[#002DC2]">*</span>
              </label>
              <input
                type="text"
                name="district"
                required
                placeholder="e.g. Pollachi / Coimbatore"
                value={formData.district}
                onChange={handleChange}
                className="w-full bg-[#F0F4FD] border border-[#123B92]/30 focus:border-[#002DC2] focus:ring-1 focus:ring-[#002DC2] rounded-xl px-3.5 py-2.5 text-xs text-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">{t('userCategory')} *</label>
              <select
                name="clientType"
                value={formData.clientType}
                onChange={handleChange}
                className="w-full bg-[#F0F4FD] border border-[#123B92]/30 focus:border-[#002DC2] focus:ring-1 focus:ring-[#002DC2] rounded-xl px-3.5 py-2.5 text-xs text-black cursor-pointer"
              >
                <option value="Individual Farmer">Individual Farmer</option>
                <option value="FPO / Cooperative Group">FPO / Farmer Cooperative</option>
                <option value="Food Processor & Exporter">Food Processor & Exporter</option>
                <option value="Industrial/Sludge Processor">Industrial / Sludge Processor</option>
                <option value="NGO / CSR Partner">NGO / CSR Partner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">{t('targetCrop')} *</label>
              <select
                name="cropType"
                value={formData.cropType}
                onChange={handleChange}
                className="w-full bg-[#F0F4FD] border border-[#123B92]/30 focus:border-[#002DC2] focus:ring-1 focus:ring-[#002DC2] rounded-xl px-3.5 py-2.5 text-xs text-black cursor-pointer"
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
            <label className="block text-xs font-bold text-black mb-1">{t('desiredCapacity')} *</label>
            <select
              name="capacityNeeded"
              value={formData.capacityNeeded}
              onChange={handleChange}
              className="w-full bg-[#F0F4FD] border border-[#123B92]/30 focus:border-[#002DC2] focus:ring-1 focus:ring-[#002DC2] rounded-xl px-3.5 py-2.5 text-xs text-black cursor-pointer"
            >
              <option value="Under 50 kg (Portable)">Under 50 kg (Portable DIY)</option>
              <option value="100 to 500 kg (Commercial)">100 to 500 kg (Commercial Polyhouse)</option>
              <option value="1 Ton+ (Industrial)">1 Ton+ (Industrial Multi-Tunnel)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1">{t('additionalReqs')}</label>
            <textarea
              name="message"
              rows="3"
              placeholder="e.g. Please share subsidy documents and estimated installation time."
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-[#F0F4FD] border border-[#123B92]/30 focus:border-[#002DC2] focus:ring-1 focus:ring-[#002DC2] rounded-xl px-3.5 py-2.5 text-xs text-black"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-[#123B92]/20 flex items-center justify-between">
            <div className="text-[10px] text-black/60 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#002DC2] mr-1" /> 100% Confidential
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-3 px-6 bg-[#00FB00] hover:bg-[#002DC2] text-black hover:text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md hover:scale-105 transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
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
