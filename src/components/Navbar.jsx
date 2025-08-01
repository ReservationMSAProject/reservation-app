import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui';
import { 
  MusicNoteIcon, 
  UserIcon, 
  MenuIcon, 
  XIcon, 
  SunIcon, 
  MoonIcon,
  SearchIcon,
  TicketIcon
} from './ui/Icons';
import { logout } from '../services/api';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isLoggedIn, user, handleLogout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogoutClick = async () => {
    try {
      await logout();
    } catch (error) {
      // 에러가 발생해도 로그아웃 처리
      console.log('로그아웃 API 호출 실패:', error);
    }
    handleLogout();
    setShowUserMenu(false);
    navigate('/');
  };

  const navigation = [
    { name: '홈', href: '/', icon: MusicNoteIcon },
    { name: '콘서트', href: '/concerts', icon: TicketIcon },
    ...(isLoggedIn ? [{ name: '내 예약', href: '/reservations', icon: UserIcon }] : []),
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="relative">
                  <MusicNoteIcon className="w-8 h-8 text-primary-500 group-hover:text-primary-400 transition-colors musical-note" />
                  <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-lg group-hover:bg-primary-400/30 transition-all"></div>
                </div>
                <span className="text-xl font-bold gradient-text hidden sm:block">
                  ConcertHub
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative px-3 py-2 rounded-lg transition-all duration-300 group ${
                      isActivePath(item.href)
                        ? 'text-primary-500'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-500'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {isActivePath(item.href) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary-500/10 rounded-lg"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Search Bar */}
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="hidden md:block"
                >
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="콘서트 검색..."
                      className="pl-10 pr-4 py-2 w-64 bg-white/10 dark:bg-gray-800/50 border border-gray-300/30 dark:border-gray-600/30 rounded-lg backdrop-blur-md focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 focus-glow"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              {/* Search toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hidden md:flex p-2 rounded-lg"
              >
                <SearchIcon className="w-5 h-5" />
              </Button>

              {/* Theme toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2 rounded-lg"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isDark ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDark ? 
                    <SunIcon className="w-5 h-5" /> : 
                    <MoonIcon className="w-5 h-5" />
                  }
                </motion.div>
              </Button>

              {/* User menu or auth buttons */}
              {isLoggedIn ? (
                <div className="user-menu relative">
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:block font-medium text-gray-900 dark:text-white">
                      {user?.name || '사용자'}
                    </span>
                  </Button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-64 glass rounded-xl shadow-lg border border-white/20 overflow-hidden"
                      >
                        <div className="p-4 border-b border-white/10">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {user?.name || '사용자'}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {user?.email}
                          </div>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/profile"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <UserIcon className="w-5 h-5" />
                            <span>프로필</span>
                          </Link>
                          <Link
                            to="/reservations"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <TicketIcon className="w-5 h-5" />
                            <span>내 예약</span>
                          </Link>
                          <button
                            onClick={handleLogoutClick}
                            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors"
                          >
                            <XIcon className="w-5 h-5" />
                            <span>로그아웃</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      로그인
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm">
                      회원가입
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? 
                    <XIcon className="w-6 h-6" /> : 
                    <MenuIcon className="w-6 h-6" />
                  }
                </motion.div>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-strong border-t border-white/10"
            >
              <div className="px-4 py-4 space-y-2">
                {/* Mobile search */}
                <div className="relative mb-4">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="콘서트 검색..."
                    className="w-full pl-10 pr-4 py-2 bg-white/10 dark:bg-gray-800/50 border border-gray-300/30 dark:border-gray-600/30 rounded-lg backdrop-blur-md focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 focus-glow"
                  />
                </div>

                {/* Mobile navigation */}
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-300 ${
                        isActivePath(item.href)
                          ? 'bg-primary-500/20 text-primary-500'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}

                {/* Mobile auth buttons */}
                {!isLoggedIn && (
                  <div className="pt-4 space-y-2">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        로그인
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="primary" className="w-full justify-start">
                        회원가입
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}