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
      window.open(`https://wa.me/918098613422?text=${encodeURIComponent(waMsg)}`, '_blank');
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
          {t('contactBadge')}
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-blue-950">
          {t('contactTitle1')} <br />
          <span className="text-green-700">
            {t('contactTitle2')}
          </span>
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto font-medium">
          {t('contactSubtitle')}
        </p>
      </div>

      {/* Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-blue-950">{t('factoryLocation')}</h3>
              <span className="text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-md">
                Verified Hub
              </span>
            </div>
            
            <div className="space-y-5 text-xs">
              {/* 1. Registered Office (Main Address) */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                      Main Address
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-xs mt-0.5">
                      {t('regOfficeLabel')}
                    </h4>
                  </div>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed pl-10 text-[11px]">
                  {t('regOfficeAddress')}
                </p>
              </div>

              {/* 2. Operation Address */}
              <div className="p-4 rounded-2xl bg-green-50/40 border border-green-100 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-green-700 bg-green-100/70 px-2 py-0.5 rounded">
                      Incubation Center
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-xs mt-0.5">
                      {t('opOfficeLabel')}
                    </h4>
                  </div>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed pl-10 text-[11px]">
                  {t('opOfficeAddress')}
                </p>
              </div>

              {/* 3. GSTIN Identification */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                  <span className="font-bold text-slate-700 text-[11px]">GSTIN:</span>
                </div>
                <span className="font-mono font-bold text-blue-950 tracking-wider text-xs bg-white px-2.5 py-1 rounded border border-slate-200 shadow-sm">
                  33AACFZ8530G1Z5
                </span>
              </div>

              {/* 4. Contact Numbers */}
              <div className="flex items-start space-x-3 pt-1">
                <div className="w-9 h-9 rounded-xl bg-green-50 text-green-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-slate-900">{t('callUs')}</div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-slate-800 font-bold text-xs">
                    <a href="tel:+918903852623" className="hover:text-blue-700 font-extrabold text-blue-900">+91-8903852623</a>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <a href="tel:+918098613422" className="hover:text-blue-700">+91 80986 13422</a>
                  </div>
                  <p className="text-blue-900 font-semibold text-[11px]">Balakrishnan (Sales & Engineering)</p>
                  <p className="text-slate-500 text-[10px]">{t('workingHours')}</p>
                </div>
              </div>

              {/* 5. Email Addresses */}
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900">{t('emailUs')}</div>
                  <p className="text-slate-800 font-medium">
                    <a href="mailto:zenitek2k@gmail.com" className="hover:text-blue-700 font-semibold text-blue-900">zenitek2k@gmail.com</a>
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    <a href="mailto:sales@zenitek.in" className="hover:text-blue-700">sales@zenitek.in</a> / <a href="mailto:info@zenitek.in" className="hover:text-blue-700">info@zenitek.in</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/918098613422?text=Hi%20ZeniTEK%20Team!%20I%20want%20a%20quote%20for%20a%20ZeniTEK%20Solar%20Thermal%20Dryer."
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
            <h3 className="text-xl font-bold text-blue-950">{t('preQualTitle')}</h3>

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
                    <option value="Copra/Coconut">{t('cropCopra')}</option>
                    <option value="Moringa/Herbs">{t('cropMoringa')}</option>
                    <option value="Spices/Chillies">{t('cropSpices')}</option>
                    <option value="Fruits/Veggies">{t('cropFruits')}</option>
                    <option value="Fish/Seafood">{t('cropFish')}</option>
                    <option value="Other">{t('cropOther')}</option>
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
            <span>{t('support1')}</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs font-bold text-green-700">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-blue-700" />
            <span>{t('support2')}</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs font-bold text-slate-900">
            <Building2 className="w-5 h-5 shrink-0 text-blue-700" />
            <span>{t('support3')}</span>
          </div>
        </div>
      </section>

      {/* CSR Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-green-800 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-green-300 bg-blue-950 px-2.5 py-0.5 rounded uppercase">
            {t('csrBadge')}
          </span>
          <h3 className="text-2xl font-bold">{t('csrTitle')}</h3>
          <p className="text-xs text-blue-100 max-w-xl">
            {t('csrDesc')}
          </p>
        </div>

        <button
          onClick={() => onOpenQuoteModal({ clientType: 'NGO / CSR Partner' })}
          className="py-3 px-6 bg-green-600 hover:bg-green-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all shrink-0"
        >
          {t('csrBtn')}
        </button>
      </section>

    </div>
  );
}
