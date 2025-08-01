import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Input, Card } from './ui';
import { UserIcon, MusicNoteIcon, CheckIcon } from './ui/Icons';
import { register } from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecial: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Password validation
    if (name === 'password') {
      setPasswordValidation({
        minLength: value.length >= 8,
        hasNumber: /\d/.test(value),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      });
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

    if (!passwordValidation.minLength || !passwordValidation.hasNumber || !passwordValidation.hasSpecial) {
      setError('비밀번호 요구사항을 만족하지 않습니다.');
      setLoading(false);
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
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

                <Input
                  type="email"
                  name="email"
                  label="이메일"
                  value={formData.email}
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
                        <div className={`flex items-center text-xs ${passwordValidation.hasNumber ? 'text-green-400' : 'text-gray-400'}`}>
                          <CheckIcon className={`w-3 h-3 mr-1 ${passwordValidation.hasNumber ? 'text-green-400' : 'text-gray-400'}`} />
                          숫자 포함
                        </div>
                        <div className={`flex items-center text-xs ${passwordValidation.hasSpecial ? 'text-green-400' : 'text-gray-400'}`}>
                          <CheckIcon className={`w-3 h-3 mr-1 ${passwordValidation.hasSpecial ? 'text-green-400' : 'text-gray-400'}`} />
                          특수문자 포함
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
                  formData.password !== formData.confirmPassword ||
                  !passwordValidation.minLength ||
                  !passwordValidation.hasNumber ||
                  !passwordValidation.hasSpecial
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
