import React from 'react';
import { Bell, CheckCircle2, TrendingUp, Calendar, ShieldCheck, X } from 'lucide-react';
import { ActiveScreen } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ActiveScreen) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      title: 'Book an Intro Call',
      desc: 'A 20-minute call to set up your SIP: goal, risk profile, category options and paperless KYC.',
      time: 'Now open',
      icon: Calendar,
      action: 'booking' as ActiveScreen
    },
    {
      id: '2',
      title: 'Plan Your Goals',
      desc: 'Use the SIP, SWP, FIRE and goal SIP calculators to see what you need to invest.',
      time: 'Tools',
      icon: TrendingUp,
      action: 'calculators' as ActiveScreen
    },
    {
      id: '3',
      title: 'Check Your KYC',
      desc: 'A valid KYC is required before investing in mutual funds. We can help you complete it.',
      time: 'Reminder',
      icon: ShieldCheck,
      action: 'open-account' as ActiveScreen
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/40 backdrop-blur-2xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-[#D3DCE6] animate-in slide-in-from-top-4 mt-16">
        
        <div className="flex items-center justify-between border-b border-[#E4EAF0] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E3ECF5] flex items-center justify-center text-[#0F2740]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#13263B]">Institutional Alerts</h3>
              <p className="text-[11px] text-[#6B7C8F]">Real-time market & account updates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#6B7C8F] hover:text-[#13263B] p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                onClick={() => {
                  onNavigate(n.action);
                  onClose();
                }}
                className="p-3.5 rounded-xl border border-[#E4EAF0] hover:border-[#0F2740] hover:bg-[#F6F8FB] transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-[#EDF1F5] flex items-center justify-center shrink-0 mt-0.5 text-[#0F2740]">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-[#13263B]">{n.title}</h4>
                    <p className="text-[11px] text-[#43566B] leading-snug mt-0.5">{n.desc}</p>
                    <span className="text-[10px] text-[#6B7C8F] block mt-1">{n.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 mt-3 border-t border-[#E4EAF0] text-center">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#0F2740] hover:underline"
          >
            Mark all as read
          </button>
        </div>

      </div>
    </div>
  );
};
