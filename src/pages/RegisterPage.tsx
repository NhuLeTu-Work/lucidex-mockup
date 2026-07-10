import { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  AlertCircle,
  X,
  CheckCircle,
  ShieldAlert
} from 'lucide-react';
import { mockAccounts } from '../data/mockData';
import type { AppContextType } from '../App';

export function Register({ ctx }: { ctx: AppContextType }) {
  const { t, setPage, setRole } = ctx;
  
  // Trạng thái Form Đăng ký
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Trạng thái OTP Modal
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  // Validation Logic
  const validatePassword = (pwd: string) => {
    // Ít nhất 8 ký tự, 1 hoa, 1 thường, 1 số, 1 ký tự đặc biệt
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(pwd);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Kiểm tra rỗng
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError(t('errorFieldsRequired') || 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    // 2. Kiểm tra mật khẩu trùng khớp
    if (password !== confirmPassword) {
      setError(t('errorPasswordMismatch') || 'Password and Confirm Password do not match.');
      return;
    }

    // 3. Kiểm tra độ mạnh mật khẩu
    if (!validatePassword(password)) {
      setError(
        t('errorWeakPassword') || 
        'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.'
      );
      return;
    }

    setIsLoading(true);

    // Mô phỏng API check email tồn tại
    setTimeout(() => {
      const emailExists = mockAccounts.some(
        acc => acc.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (emailExists) {
        setError(t('errorEmailExists') || 'This email is already registered.');
        setIsLoading(false);
        return;
      }

      // Vượt qua mọi điều kiện -> Gửi OTP & Hiển thị Modal
      setIsLoading(false);
      setShowOtpModal(true);
      setOtpValue('');
      setOtpError(null);
    }, 800);
  };

  const handleVerifyOTP = () => {
    if (!otpValue.trim()) return;
    
    setOtpError(null);
    setIsOtpLoading(true);

    // Mô phỏng API kiểm tra OTP
    setTimeout(() => {
      // 123456: Mock OTP hợp lệ | 000000: Mock OTP hết hạn
      if (otpValue === '123456') {
        // Đăng ký thành công -> Mặc định gán quyền 'student' (Credential Owner)
        setRole('student');
        setPage('student');
      } else if (otpValue === '000000') {
        setOtpError(t('errorOtpExpired') || 'OTP has expired. Please request a new code.');
      } else {
        setOtpError(t('errorOtpInvalid') || 'Invalid OTP. Please try again.');
      }
      setIsOtpLoading(false);
    }, 800);
  };

  const handleOAuthRegister = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Thành công tạo tài khoản từ OAuth Identity (Không lưu mật khẩu) -> Điều hướng
      setRole('student');
      setPage('student');
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-6 animate-in fade-in duration-500" style={{ background: 'var(--ct-bg)' }}>
      <div className="w-full max-w-md flex flex-col gap-6">
        
        {/* Form Đăng ký */}
        <div className="p-8 rounded-2xl border shadow-xl flex flex-col gap-6 transition-all" style={{ borderColor: 'var(--ct-border)', background: 'var(--ct-surface)' }}>
          
          <div className="text-center flex flex-col gap-2">
            <div className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center border mb-2" style={{ borderColor: 'var(--ct-border)', background: 'var(--ct-bg)' }}>
              <UserPlus size={22} style={{ color: 'var(--ct-text)' }} />
            </div>
            <h2 className="font-display text-2xl font-semibold tracking-tight" style={{ color: 'var(--ct-text)' }}>
              {t('createAccountTitle') || 'Create an Account'}
            </h2>
            <p className="text-sm opacity-70" style={{ color: 'var(--ct-text)' }}>
              {t('createAccountSubtitle') || 'Join us to securely manage your credentials.'}
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl border flex items-start gap-2.5 text-sm animate-in shake duration-300" style={{ borderColor: '#ef4444', background: 'var(--ct-accent-red, rgba(239, 68, 68, 0.08))', color: '#ef4444' }}>
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span className="font-medium text-balance">{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-70" style={{ color: 'var(--ct-text)' }}>
                {t('emailAddress') || 'Email Address'}
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 opacity-40" style={{ color: 'var(--ct-text)' }}>
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  disabled={isLoading}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border outline-none transition-all focus:border-neutral-400 disabled:opacity-50"
                  style={{ background: 'var(--ct-bg)', borderColor: 'var(--ct-border)', color: 'var(--ct-text)' }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-70" style={{ color: 'var(--ct-text)' }}>
                {t('password') || 'Password'}
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 opacity-40" style={{ color: 'var(--ct-text)' }}>
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border outline-none transition-all focus:border-neutral-400 disabled:opacity-50"
                  style={{ background: 'var(--ct-bg)', borderColor: 'var(--ct-border)', color: 'var(--ct-text)' }}
                />
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 opacity-40 hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--ct-text)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-70" style={{ color: 'var(--ct-text)' }}>
                {t('confirmPassword') || 'Confirm Password'}
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 opacity-40" style={{ color: 'var(--ct-text)' }}>
                  <ShieldAlert size={16} />
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  disabled={isLoading}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border outline-none transition-all focus:border-neutral-400 disabled:opacity-50"
                  style={{ background: 'var(--ct-bg)', borderColor: 'var(--ct-border)', color: 'var(--ct-text)' }}
                />
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 opacity-40 hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--ct-text)' }}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 text-sm font-semibold rounded-xl shadow-md transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: 'var(--ct-text)', color: 'var(--ct-bg)' }}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>{t('signUp') || 'Sign Up'}</span>
                </>
              )}
            </button>

            {/* OR Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t" style={{ borderColor: 'var(--ct-border)' }}></div>
              <span className="shrink-0 px-3 text-xs font-semibold uppercase tracking-wider opacity-40" style={{ color: 'var(--ct-text)' }}>
                {t('or') || 'or'}
              </span>
              <div className="flex-grow border-t" style={{ borderColor: 'var(--ct-border)' }}></div>
            </div>

            {/* Google Sign Up Button */}
            <button
              type="button"
              onClick={handleOAuthRegister}
              disabled={isLoading}
              className="w-full py-2.5 text-sm font-semibold rounded-xl border shadow-sm transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-50"
              style={{ borderColor: 'var(--ct-border)', color: 'var(--ct-text)', background: 'var(--ct-surface)' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>{t('signUpWithGoogle') || 'Sign up with Google Account'}</span>
            </button>

            {/* Login Link */}
            <div className="mt-3 text-center text-sm flex items-center justify-center gap-1.5" style={{ color: 'var(--ct-text)' }}>
              <span className="opacity-70">{t('alreadyHaveAccount') || 'Already have an account?'}</span>
              <button type="button" onClick={() => setPage('login')} className="font-semibold hover:underline opacity-100">
                {t('signIn') || 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* OTP Modal Overlay */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 animate-in fade-in duration-300" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md rounded-2xl border p-8 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col gap-6" style={{ background: 'var(--ct-surface)', borderColor: 'var(--ct-border)' }}>
            
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl font-semibold mb-1" style={{ color: 'var(--ct-text)' }}>
                  {t('verifyEmail') || 'Verify your email'}
                </h3>
                <p className="text-sm opacity-70" style={{ color: 'var(--ct-text)' }}>
                  {t('otpSentDesc') || `We've sent a 6-digit code to`} <span className="font-semibold opacity-100">{email}</span>
                </p>
              </div>
              <button onClick={() => setShowOtpModal(false)} className="p-1 rounded-lg opacity-50 hover:opacity-100 transition-opacity" style={{ color: 'var(--ct-text)' }}>
                <X size={20} />
              </button>
            </div>

            {/* OTP Mock Hint (For Demo Purposes) */}
            <div className="p-3 rounded-lg text-center font-mono text-sm tracking-widest border" style={{ background: 'var(--ct-bg)', borderColor: 'var(--ct-border)', color: 'var(--ct-text)' }}>
              123456 <span className="tracking-normal font-sans text-xs opacity-50 ml-2">(Valid)</span> | 000000 <span className="tracking-normal font-sans text-xs opacity-50 ml-2">(Expired)</span>
            </div>

            {otpError && (
              <div className="p-3 rounded-xl border flex items-center gap-2 text-sm animate-in shake" style={{ borderColor: '#ef4444', background: 'var(--ct-accent-red, rgba(239, 68, 68, 0.08))', color: '#ef4444' }}>
                <AlertCircle size={16} />
                <span>{otpError}</span>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <input 
                type="text" 
                value={otpValue} 
                onChange={e => setOtpValue(e.target.value.replace(/[^0-9]/g, ''))} 
                placeholder="000000" 
                maxLength={6} 
                disabled={isOtpLoading}
                className="w-full px-4 py-3 rounded-xl border text-xl text-center font-mono tracking-[0.5em] outline-none focus:border-neutral-400 transition-all disabled:opacity-50" 
                style={{ background: 'var(--ct-bg)', borderColor: 'var(--ct-border)', color: 'var(--ct-text)' }} 
              />

              <button 
                onClick={handleVerifyOTP} 
                disabled={isOtpLoading || otpValue.length < 6}
                className="w-full py-3 text-sm font-semibold rounded-xl shadow-md transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2" 
                style={{ background: 'var(--ct-text)', color: 'var(--ct-bg)' }}
              >
                {isOtpLoading ? (
                  <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle size={16} />
                    {t('verifyAndProceed') || 'Verify & Proceed'}
                  </>
                )}
              </button>

              <button 
                type="button" 
                disabled={isOtpLoading}
                onClick={() => { setOtpValue(''); setOtpError(null); }}
                className="w-full mt-1 py-2 text-xs opacity-70 hover:opacity-100 hover:underline transition-all disabled:opacity-40"
                style={{ color: 'var(--ct-text)' }}
              >
                {t('resendOTP') || 'Didn\'t receive a code? Resend'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}