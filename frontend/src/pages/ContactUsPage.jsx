import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, ShieldCheck, ArrowRight, CheckCircle2, Building2, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';

// Keep "Tamil Nadu - 638 112" style postcodes on one line
const keepPostcode = (s = '') =>
  s
    .replace(/Tamil Nadu/g, 'Tamil Nadu')
    .replace(/ - (\d{3}) (\d{3})/g, ' - $1 $2')
    .replace(/(\d{3}) (\d{3})/g, '$1 $2');

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
    <div className="bg-white text-black">

      {/* Hero Header — full-bleed photo with left-aligned heading (matches Home hero) */}
      <PageHero
        images="/real-photos/zenitek_photo_04.jpeg"
        badge={t('contactBadge')}
        title={
          <>
            {t('contactTitle1')} <br />
            <span className="text-[#002DC2]">{t('contactTitle2')}</span>
          </>
        }
        subtitle={t('contactSubtitle')}
      />

    <div className="space-y-16 pb-16 pt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Two-Column Workspace */}
      <section className="divider-full pb-16">
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <h2 className="text-3xl sm:text-4xl font-black text-[#123B92] tracking-tight">{t('contactWorkspaceTitle')}</h2>
        <p className="text-base sm:text-lg text-slate-600">{t('contactWorkspaceDesc')}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start lg:items-stretch">
        
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#123B92]/20 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-xl font-bold text-[#123B92]">{t('factoryLocation')}</h3>
              <span className="text-2xs font-bold bg-[#F0F4FD] text-[#123B92] border border-[#123B92]/30 px-2 py-0.5 rounded-md">
                {t('common_contact_verified')}
              </span>
            </div>
            
            <div className="space-y-5 text-xs">
              {/* 1. Registered Office (Main Address) */}
              <div className="p-4 rounded-2xl bg-[#F0F4FD] border border-[#123B92]/20 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-[#123B92] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-2xs font-extrabold uppercase tracking-wider text-[#002DC2] bg-white border border-[#123B92]/20 px-2 py-0.5 rounded inline-block">
                      {t('common_contact_mainAddress')}
                    </span>
                    <h4 className="text-lg font-extrabold text-[#123B92] mt-0.5">
                      {t('regOfficeLabel')}
                    </h4>
                  </div>
                </div>
                <p className="text-black font-medium leading-relaxed sm:pl-10 text-sm">
                  {keepPostcode(t('regOfficeAddress'))}
                </p>
              </div>

              {/* 2. Operation Address */}
              <div className="p-4 rounded-2xl bg-[#F0F4FD] border border-[#123B92]/20 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-[#002DC2] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-2xs font-extrabold uppercase tracking-wider text-[#002DC2] bg-white border border-[#123B92]/20 px-2 py-0.5 rounded inline-block">
                      {t('common_contact_incubation')}
                    </span>
                    <h4 className="text-lg font-extrabold text-[#123B92] mt-0.5">
                      {t('opOfficeLabel')}
                    </h4>
                  </div>
                </div>
                <p className="text-black font-medium leading-relaxed sm:pl-10 text-sm">
                  {keepPostcode(t('opOfficeAddress'))}
                </p>
              </div>

              {/* 3. GSTIN Identification */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F0F4FD] border border-[#123B92]/20">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#002DC2] shrink-0" />
                  <span className="font-bold text-[#123B92] text-xs">GSTIN:</span>
                </div>
                <span className="font-mono font-bold text-[#123B92] tracking-wider text-xs bg-white px-2.5 py-1 rounded border border-[#123B92]/30 shadow-sm">
                  33AACFZ8530G1Z5
                </span>
              </div>

              {/* 4. Contact Numbers */}
              <div className="flex items-start space-x-3 pt-1">
                <div className="w-9 h-9 rounded-xl bg-[#F0F4FD] text-[#002DC2] flex items-center justify-center shrink-0 border border-[#123B92]/20">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="font-bold text-black/70 text-xs uppercase tracking-wider">{t('callUs')}</div>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-3 gap-y-0.5 text-[#123B92] font-extrabold text-lg leading-snug">
                    <a href="tel:+918903852623" className="hover:text-[#002DC2] font-black text-[#123B92] whitespace-nowrap">+91-8903852623</a>
                    <span className="hidden sm:inline text-black/30 font-normal">|</span>
                    <a href="tel:+918098613422" className="hover:text-[#002DC2] text-[#002DC2] whitespace-nowrap">+91 80986 13422</a>
                  </div>
                  <p className="text-[#123B92] font-semibold text-sm">Balakrishnan ({t('common_contact_salesRole')})</p>
                  <p className="text-black/60 text-sm">{t('workingHours')}</p>
                </div>
              </div>

              {/* 5. Email Addresses */}
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#F0F4FD] text-[#002DC2] flex items-center justify-center shrink-0 border border-[#123B92]/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="font-bold text-black/70 text-xs uppercase tracking-wider">{t('emailUs')}</div>
                  <p className="text-black font-medium text-lg leading-snug break-words">
                    <a href="mailto:zenitek2k@gmail.com" className="hover:text-[#002DC2] font-extrabold text-[#123B92]">zenitek2k@gmail.com</a>
                  </p>
                  <p className="text-black/80 text-sm">
                    <a href="mailto:sales@zenitek.in" className="hover:text-[#002DC2] text-[#002DC2]">sales@zenitek.in</a> / <a href="mailto:info@zenitek.in" className="hover:text-[#002DC2] text-[#002DC2]">info@zenitek.in</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/918098613422?text=Hi%20ZeniTEK%20Team!%20I%20want%20a%20quote%20for%20a%20ZeniTEK%20Solar%20Thermal%20Dryer."
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 bg-[#23AC39] hover:bg-[#002DC2] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow flex items-center justify-center gap-2 text-center transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                <span className="text-balance">{t('chatWhatsapp')}</span>
              </a>
            </div>

          </div>
        </div>

        {/* Right Column Form */}
        <div className="lg:col-span-7">
          <div className="h-full bg-white p-4 sm:p-8 rounded-3xl border border-[#123B92]/20 shadow-md space-y-6 flex flex-col">
            <h3 className="text-xl font-bold text-[#123B92]">{t('preQualTitle')}</h3>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-[#F0F4FD] border-2 border-[#23AC39] text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#002DC2] mx-auto" />
                <h4 className="text-lg font-bold text-[#123B92]">{t('common_contact_thanksTitle')}</h4>
                <p className="text-sm text-black/70">
                  {t('common_contact_thanksDesc')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#123B92] mb-1">{t('yourName')} *</label>
                    <input
                      type="text"
                      required
                      placeholder={t('common_contact_namePh')}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#F0F4FD] border border-[#123B92]/30 focus:border-[#002DC2] rounded-xl px-3 sm:px-3.5 py-2.5 text-sm text-black min-w-0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#123B92] mb-1">{t('whatsappNum')} *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#F0F4FD] border border-[#123B92]/30 focus:border-[#002DC2] rounded-xl px-3 sm:px-3.5 py-2.5 text-sm text-black min-w-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#123B92] mb-1">1. {t('userCategory')} *</label>
                  <select
                    value={formData.clientType}
                    onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
                    className="w-full bg-[#F0F4FD] border border-[#123B92]/30 focus:border-[#002DC2] rounded-xl pl-2.5 pr-1.5 sm:px-3.5 py-2.5 text-sm text-black min-w-0 cursor-pointer"
                  >
                    <option value="Individual Farmer">{t('common_client_farmer')}</option>
                    <option value="FPO / Cooperative Group">{t('common_client_fpo')}</option>
                    <option value="Food Processor & Exporter">{t('common_client_processor')}</option>
                    <option value="Industrial/Sludge Processor">{t('common_client_industrial')}</option>
                    <option value="NGO / CSR Partner">{t('common_client_ngo')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#123B92] mb-1">2. {t('desiredCapacity')} *</label>
                  <select
                    value={formData.capacityNeeded}
                    onChange={(e) => setFormData({ ...formData, capacityNeeded: e.target.value })}
                    className="w-full bg-[#F0F4FD] border border-[#123B92]/30 focus:border-[#002DC2] rounded-xl pl-2.5 pr-1.5 sm:px-3.5 py-2.5 text-sm text-black min-w-0 cursor-pointer"
                  >
                    <option value="Under 50 kg (Portable)">{t('common_cap_portable')}</option>
                    <option value="100 to 500 kg (Commercial)">{t('common_cap_commercial')}</option>
                    <option value="1 Ton+ (Industrial)">{t('common_cap_industrial')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#123B92] mb-1">3. {t('targetCrop')} *</label>
                  <select
                    value={formData.cropType}
                    onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                    className="w-full bg-[#F0F4FD] border border-[#123B92]/30 focus:border-[#002DC2] rounded-xl pl-2.5 pr-1.5 sm:px-3.5 py-2.5 text-sm text-black min-w-0 cursor-pointer"
                  >
                    <option value="Copra/Coconut">{t('cropCopra')}</option>
                    <option value="Moringa/Herbs">{t('cropMoringa')}</option>
                    <option value="Spices/Chillies">{t('cropSpices')}</option>
                    <option value="Fruits/Veggies">{t('cropFruits')}</option>
                    <option value="Fish/Seafood">{t('cropFish')}</option>
                    <option value="Other">{t('cropOther')}</option>
                  </select>
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="block text-xs font-bold text-[#123B92] mb-1">{t('additionalReqs')}</label>
                  <textarea
                    rows="3"
                    placeholder={t('common_contact_messagePh')}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full flex-1 bg-[#F0F4FD] border border-[#123B92]/30 focus:border-[#002DC2] rounded-xl px-3 sm:px-3.5 py-2.5 text-sm text-black min-w-0"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 bg-[#23AC39] hover:bg-[#002DC2] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center justify-center gap-2 text-center cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="text-balance">{t('submitProposal')}</span>}
                </button>

              </form>
            )}
          </div>
        </div>

      </div>
      </section>

      {/* Support Assurance Row */}
      <section className="bg-[#F0F4FD] p-6 rounded-2xl border border-[#123B92]/20 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#123B92]">
            <ShieldCheck className="w-5 h-5 shrink-0 text-[#002DC2]" />
            <span className="text-balance">{t('support1')}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#123B92]">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-[#002DC2]" />
            <span className="text-balance">{t('support2')}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#123B92]">
            <Building2 className="w-5 h-5 shrink-0 text-[#002DC2]" />
            <span className="text-balance">{t('support3')}</span>
          </div>
        </div>
      </section>

      {/* CSR Banner */}
      <section className="bg-[#123B92] text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-[#23AC39]">
        <div className="space-y-2">
          <span className="text-2xs font-bold text-[#23AC39] bg-[#0A225C] px-2.5 py-0.5 rounded uppercase border border-[#23AC39]/70 inline-block">
            {t('csrBadge')}
          </span>
          <h3 className="text-2xl font-bold text-white">{t('csrTitle')}</h3>
          <p className="text-sm text-white/90 max-w-xl">
            {t('csrDesc')}
          </p>
        </div>

        <button
          onClick={() => onOpenQuoteModal({ clientType: 'NGO / CSR Partner' })}
          className="w-full md:w-auto py-3 px-6 bg-[#23AC39] hover:bg-[#002DC2] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all shrink-0 cursor-pointer text-center text-balance md:whitespace-nowrap"
        >
          {t('csrBtn')}
        </button>
      </section>

    </div>
    </div>
  );
}
