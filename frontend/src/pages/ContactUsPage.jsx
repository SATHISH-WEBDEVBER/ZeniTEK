import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, ShieldCheck, ArrowRight, CheckCircle2, Building2, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ContactUsPage({ onOpenQuoteModal }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    clientType: 'Individual Farmer',
    capacityNeeded: '100 to 500 kg (Commercial)',
    cropType: 'Copra/Coconut',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setSubmitted(true);

      if (data.whatsappUrl) {
        setTimeout(() => {
          window.open(data.whatsappUrl, '_blank');
        }, 800);
      }
    } catch (err) {
      console.log('Client fallback submit:', err);
      const waMsg = `Hi ZeniTEK Team! 👋\nI am *${formData.name}* from *${formData.district}, ${formData.state}*.\nCategory: ${formData.clientType}\nCapacity: *${formData.capacityNeeded}* for *${formData.cropType}*.\nPhone: ${formData.phone}`;
      window.open(`https://wa.me/919442589000?text=${encodeURIComponent(waMsg)}`, '_blank');
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 pb-16 pt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-900">
      
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
          DIRECT FACTORY CONTACT
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-blue-950">
          Let’s Build Your Sustainable <br />
          <span className="text-green-700">
            Drying Solution.
          </span>
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto font-medium">
          Contact our thermal engineers in Coimbatore, Tamil Nadu for custom moisture analysis, subsidy assistance, and factory direct pricing.
        </p>
      </div>

      {/* Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
            <h3 className="text-xl font-bold text-blue-950 border-b border-slate-100 pb-3">{t('factoryLocation')}</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Factory & Office Address</div>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    ZeniTEK Solar Works, SF 248/1, SIDCO Industrial Estate, Malumichampatti, Coimbatore, Tamil Nadu 641021
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 text-green-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{t('callUs')}</div>
                  <p className="text-slate-700 font-semibold mt-1">+91 94425 89000 / +91 422 2689000</p>
                  <p className="text-slate-500 text-[10px]">Mon - Sat: 9:00 AM - 7:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{t('emailUs')}</div>
                  <p className="text-slate-700 mt-1">sales@zenitek.in / info@zenitek.in</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/919442589000?text=Hi%20ZeniTEK%20Team!%20I%20want%20a%20quote%20for%20a%20Solar%20Thermal%20Dryer."
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 bg-green-600 hover:bg-green-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow flex items-center justify-center space-x-2 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{t('chatWhatsapp')}</span>
              </a>
            </div>

          </div>
        </div>

        {/* Right Column Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
            <h3 className="text-xl font-bold text-blue-950">Pre-Qualifying Quote & Sizing Enquiry</h3>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-green-50 border border-green-300 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900">Thank You for Reaching Out!</h4>
                <p className="text-xs text-slate-600">
                  Your enquiry has been logged. Our thermal engineers will connect with you on WhatsApp / Phone within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t('yourName')} *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Subramaniam"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t('whatsappNum')} *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">1. {t('userCategory')} *</label>
                  <select
                    value={formData.clientType}
                    onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 cursor-pointer"
                  >
                    <option value="Individual Farmer">Individual Farmer</option>
                    <option value="FPO / Cooperative Group">FPO / Cooperative Group</option>
                    <option value="Food Processor & Exporter">Food Processor & Exporter</option>
                    <option value="Industrial/Sludge Processor">Industrial / Sludge Processor</option>
                    <option value="NGO / CSR Partner">NGO / CSR Partner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">2. {t('desiredCapacity')} *</label>
                  <select
                    value={formData.capacityNeeded}
                    onChange={(e) => setFormData({ ...formData, capacityNeeded: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 cursor-pointer"
                  >
                    <option value="Under 50 kg (Portable)">Under 50 kg (Portable DIY)</option>
                    <option value="100 to 500 kg (Commercial)">100 to 500 kg (Commercial Polyhouse)</option>
                    <option value="1 Ton+ (Industrial)">1 Ton+ (Industrial Multi-Tunnel)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">3. {t('targetCrop')} *</label>
                  <select
                    value={formData.cropType}
                    onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 cursor-pointer"
                  >
                    <option value="Copra/Coconut">Copra / Coconut</option>
                    <option value="Moringa/Herbs">Moringa / Herbs / Tea</option>
                    <option value="Spices/Chillies">Spices / Chillies / Pepper</option>
                    <option value="Fruits/Veggies">Fruits / Vegetables</option>
                    <option value="Fish/Seafood">Fish / Marine Seafood</option>
                    <option value="Other">Other Industrial / Sludge</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('additionalReqs')}</label>
                  <textarea
                    rows="3"
                    placeholder="Mention location, target moisture levels, or subsidy questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-700 to-green-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow hover:scale-105 transition-all flex items-center justify-center space-x-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{t('submitProposal')}</span>}
                </button>

              </form>
            )}
          </div>
        </div>

      </div>

      {/* Support Assurance Row */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-xs font-bold text-blue-700">
            <ShieldCheck className="w-5 h-5 shrink-0 text-green-600" />
            <span>Free Government Subsidy Eligibility Check</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs font-bold text-green-700">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-blue-700" />
            <span>Custom Moisture-Analysis Sizing Consults</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs font-bold text-slate-900">
            <Building2 className="w-5 h-5 shrink-0 text-blue-700" />
            <span>100% On-Farm Setup & Operator Training</span>
          </div>
        </div>
      </section>

      {/* CSR Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-green-800 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-green-300 bg-blue-950 px-2.5 py-0.5 rounded uppercase">
            CSR & NGO PARTNERSHIP PORTAL
          </span>
          <h3 className="text-2xl font-bold">Partner with ZeniTEK for Rural Livelihood Projects</h3>
          <p className="text-xs text-blue-100 max-w-xl">
            We collaborate with CSR foundations, NABARD, and agricultural NGOs to deploy solar dryers for rural women self-help groups.
          </p>
        </div>

        <button
          onClick={() => onOpenQuoteModal({ clientType: 'NGO / CSR Partner' })}
          className="py-3 px-6 bg-green-600 hover:bg-green-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all shrink-0"
        >
          Request CSR Partnership Pitch
        </button>
      </section>

    </div>
  );
}
