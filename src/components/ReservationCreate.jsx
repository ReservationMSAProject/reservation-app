import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Badge, LoadingSpinner } from './ui';
import { 
  CalendarIcon, 
  LocationIcon, 
  TicketIcon,
  UserIcon,
  CheckIcon,
  ArrowRightIcon,
  XIcon
} from './ui/Icons';
import { getConcertDetail, createReservation } from '../services/api';

export default function ReservationCreate() {
  const { concertId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [concert, setConcert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservationData, setReservationData] = useState({
    seatType: '',
    quantity: 1,
    totalPrice: 0
  });

  // 좌석 선택 모드인지 확인
  const isPreSelectedSeats = location.state?.selectedSeats && location.state?.selectedSeats.length > 0;
  
  // 개별 좌석 선택이 아닌 경우 콘서트 상세 페이지로 리다이렉트
  useEffect(() => {
    if (!isPreSelectedSeats && !loading) {
      navigate(`/concerts/${concertId}`, {
        state: { message: '좌석을 선택한 후 예약해주세요.' }
      });
    }
  }, [isPreSelectedSeats, loading, navigate, concertId]);

  const steps = [
    { id: 1, title: '예약 정보', icon: UserIcon },
    { id: 2, title: '결제', icon: CheckIcon }
  ];

  useEffect(() => {
    fetchConcertDetail();
    
    // 미리 선택된 좌석이 있다면 설정
    if (isPreSelectedSeats) {
      const preSelectedSeats = location.state.selectedSeats;
      setSelectedSeats(preSelectedSeats);
      
      // 예약 데이터 초기화
      const totalPrice = preSelectedSeats.reduce((sum, seat) => sum + seat.price, 0);
      setReservationData({
        seatType: 'SELECTED_SEATS', // 개별 좌석 선택 모드
        quantity: preSelectedSeats.length,
        totalPrice: totalPrice
      });
      
      // 좌석이 미리 선택되었으므로 1단계(예약 정보)로 시작
      setCurrentStep(1);
    }
  }, [concertId, isPreSelectedSeats]);

  const fetchConcertDetail = async () => {
    try {
      setLoading(true);
      
      // 미리 선택된 콘서트 정보가 있다면 사용
      if (location.state?.concert) {
        setConcert(location.state.concert);
        setLoading(false);
        return;
      }
      
      const response = await getConcertDetail(concertId);
      
      if (response.success && response.data) {
        setConcert(response.data);
      } else {
        // Mock data if API doesn't return data
        const mockConcert = {
          id: concertId,
          name: "IU 2024 콘서트 'HEREH WORLD TOUR'",
          artist: "아이유 (IU)",
          date: "2024-09-15T19:00:00",
          venue: {
            name: "잠실 종합운동장 주경기장",
            address: "서울특별시 송파구 올림픽로 25"
          },
          seatTypes: [
            { type: "VIP석", price: 180000, available: 50, description: "최전방 프리미엄 좌석" },
            { type: "R석", price: 150000, available: 120, description: "1층 일반석" },
            { type: "S석", price: 130000, available: 200, description: "2층 일반석" },
            { type: "A석", price: 100000, available: 300, description: "3층 일반석" }
          ]
        };
        setConcert(mockConcert);
      }
    } catch (err) {
      setError('콘서트 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelection = (seatType, price) => {
    setReservationData({
      ...reservationData,
      seatType,
      totalPrice: price * reservationData.quantity
    });
  };

  const handleQuantityChange = (quantity) => {
    const seatPrice = concert.seatTypes.find(s => s.type === reservationData.seatType)?.price || 0;
    setReservationData({
      ...reservationData,
      quantity,
      totalPrice: seatPrice * quantity
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      if (isPreSelectedSeats) {
        // 개별 좌석 선택 모드 - 각 좌석에 대해 개별 예약 생성
        const reservationPromises = selectedSeats.map(seat => 
          createReservation({
            seatId: seat.id,
            concertId: parseInt(concertId)
          })
        );
        
        // 모든 예약을 병렬로 처리
        await Promise.all(reservationPromises);
        
        navigate('/reservations', {
          state: { 
            success: true,
            message: `${selectedSeats.length}개 좌석 예약이 성공적으로 완료되었습니다!` 
          }
        });
      } else {
        // 기존 좌석 타입 선택 모드는 지원하지 않음 (백엔드 API 형태에 맞지 않음)
        setError('좌석을 개별적으로 선택해주세요.');
      }
    } catch (err) {
      setError(err.response?.data?.message || '예약 생성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      }),
      time: date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error && !concert) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <Button onClick={fetchConcertDetail}>다시 시도</Button>
        </div>
      </div>
    );
  }

  const { date: formattedDate, time: formattedTime } = formatDate(concert.date);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            예약하기
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {concert.name || concert.title} - {concert.artist || concert.venue?.name}
          </p>
          {isPreSelectedSeats && (
            <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
              {selectedSeats.length}개 좌석이 미리 선택되었습니다
            </div>
          )}
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                      ${isActive ? 'bg-primary-500 text-white scale-110' : 
                        isCompleted ? 'bg-green-500 text-white' : 
                        'bg-gray-200 dark:bg-gray-700 text-gray-500'}
                    `}>
                      {isCompleted ? (
                        <CheckIcon className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="ml-3">
                      <div className={`text-sm font-medium ${
                        isActive ? 'text-primary-500' : 
                        isCompleted ? 'text-green-500' : 
                        'text-gray-500'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-4 transition-colors duration-300 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: 예약 정보 */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className="p-6">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                      예약 정보
                    </h3>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          수량 선택
                        </label>
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(Math.max(1, reservationData.quantity - 1))}
                            disabled={reservationData.quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="text-xl font-bold text-gray-900 dark:text-white w-12 text-center">
                            {reservationData.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(Math.min(4, reservationData.quantity + 1))}
                            disabled={reservationData.quantity >= 4}
                          >
                            +
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          최대 4매까지 구매 가능합니다.
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          선택한 좌석
                        </h4>
                        {isPreSelectedSeats ? (
                          <div className="space-y-2">
                            <div className="text-gray-600 dark:text-gray-300">
                              개별 선택 좌석 {selectedSeats.length}개
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {selectedSeats.map(seat => (
                                <span key={seat.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                  {seat.seatNumber}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-600 dark:text-gray-300">
                            {reservationData.seatType} x {reservationData.quantity}매
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button
                        variant="primary"
                        onClick={() => setCurrentStep(2)}
                      >
                        다음 단계
                        <ArrowRightIcon className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: 결제 */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className="p-6">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                      결제 확인
                    </h3>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl"
                      >
                        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                      </motion.div>
                    )}

                    <div className="space-y-4 mb-6">
                      {isPreSelectedSeats ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">선택 방식</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              개별 좌석 선택
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">선택된 좌석</span>
                            <div className="text-right">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {selectedSeats.length}개
                              </div>
                              <div className="text-sm text-gray-500">
                                {selectedSeats.map(seat => seat.seatNumber).join(', ')}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">좌석 종류</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {reservationData.seatType}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">수량</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {reservationData.quantity}매
                            </span>
                          </div>
                        </>
                      )}
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                        <div className="flex justify-between text-xl font-bold">
                          <span className="text-gray-900 dark:text-white">총 결제 금액</span>
                          <span className="text-primary-500">
                            ₩{formatPrice(reservationData.totalPrice)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                        ⚠️ 예약 안내사항
                      </h4>
                      <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                        <li>• 예약 완료 후 취소/변경이 불가능합니다.</li>
                        <li>• 공연 당일 신분증을 지참해주세요.</li>
                        <li>• 공연 시작 후 입장이 제한될 수 있습니다.</li>
                      </ul>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        disabled={submitting}
                      >
                        이전 단계
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleSubmit}
                        loading={submitting}
                        size="lg"
                      >
                        <CheckIcon className="w-5 h-5 mr-2" />
                        예약 완료
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar - Concert Info */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                공연 정보
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {concert.name || concert.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {concert.artist || concert.venue?.name}
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{formattedDate} {formattedTime}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <LocationIcon className="w-4 h-4" />
                  <span>{concert.venue?.name || concert.venue}</span>
                </div>

                {(reservationData.seatType || isPreSelectedSeats) && (
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      선택한 좌석
                    </h4>
                    <div className="space-y-2">
                      {isPreSelectedSeats ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">
                              개별 선택
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {selectedSeats.length}매
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {selectedSeats.map(seat => seat.seatNumber).join(', ')}
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">
                            {reservationData.seatType}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {reservationData.quantity}매
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold">
                        <span className="text-gray-900 dark:text-white">총액</span>
                        <span className="text-primary-500">
                          ₩{formatPrice(reservationData.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
