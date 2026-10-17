import React, { useState } from 'react';
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
    <div id="open-account-screen" className="w-full bg-[#f7f9fb] min-h-screen py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#96f6bd]/40 text-[#005231] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4 text-[#006d42]" />
            <span>AMFI Registered Mutual Fund Distributor ({siteSettings.sebiRegNumber})</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#191c1e] tracking-tight">
            Start Your Mutual Fund Investment Journey
          </h1>
          <p className="text-xs sm:text-sm text-[#424750] max-w-xl mx-auto mt-2">
            No complicated paperwork or immediate bank mandate required. Provide your basic contact details, and our certified wealth expert will prepare a custom quote and guide you directly.
          </p>
        </div>

        {/* Success Confirmation State */}
        {isSubmitted ? (
          <div className="bg-white border border-[#c2c6d1] rounded-2xl p-8 sm:p-10 institutional-shadow text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-[#96f6bd]/50 text-[#006d42] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-[#006d42]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#006d42] bg-[#96f6bd]/30 px-3 py-1 rounded-full">
                Investment Request Received
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191c1e]">
                Thank You, {formData.fullName}!
              </h2>
              <p className="text-xs sm:text-sm text-[#424750] max-w-lg mx-auto">
                Aapki basic details successfully record ho gayi hain. Humare certified mutual fund expert aapse jaldi hi connect karenge.
              </p>
            </div>

            {/* Quote Reference Box */}
            <div className="bg-[#f7f9fb] border-2 border-dashed border-[#003461]/30 rounded-xl p-5 max-w-md mx-auto space-y-2">
              <span className="text-[11px] font-semibold text-[#727781] uppercase tracking-wider block">
                Your Official Quote Reference Number:
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#003461] tracking-wider font-mono">
                {generatedQuoteNumber}
              </div>
              <p className="text-[11px] text-[#006d42] font-semibold">
                ✓ Expert Allocation & Consultation Underway
              </p>
            </div>

            {/* What happens next */}
            <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-4 text-left max-w-md mx-auto space-y-2">
              <h4 className="text-xs font-bold text-[#003461] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#006d42]" />
                What happens next?
              </h4>
              <ul className="text-xs text-[#1e3a8a] space-y-1.5 list-disc pl-4">
                <li>Hamare expert aapko <strong>{formData.phone}</strong> par call ya WhatsApp karenge.</li>
                <li>Aapki preferred schemes aur risk appetite ke hisaab se personalized quote milega.</li>
                <li>Seamless 100% paperless onboarding via BSE StAR MF / NSE NMF.</li>
              </ul>
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#e0e3e5]">
              <button
                onClick={() => onNavigate('home')}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#003461] hover:bg-[#002647] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Back to Dashboard
              </button>

              <button
                onClick={() => onNavigate('insights')}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Explore Live Market Insights
              </button>
            </div>
          </div>
        ) : (
          /* Simplified Lead Capture Form */
          <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-10 institutional-shadow space-y-6">
            
            <div className="border-b border-[#e0e3e5] pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#003461]">
                  Basic Investor Information
                </h3>
                <p className="text-xs text-[#727781]">
                  Quick 1-minute submission. Bank details or mandate not needed right now.
                </p>
              </div>
              <span className="text-xs font-bold text-[#006d42] bg-[#96f6bd]/40 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Zero Spam Guaranteed
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#191c1e] mb-1.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#006d42]" />
                    <span>Full Name <span className="text-[#ba1a1a]">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#f7f9fb] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003461] ${
                      formErrors.fullName ? 'border-[#ba1a1a]' : 'border-[#c2c6d1]'
                    }`}
                  />
                  {formErrors.fullName && (
                    <p className="text-[11px] text-[#ba1a1a] mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-[#191c1e] mb-1.5 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#006d42]" />
                    <span>Mobile Number <span className="text-[#ba1a1a]">*</span></span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98200 12345"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#f7f9fb] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003461] ${
                      formErrors.phone ? 'border-[#ba1a1a]' : 'border-[#c2c6d1]'
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
                  <label className="text-xs font-bold text-[#191c1e] mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#003461]" />
                      <span>Email Address</span>
                    </span>
                    <span className="text-[10px] text-[#727781] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. ramesh@example.com"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#f7f9fb] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003461] ${
                      formErrors.email ? 'border-[#ba1a1a]' : 'border-[#c2c6d1]'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-[#ba1a1a] mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-[#191c1e] mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#003461]" />
                      <span>City / Location</span>
                    </span>
                    <span className="text-[10px] text-[#727781] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jaipur"
                    value={formData.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#f7f9fb] border border-[#c2c6d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003461]"
                  />
                </div>
              </div>

              {/* Investment Preferences (Optional) */}
              <div className="bg-[#f7f9fb] p-4 rounded-xl border border-[#e0e3e5] space-y-3">
                <span className="text-xs font-bold text-[#003461] uppercase tracking-wider block">
                  Investment Preferences
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#424750] block mb-1">
                      Mode of Investment
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleInputChange('investmentType', 'sip')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                          formData.investmentType === 'sip'
                            ? 'bg-[#003461] text-white border-[#003461]'
                            : 'bg-white text-[#424750] border-[#c2c6d1]'
                        }`}
                      >
                        Monthly SIP
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('investmentType', 'lumpsum')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                          formData.investmentType === 'lumpsum'
                            ? 'bg-[#003461] text-white border-[#003461]'
                            : 'bg-white text-[#424750] border-[#c2c6d1]'
                        }`}
                      >
                        One-Time Lumpsum
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#424750] block mb-1">
                      Approximate Amount (₹)
                    </label>
                    <input
                      type="number"
                      min={500}
                      step={500}
                      value={formData.investmentAmount || 10000}
                      onChange={(e) => handleInputChange('investmentAmount', Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-[#c2c6d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003461]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#424750] block mb-1">
                    Primary Goal
                  </label>
                  <select
                    value={formData.investmentGoal}
                    onChange={(e) => handleInputChange('investmentGoal', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-[#c2c6d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003461]"
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
                  className="w-full bg-[#006d42] hover:bg-[#005231] text-white font-bold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm active:scale-98"
                >
                  <span>Submit & Request a Call Back</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-[#727781] text-center leading-relaxed">
                By submitting, you agree to receive mutual fund investment consultation from AMFI Registered Distributor {siteSettings.companyName} (ARN: {siteSettings.sebiRegNumber}). We do not charge upfront fees or share your phone number.
              </p>

            </form>

          </div>
        )}

      </div>
    </div>
  );
};
