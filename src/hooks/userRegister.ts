import { useState } from 'react';
import { mockAccounts } from '../data/mockData';
import { useApp } from '@/app/AppContext';
import { useNavigate } from 'react-router-dom';
import type { RegistrationRole, BusinessData } from '../types/register';

export function useRegister() {
  const { t, setRole } = useApp();
  const navigate = useNavigate();

  // Trạng thái chung
  const [roleType, setRoleType] = useState<RegistrationRole>('owner');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [certificate, setCertificate] = useState<File | null>(null);

  // Trạng thái Form Credential Owner
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // state
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [missingFieldKeys, setMissingFieldKeys] = useState<string[]>([]);

  // Trạng thái Form Issuer / Verifier
  const [bizData, setBizData] = useState<BusinessData>({
    orgName: '',
    taxCode: '',
    address: '',
    legalRep: '',
    email: '',
    phone: '',
    regName: '',
    regTitle: '',
  });

  // Trạng thái OTP Modal
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleType(e.target.value as RegistrationRole);
    setError(null);
    setFieldErrors({});
    setIsSuccess(false);
  };

  const validatePassword = (pwd: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(pwd);
  };

  const handleOwnerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorKey(null);

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorKey('errorFieldsRequired');
      return;
    }
    if (password !== confirmPassword) {
      setErrorKey('errorPasswordMismatch');
      return;
    }
    if (!validatePassword(password)) {
      setErrorKey('errorWeakPassword');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const existingUser = mockAccounts.find(acc => acc.email.toLowerCase() === email.trim().toLowerCase());

      if (existingUser) {
        setErrorKey(existingUser.authProvider === 'google' ? 'errorEmailExistsGoogle' : 'errorEmailExists');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setShowOtpModal(true);
      setOtpValue('');
      setOtpError(null);
    }, 800);
  };

  const handleGoogleRegister = () => {
  const googleEmail = email.trim();

  if (!googleEmail) {
    setErrorKey('errorFieldsRequired');
    return;
  }

  setErrorKey(null);
  setIsLoading(true);

  setTimeout(() => {
    const existingUser = mockAccounts.find(acc => acc.email.toLowerCase() === googleEmail.toLowerCase());

    if (existingUser) {
      if (existingUser.authProvider === 'password' || !existingUser.authProvider) {
        setErrorKey('errorEmailExistsPassword');
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      setRole('owner');
      navigate('/owner');
      return;
    }

    setIsLoading(false);
    setRole('owner');
    navigate('/owner');
  }, 800);
};

  const handleVerifyOTP = () => {
    if (!otpValue.trim()) return;
    setOtpError(null);
    setIsOtpLoading(true);
    setTimeout(() => {
      if (otpValue === '123456') {
        setRole('owner');
        navigate('/owner')
      } else if (otpValue === '000000') {
        setOtpError(t('errorOtpExpired') || 'OTP has expired.');
      } else {
        setOtpError(t('errorOtpInvalid') || 'Invalid OTP.');
      }
      setIsOtpLoading(false);
    }, 800);
  };

  const handleBizChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBizData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (fieldErrors[e.target.name]) {
      setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleBizRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorKey(null);
    setMissingFieldKeys([]);
    setFieldErrors({});

    const missingKeys: string[] = [];
    const requiredKeys = roleType === 'verifier'
      ? ['orgName', 'taxCode', 'address', 'legalRep', 'email', 'phone', 'regName', 'regTitle', 'certificate']
      : ['orgName', 'taxCode', 'address', 'legalRep', 'email', 'phone', 'regName'];

    const fieldLabelMap: Record<string, string> = {
      orgName: roleType === 'verifier' ? 'lblOrgName' : 'lblInstName',
      taxCode: 'lblTaxCode',
      address: 'lblAddress',
      legalRep: 'lblLegalRep',
      email: 'lblContactGmail',
      phone: 'lblContactPhone',
      regName: 'lblRegName',
      regTitle: 'lblRegTitle',
      certificate: roleType === 'verifier' ? 'businessLicense' : 'certIssuer',
    };

    requiredKeys.forEach(key => {
      if (key === 'certificate') {
        if (!certificate) missingKeys.push(fieldLabelMap.certificate);
      } else if (!bizData[key as keyof BusinessData].trim()) {
        missingKeys.push(fieldLabelMap[key]);
      }
    });

    if (missingKeys.length > 0) {
      setErrorKey('errorMissingFields');
      setMissingFieldKeys(missingKeys);
      return;
    }

    const fErrors: Record<string, string> = {};
    if (bizData.orgName.length < 3 || bizData.orgName.length > 200) fErrors.orgName = 'fmtTextLength';
    if (!/^\d{10}$/.test(bizData.taxCode)) fErrors.taxCode = 'fmtTaxCode';
    if (!/^[\p{L}\s]+$/u.test(bizData.legalRep)) fErrors.legalRep = 'fmtLettersOnly';
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(bizData.email)) fErrors.email = 'fmtGmail';
    if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(bizData.phone)) fErrors.phone = 'fmtPhone';
    if (!/^[\p{L}\s]+$/u.test(bizData.regName)) fErrors.regName = 'fmtLettersOnly';
    if (certificate) {
      if (certificate.type !== 'application/pdf') {
        fErrors.certificate = 'errorInvalidFormat';
      } else if (certificate.size >= 10 * 1024 * 1024) {
        fErrors.certificate = 'errorFileTooLarge';
      }
    }
    if (Object.keys(fErrors).length > 0) {
      setFieldErrors(fErrors); // giá trị đã là key sẵn, giữ nguyên tên biến cho gọn
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1200);
  };

  const getSubtitle = () => {
    switch(roleType) {
      case 'issuer': return t('subtitleIssuer') || 'Register your institution to start issuing digital credentials.';
      case 'verifier': return t('subtitleVerifier') || 'Register your organization to verify credentials seamlessly.';
      default: return t('subtitleOwner') || 'Join us to securely manage your credentials.';
    }
  };

  return {
    roleType, handleRoleChange,  errorKey, setErrorKey, missingFieldKeys, fieldErrors, isLoading, isSuccess,
    email, setEmail, password, setPassword, confirmPassword, setConfirmPassword,
    showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword,
    bizData, certificate, setCertificate, handleBizChange, handleBizRegister,
    showOtpModal, setShowOtpModal, otpValue, setOtpValue, otpError, setOtpError,
    isOtpLoading, handleOwnerRegister, handleGoogleRegister, handleVerifyOTP, getSubtitle, t, setRole
  };
}