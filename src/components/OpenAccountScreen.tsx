import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SuccessBurst } from './interactive/SuccessBurst';
import { ActiveScreen, AccountFormData } from '../types';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  TrendingUp,
  Headphones,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall,
  Calendar,
  ExternalLink,
  Lock,
  ArrowRight,
  User,
  Phone,
  Mail,
  MapPin,
  FileCheck
,
  MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatIndianCurrency } from '../utils/calculator';

interface OpenAccountScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
  prefillPlan?: { monthly?: number; years?: number; lumpsum?: number };
}

export const OpenAccountScreen: React.FC<OpenAccountScreenProps> = ({
  onNavigate,
  prefillPlan
}) => {
  const { siteSettings, addQuote } = useApp();
  const waNumber = (siteSettings.whatsappSupportNumber || '').replace(/[^0-9]/g, '');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [generatedQuoteNumber, setGeneratedQuoteNumber] = useState<string>('');

  const [formData, setFormData] = useState<AccountFormData>({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    investmentType: 'sip',
    investmentAmount: prefillPlan?.monthly || 10000,
    selectedFund: 'Curated Growth Portfolio',
    investmentGoal: 'Wealth Creation (10+ Yrs)'
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: keyof AccountFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) {
      errors.fullName = 'Please enter your full name';
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (formData.email && !formData.email.includes('@')) {
      errors.email = 'Please enter a valid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Capture simplified lead in global AppContext
    const newQuote = addQuote({
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email?.trim() || undefined,
      city: formData.city?.trim() || undefined,
      investmentAmount: formData.investmentAmount,
      investmentType: formData.investmentType,
      selectedFund: formData.selectedFund,
      investmentGoal: formData.investmentGoal
    });

    setGeneratedQuoteNumber(newQuote.id);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  return (
    <div id="open-account-screen" className="w-full bg-[#F6F8FB] min-h-screen py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#F3D58E]/40 text-[#6F501A] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4 text-[#8A6420]" />
            <span>AMFI Registered Mutual Fund Distributor ({siteSettings.sebiRegNumber})</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#0F2740] leading-[1.05]">
            Start a SIP, set up in one call
          </h1>
          <p className="text-xs sm:text-sm text-[#43566B] max-w-xl mx-auto mt-2">
            No complicated paperwork or immediate bank mandate required. Provide your basic contact details, and Chirag will prepare a plan and guide you personally.
          </p>
        </div>

        {/* Success Confirmation State */}
        {isSubmitted ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#D3DCE6] rounded-3xl p-8 sm:p-10 text-center space-y-6">
            <div className="flex justify-center"><SuccessBurst /></div>
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0F2740]">Thank you, {formData.fullName.split(' ')[0]}</h2>
              <p className="text-[#43566B] mt-2 max-w-lg mx-auto">
                Your request is saved with reference <strong className="tabular-nums">{generatedQuoteNumber}</strong>.
                Send it on WhatsApp so Chirag can reply with your plan today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {waNumber && (
                <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi Chirag, I requested a quote on shaivmarket.com (${generatedQuoteNumber}).\nName: ${formData.fullName}\nPhone: ${formData.phone}\nCity: ${formData.city || '-'}\nGoal: ${formData.investmentGoal}\nAmount: ${formData.investmentAmount ? '₹' + Number(formData.investmentAmount).toLocaleString('en-IN') : '-'} (${formData.investmentType})`)}`}
                  target="_blank" rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold px-6 py-3">
                  <MessageCircle className="w-4 h-4" /> Send on WhatsApp
                </a>
              )}
              <button onClick={() => onNavigate('booking')}
                className="w-full sm:w-auto rounded-xl bg-[#0F2740] hover:bg-[#1D4268] text-white font-semibold px-6 py-3 cursor-pointer">
                Pick a time for a call
              </button>
            </div>
            <ol className="text-left max-w-md mx-auto space-y-2 text-sm text-[#43566B]">
              <li><strong className="text-[#0F2740]">1.</strong> Chirag calls or WhatsApps you on {formData.phone}.</li>
              <li><strong className="text-[#0F2740]">2.</strong> You get a plan matched to your goal and risk comfort.</li>
              <li><strong className="text-[#0F2740]">3.</strong> Paperless KYC and your first SIP, usually within a day.</li>
            </ol>
          </motion.div>
        ) : (
          /* Simplified Lead Capture Form */
          <div className="bg-white border border-[#D3DCE6] rounded-2xl p-6 sm:p-10 institutional-shadow space-y-6">
            
            <div className="border-b border-[#E4EAF0] pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0F2740]">
                  Basic Investor Information
                </h3>
                <p className="text-xs text-[#6B7C8F]">
                  Quick 1-minute submission. Bank details or mandate not needed right now.
                </p>
              </div>
              <span className="text-xs font-bold text-[#8A6420] bg-[#F3D58E]/40 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Zero Spam Guaranteed
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#13263B] mb-1.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#8A6420]" />
                    <span>Full Name <span className="text-[#ba1a1a]">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#F6F8FB] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2740] ${
                      formErrors.fullName ? 'border-[#ba1a1a]' : 'border-[#D3DCE6]'
                    }`}
                  />
                  {formErrors.fullName && (
                    <p className="text-[11px] text-[#ba1a1a] mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-[#13263B] mb-1.5 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#8A6420]" />
                    <span>Mobile Number <span className="text-[#ba1a1a]">*</span></span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98200 12345"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#F6F8FB] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2740] ${
                      formErrors.phone ? 'border-[#ba1a1a]' : 'border-[#D3DCE6]'
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="text-[11px] text-[#ba1a1a] mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Email (Optional) & City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#13263B] mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#0F2740]" />
                      <span>Email Address</span>
                    </span>
                    <span className="text-[10px] text-[#6B7C8F] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. ramesh@example.com"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#F6F8FB] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2740] ${
                      formErrors.email ? 'border-[#ba1a1a]' : 'border-[#D3DCE6]'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-[#ba1a1a] mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-[#13263B] mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0F2740]" />
                      <span>City / Location</span>
                    </span>
                    <span className="text-[10px] text-[#6B7C8F] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jaipur"
                    value={formData.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F6F8FB] border border-[#D3DCE6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2740]"
                  />
                </div>
              </div>

              {/* Investment Preferences (Optional) */}
              <div className="bg-[#F6F8FB] p-4 rounded-xl border border-[#E4EAF0] space-y-3">
                <span className="text-xs font-bold text-[#0F2740] uppercase tracking-wider block">
                  Investment Preferences
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#43566B] block mb-1">
                      Mode of Investment
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleInputChange('investmentType', 'sip')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                          formData.investmentType === 'sip'
                            ? 'bg-[#0F2740] text-white border-[#0F2740]'
                            : 'bg-white text-[#43566B] border-[#D3DCE6]'
                        }`}
                      >
                        Monthly SIP
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('investmentType', 'lumpsum')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                          formData.investmentType === 'lumpsum'
                            ? 'bg-[#0F2740] text-white border-[#0F2740]'
                            : 'bg-white text-[#43566B] border-[#D3DCE6]'
                        }`}
                      >
                        One-Time Lumpsum
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#43566B] block mb-1">
                      Approximate Amount (₹)
                    </label>
                    <input
                      type="number"
                      min={500}
                      step={500}
                      value={formData.investmentAmount || 10000}
                      onChange={(e) => handleInputChange('investmentAmount', Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-[#D3DCE6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2740]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#43566B] block mb-1">
                    Primary Goal
                  </label>
                  <select
                    value={formData.investmentGoal}
                    onChange={(e) => handleInputChange('investmentGoal', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-[#D3DCE6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2740]"
                  >
                    <option value="Wealth Creation (10+ Yrs)">Long Term Wealth Creation (10+ Years)</option>
                    <option value="Child Higher Education">Child Higher Education & Future</option>
                    <option value="Retirement Corpus Planning">Early Retirement / FIRE Roadmap</option>
                    <option value="Tax Saving ELSS">Tax Saving (Section 80C ELSS)</option>
                    <option value="Emergency Fund / Short Term">Capital Preservation / Emergency Cushion</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#8A6420] hover:bg-[#6F501A] text-white font-bold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm active:scale-98"
                >
                  <span>Submit & Request a Call Back</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-[#6B7C8F] text-center leading-relaxed">
                By submitting, you agree to receive mutual fund investment consultation from AMFI Registered Distributor {siteSettings.companyName} (ARN: {siteSettings.sebiRegNumber}). We do not charge upfront fees or share your phone number.
              </p>

            </form>

          </div>
        )}

      </div>
    </div>
  );
};
