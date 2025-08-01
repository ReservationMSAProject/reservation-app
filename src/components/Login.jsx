import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Input, Card } from './ui';
import { UserIcon, MusicNoteIcon } from './ui/Icons';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleLoginSuccess } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // OAuth2 로그인 결과 처리
  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'true') {
      setError('Google 로그인에 실패했습니다.');
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(formData.email, formData.password);
      await handleLoginSuccess();
      navigate('/concerts');
    } catch (err) {
      const errorMessage = err.response?.data?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/oauth2/authorization/google`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-dark-950 dark:via-purple-950 dark:to-dark-950 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10"
            style={{
              left: `${20 + i * 15}%`,
              top: `${20 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [-20, -40, -20],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <MusicNoteIcon className="w-12 h-12 text-white" />
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
                ConcertHub
              </h1>
              <p className="text-gray-300">
                음악과 함께하는 특별한 순간
              </p>
            </div>

            {/* Login Form */}
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
                  type="email"
                  name="email"
                  label="이메일"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="text-white placeholder-gray-400"
                />

                <Input
                  type="password"
                  name="password"
                  label="비밀번호"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="text-white placeholder-gray-400"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
              >
                <UserIcon className="w-5 h-5 mr-2" />
                로그인
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-white/20"></div>
              <span className="px-4 text-gray-400 text-sm">또는</span>
              <div className="flex-1 border-t border-white/20"></div>
            </div>

            {/* Google Login */}
            <Button
              onClick={handleGoogleLogin}
              variant="glass"
              size="lg"
              className="w-full border-white/20 hover:border-white/40 text-white"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google로 로그인
            </Button>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                계정이 없으신가요?{' '}
                <Link 
                  to="/register" 
                  className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                >
                  회원가입
                </Link>
              </p>
            </div>

            {/* Demo Account Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl"
            >
              <p className="text-gray-400 text-xs text-center mb-2">데모 계정</p>
              <div className="text-center space-y-1">
                <p className="text-gray-300 text-xs">
                  이메일: demo@concerthub.com
                </p>
                <p className="text-gray-300 text-xs">
                  비밀번호: demo123
                </p>
              </div>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
