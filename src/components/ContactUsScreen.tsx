import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ActiveScreen } from '../types';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Building,
  HelpCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContactUsScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const ContactUsScreen: React.FC<ContactUsScreenProps> = ({ onNavigate }) => {
  const { siteSettings, addContactInquiry, currentUser } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [subject, setSubject] = useState('Portfolio Consultation & Risk Review');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your legal name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setErrorMessage('Please describe your inquiry (minimum 10 characters).');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const createdInquiry = addContactInquiry({
        name,
        email,
        phone: phone || 'Not provided',
        subject,
        message
      });
      setIsSubmitting(false);
      setSubmittedTicketId(createdInquiry.id);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch {}
    }, 500);
  };

  const handleResetForm = () => {
    setSubmittedTicketId(null);
    setMessage('');
    setSubject('Portfolio Consultation & Risk Review');
  };

  const offices = [
    {
      city: 'Jaipur (Office)',
      area: 'Jhalana Doongari',
      address: siteSettings.headquartersAddress,
      desk: 'Mutual Fund Distribution & Client Service'
    }
  ];

  return (
    <div id="contact-screen" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-16">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 bg-[#d3e4fe] text-[#003461] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          <ShieldCheck className="w-4 h-4 text-[#006d42]" />
          AMFI Registered Mutual Fund Distributor • {siteSettings.sebiRegNumber || 'ARN-337289'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#003461] tracking-tight">
          Get in Touch with {siteSettings.companyName}
        </h1>
        <p className="text-sm sm:text-base text-[#424750] mt-2 leading-relaxed">
          Whether you need personalized scheme guidance, folio transfer support, or investment review, our certified mutual fund desk is at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* LEFT COLUMN: Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 institutional-shadow">
          
          {submittedTicketId ? (
            <div className="text-center py-8 space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 bg-[#96f6bd]/40 rounded-full flex items-center justify-center mx-auto text-[#006d42]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#003461]">
                Inquiry Successfully Logged
              </h2>
              <div className="p-4 bg-[#f7f9fb] border border-[#e0e3e5] rounded-xl max-w-md mx-auto text-left">
                <div className="text-xs text-[#727781] mb-1">Reference Ticket Number:</div>
                <div className="text-lg font-mono font-bold text-[#003461]">{submittedTicketId}</div>
                <div className="text-xs text-[#424750] mt-2">
                  We have received your details and will get back to you via <strong>{email}</strong> within 2 business hours.
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <button
                  onClick={handleResetForm}
                  className="px-5 py-2.5 bg-white border border-[#c2c6d1] hover:bg-[#eceef0] rounded-xl text-xs font-bold text-[#191c1e] transition-colors"
                >
                  Submit Another Message
                </button>
                <button
                  onClick={() => onNavigate('booking')}
                  className="px-5 py-2.5 bg-[#003461] hover:bg-[#004b87] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Schedule Live 1-on-1 Video Session
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="border-b border-[#e0e3e5] pb-4 mb-4">
                <h2 className="text-xl font-bold text-[#191c1e]">Send an Inquiry</h2>
                <p className="text-xs text-[#424750] mt-0.5">
                  Direct message to our client success and quantitative portfolio analysts.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-[#ba1a1a]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Name & Email Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5" htmlFor="contact-name">
                    Full Legal Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="e.g. Vikram Malhotra"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden text-[#191c1e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5" htmlFor="contact-email">
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="vikram@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden text-[#191c1e]"
                  />
                </div>
              </div>

              {/* Phone & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5" htmlFor="contact-phone">
                    Phone / Mobile Number
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden text-[#191c1e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5" htmlFor="contact-subject">
                    Inquiry Topic
                  </label>
                  <select
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#c2c6d1] rounded-xl text-xs sm:text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden text-[#191c1e]"
                  >
                    <option value="Portfolio Consultation & Risk Review">Portfolio Consultation & Risk Review</option>
                    <option value="Direct Mutual Fund Selection">Direct Mutual Fund Selection</option>
                    <option value="NRI Portfolio & NRE/NRO Setup">NRI Portfolio & NRE/NRO Setup</option>
                    <option value="Corporate Treasury & Liquid Parking">Corporate Treasury & Liquid Parking</option>
                    <option value="Tax-Saving & Capital Gains Harvesting">Tax-Saving & Capital Gains Harvesting</option>
                    <option value="Technical Support / Folio Issue">Technical Support / Folio Issue</option>
                  </select>
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5" htmlFor="contact-msg">
                  Detailed Message *
                </label>
                <textarea
                  id="contact-msg"
                  rows={4}
                  required
                  placeholder="Please describe your current portfolio size, investment timeline, and any specific questions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden text-[#191c1e]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-xs text-[#727781]">
                  <ShieldCheck className="w-4 h-4 text-[#006d42]" />
                  <span>Confidential & encrypted communication</span>
                </div>
                <button
                  id="submit-contact-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#003461] hover:bg-[#004b87] active:bg-[#002647] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all duration-150 flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Submitting Message...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

        {/* RIGHT COLUMN: Direct Contact Channels & Physical Locations (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Direct Communication Channels Box */}
          <div className="bg-[#003461] text-white rounded-2xl p-6 sm:p-7 shadow-md space-y-5">
            <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#96f6bd]" />
              Direct Contact Channels
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              
              {/* Telephone */}
              <div className="flex items-start gap-3.5 bg-white/10 p-3.5 rounded-xl backdrop-blur-xs">
                <Phone className="w-5 h-5 text-[#96f6bd] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-[#96f6bd] font-bold uppercase tracking-wider">
                    Institutional Phone Helpline
                  </div>
                  <div className="text-base font-bold text-white mt-0.5">{siteSettings.supportPhone}</div>
                  <div className="text-[11px] text-[#e0e3e5]">Mon to Fri, 8:30 AM – 6:30 PM IST</div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5 bg-white/10 p-3.5 rounded-xl backdrop-blur-xs">
                <Mail className="w-5 h-5 text-[#96f6bd] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-[#96f6bd] font-bold uppercase tracking-wider">
                    Direct Email Support
                  </div>
                  <a
                    href={`mailto:${siteSettings.advisoryEmail}`}
                    className="text-sm font-bold text-white hover:underline block mt-0.5"
                  >
                    {siteSettings.advisoryEmail}
                  </a>
                  <div className="text-[11px] text-[#e0e3e5]">General Inquiries: {siteSettings.supportEmail}</div>
                </div>
              </div>

              {/* WhatsApp Live Desk */}
              {siteSettings.whatsappSupportNumber && (
                <div className="flex items-start justify-between gap-3.5 bg-white/10 p-3.5 rounded-xl backdrop-blur-xs">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-[#96f6bd] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] text-[#96f6bd] font-bold uppercase tracking-wider">
                        WhatsApp Portfolio Desk
                      </div>
                      <div className="text-sm font-bold text-white mt-0.5">{siteSettings.whatsappSupportNumber}</div>
                      <div className="text-[11px] text-[#e0e3e5]">Instant chat with relationship manager</div>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${siteSettings.whatsappSupportNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0 self-center"
                  >
                    <span>Chat</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

            </div>

            {/* Quick 1-on-1 booking banner */}
            <div className="pt-4 border-t border-white/20 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Need Face-to-Face Video?</div>
                <div className="text-[11px] text-[#e0e3e5]">Book dedicated 30-min slot</div>
              </div>
              <button
                onClick={() => onNavigate('booking')}
                className="bg-[#006d42] hover:bg-[#005231] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer"
              >
                Book Session →
              </button>
            </div>

          </div>

          {/* Physical Branch Locations */}
          <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 institutional-shadow space-y-4">
            <h3 className="text-xs font-bold text-[#003461] uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[#003461]" />
              Institutional Office Locations
            </h3>

            <div className="space-y-3.5">
              {offices.map((office, idx) => (
                <div key={idx} className="p-3.5 bg-[#f7f9fb] border border-[#e0e3e5] rounded-xl text-xs space-y-1">
                  <div className="font-bold text-[#191c1e] text-sm flex items-center justify-between">
                    <span>{office.city}</span>
                    <span className="text-[10px] text-[#006d42] bg-[#96f6bd]/40 px-2 py-0.5 rounded-full font-bold">
                      Verified
                    </span>
                  </div>
                  <div className="text-[#003461] font-semibold text-[11px]">{office.desk}</div>
                  <div className="text-[#727781] flex items-start gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#727781] shrink-0 mt-0.5" />
                    <span>{office.address}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-[#eceef0] rounded-xl text-[11px] text-[#424750] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#006d42] shrink-0" />
              <span>AMFI Registration: <strong>{siteSettings.sebiRegNumber || 'ARN-337289'}</strong></span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
