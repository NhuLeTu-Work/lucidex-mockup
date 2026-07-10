import { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  AlertCircle, 
  ShieldCheck, 
  Building2, 
  GraduationCap, 
  Award,
  ArrowRight
} from 'lucide-react';
import { mockAccounts } from '../data/mockData';
import type { AppContextType } from '../App';

export function Login({ ctx }: { ctx: AppContextType }) {
  const { t, setPage, setRole } = ctx;
  
  // Quản lý trạng thái Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Xử lý logic Đăng nhập
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      // Thay text cứng bằng key dịch thuật
      setError(t('errorFieldsRequired') || 'Please fill in all required fields');
      return;
    }

    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const account = mockAccounts.find(
        acc => acc.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (account) {
        if (account.status !== 'active') {
          // Thay text cứng bằng key dịch thuật
          setError(t('errorAccountInactive') || 'This account is currently locked');
          setIsLoading(false);
          return;
        }
        setRole(account.type as 'student' | 'issuer' | 'hr' | 'admin');
        setPage(account.type);
      } else {
        // Thay text cứng bằng key dịch thuật
        setError(t('errorInvalidCredentials') || 'Email or password is invalid');
      }
      setIsLoading(false);
    }, 800);
  };

  // Tính năng Đăng nhập nhanh
  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('••••••••');
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const account = mockAccounts.find(acc => acc.email === demoEmail);
      if (account) {
        setRole(account.type as 'student' | 'issuer' | 'hr' | 'admin');
        setPage(account.type);
      }
      setIsLoading(false);
    }, 500);
  };

  const getRoleIcon = (type: string) => {
    switch (type) {
      case 'admin': return <ShieldCheck size={16} />;
      case 'hr': return <Building2 size={16} />;
      case 'issuer': return <Award size={16} />;
      default: return <GraduationCap size={16} />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-6 animate-in fade-in duration-500" style={{ background: 'var(--ct-bg)' }}>
      <div className="w-full max-w-md flex flex-col gap-6">
        
        {/* Card Đăng Nhập Chính */}
        <div className="p-8 rounded-2xl border shadow-xl flex flex-col gap-6 transition-all" style={{ borderColor: 'var(--ct-border)', background: 'var(--ct-surface)' }}>
          
          {/* Header Card */}
          <div className="text-center flex flex-col gap-2">
            <div className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center border mb-2" style={{ borderColor: 'var(--ct-border)', background: 'var(--ct-bg)' }}>
              <Lock size={22} style={{ color: 'var(--ct-text)' }} />
            </div>
            <h2 className="font-display text-2xl font-semibold tracking-tight" style={{ color: 'var(--ct-text)' }}>
              {t('loginTitle') || 'Welcome back!'}
            </h2>
            <p className="text-sm opacity-70" style={{ color: 'var(--ct-text)' }}>
              {t('loginSubtitle') || 'You can sign in to access with your existing account.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl border flex items-center gap-2.5 text-sm animate-in shake duration-300" style={{ borderColor: '#ef4444', background: 'var(--ct-accent-red, rgba(239, 68, 68, 0.08))', color: '#ef4444' }}>
              <AlertCircle size={16} className="shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-70" style={{ color: 'var(--ct-text)' }}>
               {t('emailAddress') || 'Username or email'}
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
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-70" style={{ color: 'var(--ct-text)' }}>
                  {t('password') || 'Password'}
                </label>
                <a href="#forgot" className="text-xs font-medium hover:underline opacity-70 hover:opacity-100" style={{ color: 'var(--ct-text)' }}>
                  {t('forgotPassword') || 'Forgot Password?'}
                </a>
              </div>
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

            {/* Sign In Button */}
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
                  <LogIn size={16} />
                  <span>{t('signIn') || 'Sign In'}</span>
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

            {/* Google Sign In Button */}
            <button
              type="button"
              className="w-full py-2.5 text-sm font-semibold rounded-xl border shadow-sm transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.99] flex items-center justify-center gap-3"
              style={{ borderColor: 'var(--ct-border)', color: 'var(--ct-text)', background: 'var(--ct-surface)' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>{t('signInWithGoogle') || 'Sign in with Google Account'}</span>
            </button>

            {/* Create Account Link */}
            <div className="mt-3 text-center text-sm flex items-center justify-center gap-1.5" style={{ color: 'var(--ct-text)' }}>
                <span className="opacity-70">{t('newHere') || 'New here?'}</span>
                <button 
                    type="button" 
                    onClick={() => setPage('register')} 
                    className="font-semibold hover:underline opacity-100"
                >
                    {t('createAccount') || 'Create an Account'}
                </button>
            </div>
          </form>
        </div>

        {/* Khu vực Tài Khoản Thử Nghiệm (Demo Accounts) */}
        <div className="p-6 rounded-2xl border flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-150" style={{ borderColor: 'var(--ct-border)', background: 'var(--ct-surface)' }}>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider opacity-80" style={{ color: 'var(--ct-text)' }}>
              {t('demoAccounts') || 'Demo Accounts'}
            </h3>
            <p className="text-[11px] opacity-60" style={{ color: 'var(--ct-text)' }}>
              {t('demoAccountDesc') || 'Quickly select an account below to auto-fill and test the workspace.'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {mockAccounts
              .filter((acc, index, self) => 
                index === self.findIndex((a) => a.type === acc.type)
              )
              .map((acc) => (
              <button
                key={acc.id}
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickLogin(acc.email)}
                className="p-3 text-left rounded-xl border flex flex-col gap-1.5 transition-all hover:scale-[1.01] active:scale-[0.99] group"
                style={{ borderColor: 'var(--ct-border)', background: 'var(--ct-bg)' }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="p-1 rounded-md border text-xs opacity-70 group-hover:opacity-100 transition-opacity" style={{ borderColor: 'var(--ct-border)', background: 'var(--ct-surface)', color: 'var(--ct-text)' }}>
                    {getRoleIcon(acc.type)}
                  </span>
                  <ArrowRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-40 group-hover:translate-x-0 transition-all" style={{ color: 'var(--ct-text)' }} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold truncate" style={{ color: 'var(--ct-text)' }}>
                    {acc.name}
                  </span>
                  <span className="text-[10px] font-mono opacity-60 truncate" style={{ color: 'var(--ct-text)' }}>
                    {acc.type.toUpperCase()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}