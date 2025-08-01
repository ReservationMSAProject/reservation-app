import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Input, Card } from './ui';
import { UserIcon, MusicNoteIcon, CheckIcon } from './ui/Icons';
import { register, validateEmail, validatePhone } from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasNumber: false,
    hasLetter: false
  });

  const [phoneValidation, setPhoneValidation] = useState(false);

  // 중복 검사 상태
  const [emailCheck, setEmailCheck] = useState({
    isChecking: false,
    isValid: null,
    message: '',
    isVerified: false // 검증 완료 여부
  });

  const [phoneCheck, setPhoneCheck] = useState({
    isChecking: false,
    isValid: null,
    message: '',
    isVerified: false // 검증 완료 여부
  });

  // 이메일 중복 검사 (수동)
  const handleEmailVerification = async () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setEmailCheck({
        isChecking: false,
        isValid: false,
        message: '올바른 이메일 형식을 입력해주세요.',
        isVerified: false
      });
      return;
    }

    setEmailCheck({ isChecking: true, isValid: null, message: '', isVerified: false });

    try {
      const result = await validateEmail(formData.email);
      setEmailCheck({
        isChecking: false,
        isValid: result.isValid,
        message: result.message,
        isVerified: result.isValid
      });
    } catch (error) {
      setEmailCheck({
        isChecking: false,
        isValid: false,
        message: '이메일 검증 중 오류가 발생했습니다.',
        isVerified: false
      });
    }
  };

  // 전화번호 중복 검사 (수동)
  const handlePhoneVerification = async () => {
    if (!formData.phoneNumber || !/^01[0-9]{8,9}$/.test(formData.phoneNumber)) {
      setPhoneCheck({
        isChecking: false,
        isValid: false,
        message: '올바른 휴대폰 번호를 입력해주세요. (예: 01012345678)',
        isVerified: false
      });
      return;
    }

    setPhoneCheck({ isChecking: true, isValid: null, message: '', isVerified: false });

    try {
      const result = await validatePhone(formData.phoneNumber);
      setPhoneCheck({
        isChecking: false,
        isValid: result.isValid,
        message: result.message,
        isVerified: result.isValid
      });
    } catch (error) {
      setPhoneCheck({
        isChecking: false,
        isValid: false,
        message: '전화번호 검증 중 오류가 발생했습니다.',
        isVerified: false
      });
    }
  };

  // 검증된 값 변경 시 검증 상태 초기화
  const resetEmailVerification = () => {
    setEmailCheck({ isChecking: false, isValid: null, message: '', isVerified: false });
  };

  const resetPhoneVerification = () => {
    setPhoneCheck({ isChecking: false, isValid: null, message: '', isVerified: false });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Password validation (백엔드 규칙: 영문자와 숫자 포함, 8자 이상)
    if (name === 'password') {
      setPasswordValidation({
        minLength: value.length >= 8,
        hasNumber: /\d/.test(value),
        hasLetter: /[A-Za-z]/.test(value)
      });
    }

    // Phone number validation (한국 휴대폰 번호: 01012345678 형식)
    if (name === 'phoneNumber') {
      setPhoneValidation(/^01[0-9]{8,9}$/.test(value));
      // 전화번호 변경 시 검증 상태 초기화 (검증 완료된 경우에만)
      if (phoneCheck.isVerified) {
        resetPhoneVerification();
      }
    }

    // 이메일 변경 시 검증 상태 초기화 (검증 완료된 경우에만)
    if (name === 'email' && emailCheck.isVerified) {
      resetEmailVerification();
    }

    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setLoading(false);
      return;
    }

    if (!passwordValidation.minLength || !passwordValidation.hasNumber || !passwordValidation.hasLetter) {
      setError('비밀번호는 영문자와 숫자를 포함하여 8자 이상이어야 합니다.');
      setLoading(false);
      return;
    }

    if (!phoneValidation) {
      setError('올바른 휴대폰 번호를 입력해주세요. (예: 01012345678)');
      setLoading(false);
      return;
    }

    if (formData.name.length < 2 || formData.name.length > 50) {
      setError('이름은 2~50자 사이여야 합니다.');
      setLoading(false);
      return;
    }

    if (!formData.address.trim()) {
      setError('주소를 입력해주세요.');
      setLoading(false);
      return;
    }

    // 중복 검사 결과 확인
    if (!emailCheck.isVerified || emailCheck.isValid !== true) {
      setError('이메일 중복 검사를 완료해주세요.');
      setLoading(false);
      return;
    }

    if (!phoneCheck.isVerified || phoneCheck.isValid !== true) {
      setError('전화번호 중복 검사를 완료해주세요.');
      setLoading(false);
      return;
    }

    try {
      // 백엔드 DTO에 맞는 데이터 구조로 전송
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        address: formData.address
      };

      await register(userData);
      // Show success message and redirect to login
      navigate('/login', {
        state: {
          message: '회원가입이 완료되었습니다. 로그인해주세요.'
        }
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해주세요.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-dark-950 dark:via-purple-950 dark:to-dark-950 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 4) * 25}%`,
            }}
            animate={{
              y: [-30, -50, -30],
              rotate: [0, 360],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 10 + i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            <MusicNoteIcon className="w-10 h-10 text-white" />
          </motion.div>
        ))}
      </div>

      <div className="relative w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card glass className="backdrop-blur-xl border-white/20 shadow-2xl p-8">
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl mb-4"
              >
                <MusicNoteIcon className="w-8 h-8 text-white" />
              </motion.div>

              <h1 className="text-3xl font-bold text-white mb-2">
                ConcertHub 가입
              </h1>
              <p className="text-gray-300">
                특별한 음악 여행을 시작하세요
              </p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-md"
                >
                  <p className="text-red-200 text-sm text-center">{error}</p>
                </motion.div>
              )}

              <div className="space-y-4">
                <Input
                  type="text"
                  name="name"
                  label="이름"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="text-white placeholder-gray-400"
                />

                <div>
                  <div className="flex space-x-2">
                    <Input
                      type="email"
                      name="email"
                      label="이메일"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={emailCheck.isVerified}
                      className={`text-white placeholder-gray-400 flex-1 ${emailCheck.isVerified ? 'bg-gray-600 cursor-not-allowed' : ''
                        }`}
                    />
                    <Button
                      type="button"
                      variant={emailCheck.isVerified ? "success" : "outline"}
                      size="md"
                      onClick={emailCheck.isVerified ? resetEmailVerification : handleEmailVerification}
                      disabled={!formData.email || emailCheck.isChecking}
                      className="mt-6 px-4 whitespace-nowrap"
                    >
                      {emailCheck.isChecking ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : emailCheck.isVerified ? (
                        "변경"
                      ) : (
                        "중복확인"
                      )}
                    </Button>
                  </div>

                  {/* 이메일 검증 피드백 */}
                  {(emailCheck.message || emailCheck.isChecking) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center space-x-2"
                    >
                      {emailCheck.isChecking ? (
                        <>
                          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-blue-400">이메일 확인 중...</span>
                        </>
                      ) : emailCheck.isValid === true ? (
                        <>
                          <CheckIcon className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-green-400">{emailCheck.message}</span>
                        </>
                      ) : emailCheck.isValid === false ? (
                        <>
                          <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-red-400">{emailCheck.message}</span>
                        </>
                      ) : null}
                    </motion.div>
                  )}
                </div>

                <div>
                  <div className="flex space-x-2">
                    <Input
                      type="tel"
                      name="phoneNumber"
                      label="휴대폰 번호"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      placeholder="01012345678"
                      disabled={phoneCheck.isVerified}
                      className={`text-white placeholder-gray-400 flex-1 ${phoneCheck.isVerified ? 'bg-gray-600 cursor-not-allowed' : ''
                        }`}
                    />
                    <Button
                      type="button"
                      variant={phoneCheck.isVerified ? "success" : "outline"}
                      size="md"
                      onClick={phoneCheck.isVerified ? resetPhoneVerification : handlePhoneVerification}
                      disabled={!formData.phoneNumber || !phoneValidation || phoneCheck.isChecking}
                      className="mt-6 px-4 whitespace-nowrap"
                    >
                      {phoneCheck.isChecking ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : phoneCheck.isVerified ? (
                        "변경"
                      ) : (
                        "중복확인"
                      )}
                    </Button>
                  </div>

                  {/* 전화번호 형식 및 검증 피드백 */}
                  {formData.phoneNumber && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2"
                    >
                      {!phoneValidation ? (
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-red-400">
                            올바른 휴대폰 번호를 입력해주세요. (예: 01012345678)
                          </span>
                        </div>
                      ) : phoneCheck.isChecking ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-blue-400">전화번호 확인 중...</span>
                        </div>
                      ) : phoneCheck.isValid === true ? (
                        <div className="flex items-center space-x-2">
                          <CheckIcon className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-green-400">{phoneCheck.message}</span>
                        </div>
                      ) : phoneCheck.isValid === false ? (
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-red-400">{phoneCheck.message}</span>
                        </div>
                      ) : null}
                    </motion.div>
                  )}
                </div>

                <Input
                  type="text"
                  name="address"
                  label="주소"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="text-white placeholder-gray-400"
                />

                <div>
                  <Input
                    type="password"
                    name="password"
                    label="비밀번호"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="text-white placeholder-gray-400"
                  />

                  {/* Password Requirements */}
                  {formData.password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 p-3 bg-white/5 border border-white/10 rounded-lg"
                    >
                      <p className="text-gray-300 text-xs mb-2">비밀번호 요구사항:</p>
                      <div className="space-y-1">
                        <div className={`flex items-center text-xs ${passwordValidation.minLength ? 'text-green-400' : 'text-gray-400'}`}>
                          <CheckIcon className={`w-3 h-3 mr-1 ${passwordValidation.minLength ? 'text-green-400' : 'text-gray-400'}`} />
                          최소 8자 이상
                        </div>
                        <div className={`flex items-center text-xs ${passwordValidation.hasLetter ? 'text-green-400' : 'text-gray-400'}`}>
                          <CheckIcon className={`w-3 h-3 mr-1 ${passwordValidation.hasLetter ? 'text-green-400' : 'text-gray-400'}`} />
                          영문자 포함
                        </div>
                        <div className={`flex items-center text-xs ${passwordValidation.hasNumber ? 'text-green-400' : 'text-gray-400'}`}>
                          <CheckIcon className={`w-3 h-3 mr-1 ${passwordValidation.hasNumber ? 'text-green-400' : 'text-gray-400'}`} />
                          숫자 포함
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <Input
                  type="password"
                  name="confirmPassword"
                  label="비밀번호 확인"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="text-white placeholder-gray-400"
                  error={formData.confirmPassword && formData.password !== formData.confirmPassword ? '비밀번호가 일치하지 않습니다.' : ''}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
                disabled={
                  !formData.name ||
                  !formData.email ||
                  !formData.password ||
                  !formData.confirmPassword ||
                  !formData.phoneNumber ||
                  !formData.address ||
                  formData.password !== formData.confirmPassword ||
                  !passwordValidation.minLength ||
                  !passwordValidation.hasNumber ||
                  !passwordValidation.hasLetter ||
                  !phoneValidation ||
                  formData.name.length < 2 ||
                  formData.name.length > 50 ||
                  !emailCheck.isVerified ||
                  emailCheck.isValid !== true ||
                  !phoneCheck.isVerified ||
                  phoneCheck.isValid !== true
                }
              >
                <UserIcon className="w-5 h-5 mr-2" />
                회원가입
              </Button>
            </form>

            {/* Terms and Conditions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl"
            >
              <p className="text-gray-400 text-xs text-center">
                회원가입을 진행하면{' '}
                <Link to="/terms" className="text-primary-400 hover:text-primary-300">
                  이용약관
                </Link>
                {' '}및{' '}
                <Link to="/privacy" className="text-primary-400 hover:text-primary-300">
                  개인정보처리방침
                </Link>
                에 동의하는 것으로 간주됩니다.
              </p>
            </motion.div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                이미 계정이 있으신가요?{' '}
                <Link
                  to="/login"
                  className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                >
                  로그인
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
