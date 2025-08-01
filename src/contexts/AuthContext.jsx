import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserInfo } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);

    // 로그인 상태 확인
    const checkAuthStatus = async () => {
        try {
            setIsLoading(true);
            
            // 타임아웃을 설정하여 너무 오래 기다리지 않도록 함
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('인증 확인 타임아웃')), 5000)
            );
            
            const response = await Promise.race([
                getUserInfo(),
                timeoutPromise
            ]);

            if (response && response.success !== false) {
                setIsLoggedIn(true);
                setUser(response.data || response);
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        } catch (error) {
            console.log('인증 상태 확인 실패:', error);
            setIsLoggedIn(false);
            setUser(null);
        } finally {
            setIsLoading(false);
            setAuthChecked(true);
        }
    };

    // 로그인 성공 처리
    const handleLoginSuccess = async (userData = null) => {
        if (userData) {
            // 사용자 데이터가 제공된 경우 즉시 상태 업데이트
            setIsLoggedIn(true);
            setUser(userData);
            setAuthChecked(true);
        } else {
            // 사용자 데이터가 없는 경우 API 호출로 확인
            await checkAuthStatus();
        }
    };

    // 로그아웃 처리
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        setAuthChecked(true);
    };

    // 앱 시작 시 인증 상태 확인
    useEffect(() => {
        // 이미 인증 상태를 확인했다면 다시 확인하지 않음
        if (!authChecked) {
            // 최소 로딩 시간을 보장하여 깜빡임 방지
            const minLoadingTime = new Promise(resolve => setTimeout(resolve, 300));
            
            Promise.all([checkAuthStatus(), minLoadingTime]).then(() => {
                // 두 작업이 모두 완료된 후 로딩 완료
            });
        }
    }, [authChecked]);

    const value = {
        isLoggedIn,
        user,
        isLoading,
        authChecked,
        handleLoginSuccess,
        handleLogout,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};