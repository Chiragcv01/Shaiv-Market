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
import { motion, AnimatePresence } from 'motion/react';
import { SuccessBurst } from './interactive/SuccessBurst';

interface BookingScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
}

export const BookingScreen: React.FC<BookingScreenProps> = ({ onNavigate }) => {
  const { siteSettings, addBooking, currentUser } = useApp();
  // real calendar: this month and the next two
  const today = new Date();
  const months = [0, 1, 2].map((k) => {
    const first = new Date(today.getFullYear(), today.getMonth() + k, 1);
    return {
      name: first.toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
      monthName: first.toLocaleString('en-IN', { month: 'long' }),
      year: first.getFullYear(),
      month: first.getMonth(),
      daysInMonth: new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate(),
      startingDayOffset: first.getDay()
    };
  });
  const tomorrowInMonth0 = today.getDate() + 1 <= months[0].daysInMonth;
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(tomorrowInMonth0 ? 0 : 1);
  const [selectedDate, setSelectedDate] = useState<number>(tomorrowInMonth0 ? today.getDate() + 1 : 1);
  const [slideDir, setSlideDir] = useState(1);
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
      setSlideDir(1);
      setCurrentMonthIndex(currentMonthIndex + 1);
      setSelectedDate(1);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonthIndex > 0) {
      setSlideDir(-1);
      setCurrentMonthIndex(currentMonthIndex - 1);
      setSelectedDate(currentMonthIndex - 1 === 0 ? Math.min(today.getDate() + 1, months[0].daysInMonth) : 1);
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
      date: dateLabel,
      timeSlot: selectedTime,
      clientName,
      clientEmail: clientEmail || `${clientPhone}@client.shaivmarket.in`,
      clientPhone,
      topic,
      notes: `Mode: ${preferredMode.toUpperCase()} | Ref: ${ref} | ${notes}`
    });

    setIsBooked(true);
  };

  const dateLabel = `${currentMonth.monthName} ${selectedDate}, ${currentMonth.year}`;
  // Google Calendar link (slot times are IST, +05:30)
  const calendarLink = (() => {
    const m = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!m) return '';
    let h = parseInt(m[1], 10) % 12; if (/pm/i.test(m[3])) h += 12;
    const start = new Date(Date.UTC(currentMonth.year, currentMonth.month, selectedDate, h, parseInt(m[2], 10)) - 330 * 60000);
    const end = new Date(start.getTime() + 30 * 60000);
    const f = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Free portfolio call with Chirag Sharma (Shaiv Market)')}&dates=${f(start)}/${f(end)}&details=${encodeURIComponent(`Topic: ${topic}\nMode: ${preferredMode}\nRef: ${bookingRef}`)}`;
  })();
  const waNumber = (siteSettings.whatsappSupportNumber || '').replace(/[^0-9]/g, '');
  const waConfirm = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi Chirag, I booked a free call on shaivmarket.com.\nName: ${clientName}\nDate: ${dateLabel}, ${selectedTime}\nMode: ${preferredMode}\nTopic: ${topic}\nRef: ${bookingRef}`)}`;

  return (
    <div id="booking-screen" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-16">
      
      {/* Hero Header */}
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 bg-[#E3ECF5] text-[#0F2740] px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
          <ShieldCheck className="w-4 h-4 text-[#8A6420]" />
          <span>AMFI Registered Mutual Fund Distributor ({siteSettings.sebiRegNumber || 'ARN-337289'})</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-[#0F2740] leading-[1.05] mb-3">
          Pick a time. Chirag calls you.
        </h1>
        <p className="text-base sm:text-lg text-[#43566B] max-w-2xl mx-auto leading-relaxed">
          A free 30-minute call to review your portfolio, set your SIP goals and check your asset mix. No charges, no obligation.
        </p>

        {/* Direct Calendly Integration Option (Configured by Admin) */}
        {siteSettings.enableCalendlyBooking && (siteSettings.calendlyBookingUrl || siteSettings.calendlyUrl) && (
          <div className="mt-5 inline-flex items-center gap-3 bg-[#E3ECF5] border border-[#0F2740]/20 px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#0F2740] shadow-2xs">
            <span className="font-semibold">{siteSettings.calendlyTitle || 'Prefer direct 1-on-1 Calendly scheduling?'}</span>
            <a
              id="booking-calendly-btn"
              href={siteSettings.calendlyBookingUrl || siteSettings.calendlyUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-[#0F2740] hover:bg-[#1D4268] text-white font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
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
          <div className="bg-white border border-[#D3DCE6] rounded-2xl p-6 institutional-shadow space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E4EAF0]">
              <div className="w-12 h-12 rounded-xl bg-[#0F2740] text-white flex items-center justify-center font-black text-xl shadow-xs">
                {siteSettings.companyName.charAt(0) || 'S'}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#13263B]">
                  Chirag Sharma (ARN-337289)
                </h3>
                <span className="text-xs text-[#8A6420] font-semibold flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  AMFI Registered (ARN-337289)
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#43566B]">
              <p className="font-semibold text-[#13263B]">
                What is covered in your personalized session:
              </p>
              
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#F3D58E]/40 text-[#8A6420] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#8A6420]" />
                  </span>
                  <div>
                    <strong className="text-[#13263B] block">Portfolio Health & Overlap Check</strong>
                    <span>Identify duplicate stock holdings and trim redundant expense ratios.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#F3D58E]/40 text-[#8A6420] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#8A6420]" />
                  </span>
                  <div>
                    <strong className="text-[#13263B] block">Goal-Based SIP Roadmapping</strong>
                    <span>Tailored compounding models for retirement, wealth creation, or children&apos;s education.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#F3D58E]/40 text-[#8A6420] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#8A6420]" />
                  </span>
                  <div>
                    <strong className="text-[#13263B] block">Risk Profile & Asset Allocation</strong>
                    <span>Balance large cap, mid cap, small cap, and debt exposure.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#F3D58E]/40 text-[#8A6420] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#8A6420]" />
                  </span>
                  <div>
                    <strong className="text-[#13263B] block">100% Free & Confidential</strong>
                    <span>No consultation charges. Pure client-first guidance.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="p-3.5 bg-[#F6F8FB] rounded-xl border border-[#D3DCE6] space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-[#0F2740] font-bold">
                <Headphones className="w-4 h-4 text-[#8A6420]" />
                <span>Need immediate assistance?</span>
              </div>
              <p className="text-[11px] text-[#43566B]">
                Call or WhatsApp our desk directly at{' '}
                <a href={`tel:${siteSettings.supportPhone}`} className="font-bold text-[#0F2740] hover:underline">
                  {siteSettings.supportPhone}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Calendar, Time Slots & Direct Consultation Form */}
        <div className="lg:col-span-8 bg-white border border-[#D3DCE6] rounded-2xl p-6 sm:p-8 institutional-shadow">
          
          {/* Booking Success Banner */}
          {isBooked ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-5 py-4">
              <div className="flex justify-center"><SuccessBurst /></div>
              <div>
                <h3 className="font-display text-3xl sm:text-4xl font-semibold text-[#0F2740]">Your call is booked</h3>
                <p className="text-[#43566B] mt-2">with <strong>Chirag Sharma</strong>, AMFI Registered MFD ({siteSettings.sebiRegNumber})</p>
                <div className="inline-flex items-center gap-3 bg-[#0F2740] text-white px-5 py-3 rounded-2xl mt-4 font-display text-lg">
                  <CalendarIcon className="w-5 h-5 text-[#E3B65C]" />
                  {dateLabel}, {selectedTime}
                </div>
                <p className="text-xs text-[#6B7C8F] mt-2">Reference {bookingRef}, {preferredMode === 'video' ? 'Video call' : preferredMode === 'phone' ? 'Phone call' : 'WhatsApp call'}</p>
              </div>

              <div className="max-w-md mx-auto rounded-2xl bg-[#FBF6EA] p-4 text-left text-sm text-[#13263B]">
                <strong>One last step:</strong> send the booking on WhatsApp so Chirag gets it right away and can confirm your slot.
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {waNumber && (
                  <a href={waConfirm} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold px-5 py-3">
                    <MessageSquare className="w-4 h-4" /> Confirm on WhatsApp
                  </a>
                )}
                {calendarLink && (
                  <a href={calendarLink} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-white ring-1 ring-[#D3DCE6] hover:ring-[#0F2740] text-[#0F2740] font-semibold px-5 py-3">
                    <CalendarIcon className="w-4 h-4" /> Add to Google Calendar
                  </a>
                )}
                <button onClick={() => setIsBooked(false)} className="text-sm text-[#43566B] hover:text-[#0F2740] underline underline-offset-4 cursor-pointer">
                  Book another slot
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleConfirmBooking} className="space-y-8">
              
              {/* Top: Date & Time Picker */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Calendar Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-bold text-[#13263B] flex items-center gap-1.5">
                      <CalendarIcon className="w-4 h-4 text-[#8A6420]" />
                      <span>1. Select Date</span>
                    </h3>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        id="cal-prev-month"
                        onClick={handlePrevMonth}
                        disabled={currentMonthIndex === 0}
                        className="p-1.5 hover:bg-[#EDF1F5] disabled:opacity-30 disabled:cursor-not-allowed rounded-md transition-colors text-[#43566B]"
                        aria-label="Previous Month"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-bold text-[#0F2740] px-2">{currentMonth.name}</span>
                      <button
                        type="button"
                        id="cal-next-month"
                        onClick={handleNextMonth}
                        disabled={currentMonthIndex === months.length - 1}
                        className="p-1.5 hover:bg-[#EDF1F5] disabled:opacity-30 disabled:cursor-not-allowed rounded-md transition-colors text-[#43566B]"
                        aria-label="Next Month"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Weekday Labels */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-1">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                      <span key={day} className="text-[11px] font-semibold text-[#6B7C8F] py-1">
                        {day}
                      </span>
                    ))}
                  </div>

                  {/* Days Grid */}
                  <div className="relative overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false} custom={slideDir}>
                  <motion.div
                    key={currentMonthIndex}
                    custom={slideDir}
                    initial={{ x: slideDir * 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: slideDir * -60, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-7 gap-1 text-center text-sm font-medium"
                  >
                    {Array.from({ length: currentMonth.startingDayOffset }, (_, i) => <span key={`b-${i}`} />)}
                    {Array.from({ length: currentMonth.daysInMonth }, (_, i) => i + 1).map((dayNumber) => {
                      const isSelected = selectedDate === dayNumber;
                      const isPast = currentMonthIndex === 0 && dayNumber <= today.getDate();
                      return (
                        <motion.button
                          key={dayNumber}
                          type="button"
                          disabled={isPast}
                          onClick={() => setSelectedDate(dayNumber)}
                          whileTap={isPast ? undefined : { scale: 0.9 }}
                          aria-pressed={isSelected}
                          aria-label={`${currentMonth.monthName} ${dayNumber}`}
                          className={`relative h-10 rounded-xl tabular-nums transition-colors ${
                            isSelected ? 'text-white' : isPast ? 'text-[#C9D3DE] cursor-not-allowed' : 'text-[#13263B] hover:bg-[#EEF3F8] cursor-pointer'
                          }`}
                        >
                          {isSelected && (
                            <motion.span layoutId="cal-day" className="absolute inset-0 rounded-xl bg-[#0F2740] shadow-md"
                              transition={{ type: 'spring', stiffness: 500, damping: 32 }} />
                          )}
                          <span className="relative">{dayNumber}</span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                  </AnimatePresence>
                  </div>
                </div>

                {/* Time Slots Section */}
                <div>
                  <h3 className="text-base font-bold text-[#13263B] mb-4 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#8A6420]" />
                    <span>2. Select Time Slot</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <motion.button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          whileTap={{ scale: 0.95 }}
                          aria-pressed={isSelected}
                          className={`relative p-2.5 rounded-xl text-sm font-medium text-center cursor-pointer transition-colors ${
                            isSelected ? 'text-[#0F2740]' : 'bg-[#F6F8FB] text-[#43566B] ring-1 ring-[#D3DCE6] hover:bg-[#EDF1F5]'
                          }`}
                        >
                          {isSelected && (
                            <motion.span layoutId="cal-time" className="absolute inset-0 rounded-xl bg-[#E3B65C] shadow-md"
                              transition={{ type: 'spring', stiffness: 500, damping: 32 }} />
                          )}
                          <span className="relative tabular-nums">{slot}</span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Consultation Mode Picker */}
                  <div className="mt-4 pt-3 border-t border-[#EDF1F5]">
                    <span className="text-xs font-bold text-[#0F2740] uppercase tracking-wider block mb-2">
                      Preferred Mode:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreferredMode('video')}
                        className={`p-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                          preferredMode === 'video'
                            ? 'bg-[#0F2740] text-white border-[#0F2740]'
                            : 'bg-[#F6F8FB] text-[#43566B] border-[#D3DCE6]'
                        }`}
                      >
                        Google Meet
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreferredMode('phone')}
                        className={`p-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                          preferredMode === 'phone'
                            ? 'bg-[#0F2740] text-white border-[#0F2740]'
                            : 'bg-[#F6F8FB] text-[#43566B] border-[#D3DCE6]'
                        }`}
                      >
                        Phone Call
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreferredMode('whatsapp')}
                        className={`p-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                          preferredMode === 'whatsapp'
                            ? 'bg-[#8A6420] text-white border-[#8A6420]'
                            : 'bg-[#F6F8FB] text-[#43566B] border-[#D3DCE6]'
                        }`}
                      >
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom: Client Details Form */}
              <div className="pt-6 border-t border-[#E4EAF0] space-y-4">
                <h3 className="text-base font-bold text-[#13263B] flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#8A6420]" />
                  <span>3. Your Contact Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#43566B] mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#6B7C8F] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-[#F6F8FB] border border-[#D3DCE6] rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0F2740]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#43566B] mb-1">
                      Mobile / WhatsApp Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#6B7C8F] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-[#F6F8FB] border border-[#D3DCE6] rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0F2740]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#43566B] mb-1">
                      Email Address (Optional for Meet link)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#6B7C8F] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="rahul.sharma@example.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-[#F6F8FB] border border-[#D3DCE6] rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0F2740]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#43566B] mb-1">
                      Consultation Focus / Topic
                    </label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F6F8FB] border border-[#D3DCE6] rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0F2740]"
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
                  <label className="block text-xs font-bold text-[#43566B] mb-1">
                    Specific Questions / Existing Portfolio Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Currently investing ₹25,000/mo in 4 funds. Looking to review small-cap exposure..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F6F8FB] border border-[#D3DCE6] rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0F2740]"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#8A6420] hover:bg-[#6F501A] text-white font-bold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirm 1-on-1 Consultation for {currentMonth.name.split(' ')[0]} {selectedDate} at {selectedTime}</span>
                  </button>
                  <p className="text-center text-[11px] text-[#6B7C8F] mt-2">
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
