import React, { useState } from 'react';
import { ActiveScreen } from '../types';
import { useApp } from '../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  Video,
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Award,
  HelpCircle,
  Headphones,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const BookingScreen: React.FC<BookingScreenProps> = ({ onNavigate }) => {
  const { siteSettings, addBooking, currentUser } = useApp();
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(0); // 0 = Oct
  const [selectedDate, setSelectedDate] = useState<number>(14);
  const [selectedTime, setSelectedTime] = useState<string>('11:30 AM');
  const [preferredMode, setPreferredMode] = useState<'video' | 'phone' | 'whatsapp'>('video');
  
  // Confirmation state
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>('');

  // Form fields
  const [clientName, setClientName] = useState<string>(currentUser?.name || '');
  const [clientEmail, setClientEmail] = useState<string>(currentUser?.email || '');
  const [clientPhone, setClientPhone] = useState<string>(currentUser?.phone || '');
  const [topic, setTopic] = useState<string>('Portfolio Growth & Risk Mitigation');
  const [notes, setNotes] = useState<string>('');

  const months = [
    { name: 'October 2024', daysInMonth: 31, startingDayOffset: 2, prevDays: [29, 30] },
    { name: 'November 2024', daysInMonth: 30, startingDayOffset: 5, prevDays: [27, 28, 29, 30, 31] },
    { name: 'December 2024', daysInMonth: 31, startingDayOffset: 0, prevDays: [] }
  ];

  const currentMonth = months[currentMonthIndex];

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:30 AM',
    '01:00 PM',
    '02:30 PM',
    '04:00 PM',
    '05:30 PM',
    '07:00 PM'
  ];

  const handleNextMonth = () => {
    if (currentMonthIndex < months.length - 1) {
      setCurrentMonthIndex(currentMonthIndex + 1);
      setSelectedDate(5);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
      setSelectedDate(14);
    }
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Please provide your name and phone number to schedule the session.');
      return;
    }

    const ref = `SM-BK-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(ref);

    // Save to AppContext
    addBooking({
      advisorId: 'shaiv-advisory-desk',
      advisorName: 'Chirag Sharma (ARN-337289)',
      date: `${currentMonth.name.split(' ')[0]} ${selectedDate}, 2024`,
      timeSlot: selectedTime,
      clientName,
      clientEmail: clientEmail || `${clientPhone}@client.shaivmarket.in`,
      clientPhone,
      topic,
      notes: `Mode: ${preferredMode.toUpperCase()} | Ref: ${ref} | ${notes}`
    });

    setIsBooked(true);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Fallback
    }
  };

  return (
    <div id="booking-screen" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-16">
      
      {/* Hero Header */}
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 bg-[#d3e4fe] text-[#003461] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
          <ShieldCheck className="w-4 h-4 text-[#006d42]" />
          <span>AMFI Registered Mutual Fund Distributor ({siteSettings.sebiRegNumber || 'ARN-337289'})</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#003461] mb-3">
          Book a Free Consultation Call
        </h1>
        <p className="text-base sm:text-lg text-[#424750] max-w-2xl mx-auto leading-relaxed">
          Schedule a direct 1-on-1 consultation with our institutional research desk to review your portfolio, SIP goals, and asset allocation strategy.
        </p>

        {/* Direct Calendly Integration Option (Configured by Admin) */}
        {siteSettings.enableCalendlyBooking && (siteSettings.calendlyBookingUrl || siteSettings.calendlyUrl) && (
          <div className="mt-5 inline-flex items-center gap-3 bg-[#d3e4fe] border border-[#003461]/20 px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#003461] shadow-2xs">
            <span className="font-semibold">{siteSettings.calendlyTitle || 'Prefer direct 1-on-1 Calendly scheduling?'}</span>
            <a
              id="booking-calendly-btn"
              href={siteSettings.calendlyBookingUrl || siteSettings.calendlyUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-[#003461] hover:bg-[#004b87] text-white font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <span>Book on Calendly</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Main Booking Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Advisory Desk Highlights & Inclusions */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 institutional-shadow space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-[#e0e3e5]">
              <div className="w-12 h-12 rounded-xl bg-[#003461] text-white flex items-center justify-center font-black text-xl shadow-xs">
                {siteSettings.companyName.charAt(0) || 'S'}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#191c1e]">
                  Chirag Sharma (ARN-337289)
                </h3>
                <span className="text-xs text-[#006d42] font-semibold flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  AMFI Registered (ARN-337289)
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#424750]">
              <p className="font-semibold text-[#191c1e]">
                What is covered in your personalized session:
              </p>
              
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#96f6bd]/40 text-[#006d42] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#006d42]" />
                  </span>
                  <div>
                    <strong className="text-[#191c1e] block">Portfolio Health & Overlap Check</strong>
                    <span>Identify duplicate stock holdings and trim redundant expense ratios.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#96f6bd]/40 text-[#006d42] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#006d42]" />
                  </span>
                  <div>
                    <strong className="text-[#191c1e] block">Goal-Based SIP Roadmapping</strong>
                    <span>Tailored compounding models for retirement, wealth creation, or children&apos;s education.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#96f6bd]/40 text-[#006d42] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#006d42]" />
                  </span>
                  <div>
                    <strong className="text-[#191c1e] block">Risk Profile & Asset Allocation</strong>
                    <span>Balance large cap, mid cap, small cap, and debt exposure.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#96f6bd]/40 text-[#006d42] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#006d42]" />
                  </span>
                  <div>
                    <strong className="text-[#191c1e] block">100% Free & Confidential</strong>
                    <span>No consultation charges. Pure client-first guidance.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="p-3.5 bg-[#f7f9fb] rounded-xl border border-[#c2c6d1] space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-[#003461] font-bold">
                <Headphones className="w-4 h-4 text-[#006d42]" />
                <span>Need immediate assistance?</span>
              </div>
              <p className="text-[11px] text-[#424750]">
                Call or WhatsApp our desk directly at{' '}
                <a href={`tel:${siteSettings.supportPhone}`} className="font-bold text-[#003461] hover:underline">
                  {siteSettings.supportPhone}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Calendar, Time Slots & Direct Consultation Form */}
        <div className="lg:col-span-8 bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 institutional-shadow">
          
          {/* Booking Success Banner */}
          {isBooked ? (
            <div className="bg-[#93f3bb]/20 border border-[#006d42] rounded-xl p-6 sm:p-8 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 bg-[#006d42] text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <span className="bg-[#006d42] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Reference ID: {bookingRef}
                </span>
                <h3 className="text-2xl font-black text-[#003461] mt-3">Consultation Scheduled Successfully!</h3>
                <p className="text-sm text-[#191c1e] mt-1.5 max-w-lg mx-auto">
                  Your 1-on-1 session with <strong>Chirag Sharma (ARN-337289)</strong> is confirmed for:
                </p>
                <div className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-xl border border-[#c2c6d1] mt-3 font-bold text-sm text-[#003461] shadow-2xs">
                  <CalendarIcon className="w-4 h-4 text-[#006d42]" />
                  <span>{currentMonth.name.replace(' 2024', '')} {selectedDate}, 2024 at {selectedTime}</span>
                </div>
              </div>
              
              <div className="text-xs text-[#424750] max-w-md mx-auto bg-white p-4 rounded-xl border border-[#e0e3e5] text-left space-y-1.5">
                <p className="font-semibold text-[#191c1e]">
                  Meeting Mode: <span className="uppercase text-[#006d42]">{preferredMode}</span>
                </p>
                <p className="text-[#424750]">
                  Confirmation & meeting link sent to: <strong>{clientEmail || clientPhone}</strong>
                </p>
                <p className="text-[11px] text-[#727781] pt-1 border-t border-[#eceef0]">
                  Our certified specialist will connect with you at the scheduled slot. Please keep your questions or portfolio ready.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <button
                  onClick={() => setIsBooked(false)}
                  className="bg-white border border-[#c2c6d1] text-[#003461] hover:bg-[#eceef0] font-semibold text-xs px-4 py-2.5 rounded-lg cursor-pointer"
                >
                  Schedule Another Session
                </button>
                <button
                  onClick={() => onNavigate('invest')}
                  className="bg-[#003461] text-white font-semibold text-xs px-4 py-2.5 rounded-lg hover:bg-[#004b87] cursor-pointer"
                >
                  Explore Recommended Funds
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConfirmBooking} className="space-y-8">
              
              {/* Top: Date & Time Picker */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Calendar Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-bold text-[#191c1e] flex items-center gap-1.5">
                      <CalendarIcon className="w-4 h-4 text-[#006d42]" />
                      <span>1. Select Date</span>
                    </h3>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        id="cal-prev-month"
                        onClick={handlePrevMonth}
                        disabled={currentMonthIndex === 0}
                        className="p-1.5 hover:bg-[#eceef0] disabled:opacity-30 disabled:cursor-not-allowed rounded-md transition-colors text-[#424750]"
                        aria-label="Previous Month"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-bold text-[#003461] px-2">{currentMonth.name}</span>
                      <button
                        type="button"
                        id="cal-next-month"
                        onClick={handleNextMonth}
                        disabled={currentMonthIndex === months.length - 1}
                        className="p-1.5 hover:bg-[#eceef0] disabled:opacity-30 disabled:cursor-not-allowed rounded-md transition-colors text-[#424750]"
                        aria-label="Next Month"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Weekday Labels */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-1">
                    {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((day) => (
                      <span key={day} className="text-[11px] font-semibold text-[#727781] py-1">
                        {day}
                      </span>
                    ))}
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
                    {currentMonth.prevDays.map((d) => (
                      <button
                        key={`prev-${d}`}
                        type="button"
                        disabled
                        className="p-2 text-[#c2c6d1] cursor-not-allowed"
                      >
                        {d}
                      </button>
                    ))}

                    {Array.from({ length: currentMonth.daysInMonth }, (_, i) => i + 1).map((dayNumber) => {
                      const isSelected = selectedDate === dayNumber;
                      const isPast = currentMonthIndex === 0 && dayNumber < 14;

                      return (
                        <button
                          key={dayNumber}
                          type="button"
                          disabled={isPast}
                          onClick={() => setSelectedDate(dayNumber)}
                          className={`p-2 rounded-lg transition-all text-xs font-bold cursor-pointer ${
                            isSelected
                              ? 'bg-[#003461] text-white shadow-xs'
                              : isPast
                              ? 'text-[#c2c6d1] cursor-not-allowed'
                              : 'text-[#191c1e] hover:bg-[#eceef0]'
                          }`}
                        >
                          {dayNumber}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots Section */}
                <div>
                  <h3 className="text-base font-bold text-[#191c1e] mb-4 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#006d42]" />
                    <span>2. Select Time Slot</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`p-2.5 rounded-xl text-xs font-bold transition-all text-center border cursor-pointer ${
                            isSelected
                              ? 'bg-[#006d42] text-white border-[#006d42] shadow-xs'
                              : 'bg-[#f7f9fb] text-[#424750] border-[#c2c6d1] hover:bg-[#eceef0]'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>

                  {/* Consultation Mode Picker */}
                  <div className="mt-4 pt-3 border-t border-[#eceef0]">
                    <span className="text-xs font-bold text-[#003461] uppercase tracking-wider block mb-2">
                      Preferred Mode:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreferredMode('video')}
                        className={`p-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                          preferredMode === 'video'
                            ? 'bg-[#003461] text-white border-[#003461]'
                            : 'bg-[#f7f9fb] text-[#424750] border-[#c2c6d1]'
                        }`}
                      >
                        Google Meet
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreferredMode('phone')}
                        className={`p-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                          preferredMode === 'phone'
                            ? 'bg-[#003461] text-white border-[#003461]'
                            : 'bg-[#f7f9fb] text-[#424750] border-[#c2c6d1]'
                        }`}
                      >
                        Phone Call
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreferredMode('whatsapp')}
                        className={`p-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                          preferredMode === 'whatsapp'
                            ? 'bg-[#006d42] text-white border-[#006d42]'
                            : 'bg-[#f7f9fb] text-[#424750] border-[#c2c6d1]'
                        }`}
                      >
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom: Client Details Form */}
              <div className="pt-6 border-t border-[#e0e3e5] space-y-4">
                <h3 className="text-base font-bold text-[#191c1e] flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#006d42]" />
                  <span>3. Your Contact Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#424750] mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#727781] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-[#f7f9fb] border border-[#c2c6d1] rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#003461]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#424750] mb-1">
                      Mobile / WhatsApp Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#727781] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-[#f7f9fb] border border-[#c2c6d1] rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#003461]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#424750] mb-1">
                      Email Address (Optional for Meet link)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#727781] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="rahul.sharma@example.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-[#f7f9fb] border border-[#c2c6d1] rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#003461]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#424750] mb-1">
                      Consultation Focus / Topic
                    </label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full px-3 py-2 bg-[#f7f9fb] border border-[#c2c6d1] rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#003461]"
                    >
                      <option value="Portfolio Growth & Risk Mitigation">Portfolio Growth & Risk Mitigation</option>
                      <option value="Portfolio Overlap & Duplicate Check">Portfolio Overlap & Duplicate Check</option>
                      <option value="New SIP Allocation & Goal Planning">New SIP Allocation & Goal Planning</option>
                      <option value="Retirement Wealth Roadmapping">Retirement Wealth Roadmapping</option>
                      <option value="Tax Saving & ELSS Optimization">Tax Saving & ELSS Optimization</option>
                      <option value="Lump Sum Deployment Strategy">Lump Sum Deployment Strategy</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#424750] mb-1">
                    Specific Questions / Existing Portfolio Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Currently investing ₹25,000/mo in 4 funds. Looking to review small-cap exposure..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f7f9fb] border border-[#c2c6d1] rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#003461]"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#006d42] hover:bg-[#005231] text-white font-bold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirm 1-on-1 Consultation for {currentMonth.name.split(' ')[0]} {selectedDate} at {selectedTime}</span>
                  </button>
                  <p className="text-center text-[11px] text-[#727781] mt-2">
                    No consultation charges. You will receive an instant confirmation on WhatsApp and Email.
                  </p>
                </div>

              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
};
