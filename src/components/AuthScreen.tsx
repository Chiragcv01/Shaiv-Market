import React, { useState } from 'react';
import { ActiveScreen, AuthMode } from '../types';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  RefreshCw,
  SlidersHorizontal,
  Building
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthScreenProps {
  initialMode?: AuthMode;
  onNavigate: (screen: ActiveScreen) => void;
  onSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = 'login',
  onNavigate,
  onSuccess
}) => {
  const { login, signup, resetPassword, currentUser, siteSettings } = useApp();
  const [authMode, setAuthMode] = useState<AuthMode>(initialMode);

  // Form states
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(true);
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password flow states
  const [recoveryStep, setRecoveryStep] = useState<1 | 2 | 3>(1);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!emailOrUsername.trim()) {
      setErrorMessage('Please provide your username or email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Password is required.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = login(emailOrUsername, password);
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage(`Welcome back, ${res.user?.name}!`);
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        } catch {}
        setTimeout(() => {
          if (res.user?.role === 'admin') {
            onNavigate('admin');
          } else {
            onNavigate('home');
          }
          if (onSuccess) onSuccess();
        }, 500);
      } else {
        setErrorMessage(res.error || 'Invalid credentials. Please verify username/email and password.');
      }
    }, 400);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim()) {
      setErrorMessage('Full legal name is required.');
      return;
    }
    if (!emailOrUsername.trim() || !emailOrUsername.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }
    if (!termsAccepted) {
      setErrorMessage('You must accept the terms of service and risk disclosures.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = signup({
        name,
        email: emailOrUsername,
        password,
        phone: phoneNumber || '+91 98765 00000'
      });
      setIsLoading(false);

      if (res.success) {
        setSuccessMessage('Investor account created successfully!');
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch {}
        setTimeout(() => {
          onNavigate('home');
          if (onSuccess) onSuccess();
        }, 600);
      } else {
        setErrorMessage(res.error || 'Failed to create account.');
      }
    }, 500);
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (recoveryStep === 1) {
      if (!emailOrUsername.trim() || !emailOrUsername.includes('@')) {
        setErrorMessage(`Please enter the email address linked to your ${siteSettings.companyName} account.`);
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setRecoveryStep(2);
        setOtpCode('894201');
        setSuccessMessage(`Recovery verification code dispatched to ${emailOrUsername}`);
      }, 500);
    } else if (recoveryStep === 2) {
      if (otpCode.trim().length < 4) {
        setErrorMessage('Please enter the 6-digit verification code.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setRecoveryStep(3);
        setSuccessMessage('Identity verified. Please set your new secure password.');
      }, 400);
    } else if (recoveryStep === 3) {
      if (newPassword.length < 6) {
        setErrorMessage('New password must be at least 6 characters.');
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        resetPassword(emailOrUsername, newPassword);
        setIsLoading(false);
        setSuccessMessage('Password reset successfully! Redirecting to login...');
        try {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        } catch {}
        setTimeout(() => {
          setAuthMode('login');
          setRecoveryStep(1);
          setPassword(newPassword);
        }, 1000);
      }, 500);
    }
  };

  return (
    <div id="auth-screen" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-16">
      
      <div className="max-w-xl mx-auto">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#d3e4fe] text-[#003461] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-[#006d42]" />
            <span>256-Bit SSL Encrypted • {siteSettings.companyName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003461] tracking-tight">
            {authMode === 'login' && `Sign In to ${siteSettings.companyName}`}
            {authMode === 'signup' && 'Create Your Investor Account'}
            {authMode === 'forgot-password' && 'Reset Account Password'}
          </h1>
          <p className="text-xs sm:text-sm text-[#424750] mt-1.5">
            {authMode === 'login' && 'Access curated mutual funds, research desks, and distributor support.'}
            {authMode === 'signup' && 'Seamless 100% paperless onboarding and disciplined folio management.'}
            {authMode === 'forgot-password' && 'Enter your registered credentials to recover account access.'}
          </p>
        </div>

        {/* Auth Mode Toggle Tabs (when not in recovery) */}
        {authMode !== 'forgot-password' && (
          <div className="flex bg-[#e0e3e5] p-1 rounded-xl mb-6 border border-[#c2c6d1]">
            <button
              id="tab-login-btn"
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-[#003461] shadow-xs'
                  : 'text-[#424750] hover:text-[#191c1e]'
              }`}
            >
              Sign In
            </button>
            <button
              id="tab-signup-btn"
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-white text-[#003461] shadow-xs'
                  : 'text-[#424750] hover:text-[#191c1e]'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Main Form Container */}
        <div className="bg-white border border-[#c2c6d1] rounded-2xl p-6 sm:p-8 institutional-shadow">
          
          {/* Status Alerts */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-[#ba1a1a] animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 bg-[#96f6bd]/30 border border-[#006d42]/30 rounded-xl flex items-start gap-2.5 text-xs text-[#005231] font-medium animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#006d42]" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5" htmlFor="login-identifier">
                  Username or Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#727781] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-identifier"
                    type="text"
                    placeholder="name@example.com or username"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] focus:border-[#003461] outline-hidden text-[#191c1e]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider" htmlFor="login-password">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot-password');
                      setRecoveryStep(1);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-xs text-[#003461] hover:text-[#006d42] font-semibold transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#727781] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] focus:border-[#003461] outline-hidden text-[#191c1e]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#727781] hover:text-[#191c1e] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-[#424750] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#003461] focus:ring-[#003461]"
                  />
                  <span>Remember session on this device</span>
                </label>
              </div>

              <button
                id="submit-login-btn"
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#003461] hover:bg-[#004b87] active:bg-[#002647] text-white font-bold text-sm py-3 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-3 border-t border-[#e0e3e5] text-xs text-[#727781]">
                <span>New to {siteSettings.companyName}? </span>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-[#006d42] font-bold hover:underline cursor-pointer"
                >
                  Create an Investor Account
                </button>
              </div>

            </form>
          )}

          {/* 2. SIGN UP FORM */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5" htmlFor="signup-name">
                  Full Legal Name (as per PAN)
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#727781] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-name"
                    type="text"
                    placeholder="e.g. Ramesh Kumar Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] focus:border-[#003461] outline-hidden text-[#191c1e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5" htmlFor="signup-email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#727781] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-email"
                    type="email"
                    placeholder="name@example.com"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] focus:border-[#003461] outline-hidden text-[#191c1e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5" htmlFor="signup-phone">
                  Mobile Number (Aadhaar Linked)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#727781] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] focus:border-[#003461] outline-hidden text-[#191c1e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5" htmlFor="signup-pass">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#727781] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-pass"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min 6 chars"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] focus:border-[#003461] outline-hidden text-[#191c1e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5" htmlFor="signup-confirm-pass">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#727781] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-confirm-pass"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] focus:border-[#003461] outline-hidden text-[#191c1e]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 text-xs text-[#424750] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-[#003461] focus:ring-[#003461]"
                  />
                  <span>
                    I accept {siteSettings.companyName}'s Terms of Service, Privacy Policy & Risk Disclosures.
                  </span>
                </label>
              </div>

              <button
                id="submit-signup-btn"
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#006d42] hover:bg-[#005231] text-white font-bold text-sm py-3 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Investor Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-3 border-t border-[#e0e3e5] text-xs text-[#727781]">
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-[#003461] font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>

            </form>
          )}

          {/* 3. FORGOT PASSWORD FORM */}
          {authMode === 'forgot-password' && (
            <form onSubmit={handleRecoverySubmit} className="space-y-4">
              
              {recoveryStep === 1 && (
                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5" htmlFor="rec-email">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#727781] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="rec-email"
                      type="email"
                      placeholder="name@example.com"
                      value={emailOrUsername}
                      onChange={(e) => setEmailOrUsername(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] focus:border-[#003461] outline-hidden text-[#191c1e]"
                    />
                  </div>
                </div>
              )}

              {recoveryStep === 2 && (
                <div>
                  <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1.5" htmlFor="rec-otp">
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    id="rec-otp"
                    type="text"
                    maxLength={6}
                    placeholder="894201"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    className="w-full text-center tracking-widest font-mono text-lg py-2.5 border border-[#c2c6d1] rounded-xl bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] focus:border-[#003461] outline-hidden text-[#191c1e]"
                  />
                  <p className="text-[11px] text-[#727781] mt-1 text-center">Demo OTP code is pre-filled</p>
                </div>
              )}

              {recoveryStep === 3 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1" htmlFor="rec-new-pass">
                      New Password
                    </label>
                    <input
                      id="rec-new-pass"
                      type="password"
                      placeholder="Min 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-1" htmlFor="rec-confirm-pass">
                      Confirm New Password
                    </label>
                    <input
                      id="rec-confirm-pass"
                      type="password"
                      placeholder="Repeat new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-[#c2c6d1] rounded-xl text-sm bg-[#f7f9fb] focus:ring-2 focus:ring-[#003461] outline-hidden"
                    />
                  </div>
                </div>
              )}

              <button
                id="submit-recovery-btn"
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#003461] hover:bg-[#004b87] text-white font-bold text-sm py-3 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>
                      {recoveryStep === 1 && 'Send Recovery Code'}
                      {recoveryStep === 2 && 'Verify OTP Code'}
                      {recoveryStep === 3 && 'Update Password'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setRecoveryStep(1);
                }}
                className="w-full py-2 text-center text-xs font-semibold text-[#727781] hover:text-[#191c1e] flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>

            </form>
          )}

        </div>

      </div>

    </div>
  );
};
