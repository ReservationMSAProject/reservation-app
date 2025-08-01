import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoadingSpinner } from './components/ui';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import ReservationList from './components/ReservationList';
import ReservationCreate from './components/ReservationCreate';
import ConcertList from './components/ConcertList';
import ConcertDetail from './components/ConcertDetail';
import Home from './components/Home';
import Navbar from './components/Navbar';
import './App.css';

function AppContent() {
  const { isLoggedIn, isLoading, handleLoginSuccess, handleLogout } = useAuth();

  // 인증 상태 확인 중일 때 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" className="mx-auto mb-4" />
          <div className="text-white text-xl font-medium">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 transition-colors duration-300">
      <Navbar />

      <main className="relative">
        <AnimatePresence mode="wait">
          <Routes>
                <Route
                  path="/login"
                  element={
                    isLoggedIn ? (
                      <Navigate to="/" replace />
                    ) : (
                      <motion.div
                        key="login"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Login />
                      </motion.div>
                    )
                  }
                />
                <Route
                  path="/register"
                  element={
                    isLoggedIn ? (
                      <Navigate to="/" replace />
                    ) : (
                      <motion.div
                        key="register"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Register />
                      </motion.div>
                    )
                  }
                />
                <Route
                  path="/profile"
                  element={
                    isLoggedIn ? (
                      <motion.div
                        key="profile"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <UserProfile onLogout={handleLogout} />
                      </motion.div>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route
                  path="/reservations"
                  element={
                    isLoggedIn ? (
                      <motion.div
                        key="reservations"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ReservationList />
                      </motion.div>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route
                  path="/reservations/create/:concertId"
                  element={
                    isLoggedIn ? (
                      <motion.div
                        key="reservation-create"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ReservationCreate />
                      </motion.div>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route
                  path="/"
                  element={
                    <motion.div
                      key="home"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Home />
                    </motion.div>
                  }
                />
                <Route
                  path="/concerts"
                  element={
                    <motion.div
                      key="concerts"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ConcertList />
                    </motion.div>
                  }
                />
                <Route
                  path="/concerts/:concertId"
                  element={
                    <motion.div
                      key="concert-detail"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ConcertDetail />
                    </motion.div>
                  }
                />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;