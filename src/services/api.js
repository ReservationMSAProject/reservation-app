import axios from 'axios';

// axios 인스턴스 생성
const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true, // 쿠키 포함 (httpOnly 쿠키 자동 전송)
});

// 응답 인터셉터 (에러 처리 등을 위해 유지)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 로그인 API
export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/api/v1/login', {
            email,
            password
        });

        return { success: true, data: response.data };
    } catch (error) {
        throw error;
    }
};

// 사용자 정보 조회 API
export const getUserInfo = async () => {
    try {
        const response = await api.get('/user/api/v1/me');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 로그아웃 API
export const logout = async () => {
    try {
        await api.post('/auth/api/v1/logout');
        clearAccessToken();
        return { success: true };
    } catch (error) {
        throw error;
    }
};

// 회원가입 API
export const register = async (userData) => {
    try {
        const response = await api.post('/auth/api/v1/register', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 이메일 중복 검증 API
export const validateEmail = async (email) => {
    try {
        const response = await api.post('/auth/api/v1/email/valid', { email });
        return { isValid: true, message: response.data };
    } catch (error) {
        return { isValid: false, message: error.response?.data || '이메일 검증 실패' };
    }
};

// 전화번호 중복 검증 API
export const validatePhone = async (phoneNumber) => {
    try {
        const response = await api.post('/auth/api/v1/phone/valid', { phoneNumber });
        return { isValid: true, message: response.data };
    } catch (error) {
        return { isValid: false, message: error.response?.data || '전화번호 검증 실패' };
    }
};

// 예약 생성 API
export const createReservation = async (reservationData) => {
    try {
        const response = await api.post('/reserve/api/reservations/create', reservationData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 예약 취소 API
export const cancelReservation = async (reservationId) => {
    try {
        const response = await api.put(`/reserve/api/reservations/cancel/${reservationId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 예약 단건 조회 API
export const getReservationById = async (reservationId) => {
    try {
        const response = await api.get(`/reserve/api/reservations/check/${reservationId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 내 예약 목록 조회 API
export const getMyReservations = async () => {
    try {
        const response = await api.get('/reserve/api/reservations/mine');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 특정 콘서트/좌석 예약 목록 조회 API (관리자용)
export const getReservationsByConcertAndSeat = async (concertId, seatId) => {
    try {
        const response = await api.get(`/reserve/api/reservations/concert/${concertId}/seat/${seatId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 모든 콘서트 목록 조회 API
export const getAllConcerts = async () => {
    try {
        const response = await api.get('/reserve/api/concerts/all');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 콘서트 상세 정보 및 좌석 조회 API
export const getConcertDetail = async (concertId) => {
    try {
        const response = await api.get(`/reserve/api/concerts/detail/${concertId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 사용자 예약 목록 조회 API (ReservationList에서 사용)
export const getUserReservations = async () => {
    try {
        const response = await api.get('/reserve/api/reservations/mine');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 예약 삭제/취소 API
export const deleteReservation = async (reservationId) => {
    try {
        const response = await api.delete(`/reserve/api/reservations/${reservationId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 사용자 프로필 조회 API
export const getUserProfile = async () => {
    try {
        const response = await api.get('/user/api/v1/profile');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 사용자 프로필 업데이트 API
export const updateUserProfile = async (profileData) => {
    try {
        const response = await api.put('/user/api/v1/profile', profileData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
