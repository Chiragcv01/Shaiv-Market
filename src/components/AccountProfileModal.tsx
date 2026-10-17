import React from 'react';
import { useApp } from '../context/AppContext';
import { User, ShieldCheck, CreditCard, FileCheck, LogOut, X, ChevronRight, SlidersHorizontal, LogIn } from 'lucide-react';
import { ActiveScreen } from '../types';

interface AccountProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ActiveScreen) => void;
}

export const AccountProfileModal: React.FC<AccountProfileModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { currentUser, logout } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/40 backdrop-blur-2xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-[#c2c6d1] animate-in slide-in-from-top-4 mt-16 space-y-4">
        
        <div className="flex items-center justify-between border-b border-[#e0e3e5] pb-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#003461] text-white flex items-center justify-center font-bold text-sm">
                {currentUser.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <h3 className="text-sm font-bold text-[#191c1e] truncate">{currentUser.name}</h3>
                <p className="text-xs text-[#727781] truncate">{currentUser.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#eceef0] text-[#003461] flex items-center justify-center font-bold text-sm">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#191c1e]">Guest Visitor</h3>
                <p className="text-xs text-[#727781]">Sign in to access your folio</p>
              </div>
            </div>
          )}
          <button onClick={onClose} className="text-[#727781] hover:text-[#191c1e] p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser && (
          <div className="bg-[#f7f9fb] border border-[#e0e3e5] rounded-xl p-3 space-y-1 text-xs">
            <div className="flex justify-between text-[#727781]">
              <span>Account Role</span>
              <span className="text-[#006d42] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {currentUser.role === 'admin' ? 'Master Admin' : 'Verified Investor'}
              </span>
            </div>
            <div className="flex justify-between text-[#727781]">
              <span>Folio Number</span>
              <span className="font-bold text-[#191c1e]">{currentUser.folioId || 'SW-8942-IND'}</span>
            </div>
          </div>
        )}

        <div className="space-y-1">
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                onNavigate('admin');
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-white bg-[#003461] hover:bg-[#004b87] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Admin CMS & Operations</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              onNavigate('open-account');
              onClose();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold text-[#191c1e] hover:bg-[#eceef0] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#003461]" />
              <span>KYC & Profile Registration</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#727781]" />
          </button>

          <button
            onClick={() => {
              onNavigate('booking');
              onClose();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold text-[#191c1e] hover:bg-[#eceef0] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#003461]" />
              <span>My Consultation Call</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#727781]" />
          </button>

          <button
            onClick={() => {
              onNavigate('invest');
              onClose();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold text-[#191c1e] hover:bg-[#eceef0] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#003461]" />
              <span>Portfolio Allocation</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#727781]" />
          </button>
        </div>

        <div className="pt-2 border-t border-[#e0e3e5]">
          {currentUser ? (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full py-2 text-center text-xs font-bold text-[#ba1a1a] hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Account</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onNavigate('auth');
                onClose();
              }}
              className="w-full py-2 text-center text-xs font-bold text-[#003461] hover:bg-[#d3e4fe] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

