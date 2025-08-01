import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button, Card, Badge, LoadingSpinner, Modal } from './ui';
import { 
  CalendarIcon, 
  LocationIcon, 
  TicketIcon,
  EyeIcon,
  TrashIcon,
  DownloadIcon,
  SearchIcon,
  CheckIcon
} from './ui/Icons';
import { getUserReservations, cancelReservation } from '../services/api';

export default function ReservationList() {
  const location = useLocation();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, reservation: null });
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchReservations();
    
    // Check for success message from navigation state
    if (location.state?.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [location.state]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await getUserReservations();
      
      if (response.success && response.data) {
        // 백엔드 API 응답을 프론트엔드 형태로 변환
        const transformedReservations = response.data.map(reservation => ({
          id: reservation.id,
          concertId: reservation.concert.id,
          concertTitle: reservation.concert.name,
          artist: reservation.concert.venueName, // 아티스트 정보가 없으므로 공연장명 사용
          venue: reservation.concert.venueName,
          address: reservation.concert.addressInfo,
          date: reservation.concert.date,
          seatType: `${reservation.seat.section}석 (${reservation.seat.grade}등급)`,
          seatNumber: reservation.seat.seatNumber,
          quantity: 1, // 개별 좌석 예약이므로 항상 1
          totalPrice: reservation.seat.price,
          status: reservation.status.toLowerCase(), // TEMP_RESERVED, CANCELLED 등을 소문자로 변환
          reservedAt: reservation.createAt,
          reserverEmail: reservation.reserverEmail,
          expiresAt: reservation.expiresAt
        }));
        
        setReservations(transformedReservations);
      } else {
        setReservations([]);
      }
    } catch (err) {
      console.error('예약 목록 조회 실패:', err);
      setError('예약 목록을 불러오는데 실패했습니다.');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservation) => {
    setDeleting(true);
    try {
      await cancelReservation(reservation.id);
      // 예약 상태를 취소됨으로 업데이트 (백엔드에서 상태만 변경하므로)
      setReservations(prev => 
        prev.map(r => 
          r.id === reservation.id 
            ? { ...r, status: 'cancelled' }
            : r
        )
      );
      setDeleteModal({ show: false, reservation: null });
    } catch (err) {
      console.error('예약 취소 실패:', err);
      setError(err.response?.data?.message || '예약 취소에 실패했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'temp_reserved':
        return 'warning';
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'danger';
      case 'past':
        return 'gray';
      default:
        return 'primary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'temp_reserved':
        return '임시 예약';
      case 'confirmed':
        return '예약 확정';
      case 'cancelled':
        return '취소됨';
      case 'past':
        return '공연 완료';
      default:
        return status;
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

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.concertTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.seatNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    const now = new Date();
    const concertDate = new Date(reservation.date);
    
    switch (filter) {
      case 'upcoming':
        return concertDate > now && (reservation.status === 'confirmed' || reservation.status === 'temp_reserved');
      case 'past':
        return concertDate <= now || reservation.status === 'past';
      case 'cancelled':
        return reservation.status === 'cancelled';
      default:
        return true;
    }
  });

  const filterCounts = {
    all: reservations.length,
    upcoming: reservations.filter(r => new Date(r.date) > new Date() && (r.status === 'confirmed' || r.status === 'temp_reserved')).length,
    past: reservations.filter(r => new Date(r.date) <= new Date() || r.status === 'past').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="mb-6"
            >
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 p-4">
                <div className="flex items-center space-x-3">
                  <CheckIcon className="w-6 h-6 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-300">
                      예약 완료!
                    </h3>
                    <p className="text-green-600 dark:text-green-400 text-sm">
                      {location.state?.message || '예약이 성공적으로 완료되었습니다.'}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                내 예약 목록
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                예약한 콘서트를 확인하고 관리하세요
              </p>
            </div>
            <Button
              as={Link}
              to="/concerts"
              variant="primary"
            >
              새 예약하기
            </Button>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="공연명 또는 아티스트명으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl 
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex space-x-2">
                {[
                  { key: 'all', label: '전체', count: filterCounts.all },
                  { key: 'upcoming', label: '예정', count: filterCounts.upcoming },
                  { key: 'past', label: '완료', count: filterCounts.past },
                  { key: 'cancelled', label: '취소', count: filterCounts.cancelled }
                ].map(({ key, label, count }) => (
                  <Button
                    key={key}
                    variant={filter === key ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(key)}
                    className="relative"
                  >
                    {label}
                    {count > 0 && (
                      <Badge 
                        variant={filter === key ? 'white' : 'primary'}
                        className="ml-2"
                      >
                        {count}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </Card>
          </motion.div>
        )}

        {/* Reservations Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {filteredReservations.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <TicketIcon className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                {filter === 'all' ? '예약 내역이 없습니다' : 
                 filter === 'upcoming' ? '예정된 예약이 없습니다' :
                 filter === 'past' ? '완료된 예약이 없습니다' :
                 '취소된 예약이 없습니다'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? '검색 조건을 변경해보세요' : '새로운 콘서트를 예약해보세요!'}
              </p>
              <Button
                as={Link}
                to="/concerts"
                variant="primary"
              >
                콘서트 둘러보기
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredReservations.map((reservation, index) => {
                const { date: formattedDate, time: formattedTime } = formatDate(reservation.date);
                const isUpcoming = new Date(reservation.date) > new Date() && 
                  (reservation.status === 'confirmed' || reservation.status === 'temp_reserved');
                const canCancel = isUpcoming && reservation.status !== 'cancelled';
                

                
                return (
                  <motion.div
                    key={reservation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      {/* Ticket Header */}
                      <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-4 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-lg">
                              {reservation.concertTitle}
                            </h3>
                            <p className="opacity-90">
                              {reservation.artist}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              reservation.status === 'temp_reserved' 
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                : reservation.status === 'confirmed'
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : reservation.status === 'cancelled'
                                ? 'bg-red-100 text-red-800 border border-red-300'
                                : 'bg-gray-100 text-gray-800 border border-gray-300'
                            }`}>
                              {reservation.status === 'temp_reserved' && '⏳ '}
                              {reservation.status === 'confirmed' && '✅ '}
                              {reservation.status === 'cancelled' && '❌ '}
                              {getStatusText(reservation.status)}
                            </div>
                            {reservation.status === 'temp_reserved' && (
                              <div className="text-xs text-yellow-200 mt-1 font-medium">
                                결제 대기중
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Ticket Body */}
                      <div className="p-6">
                        <div className="space-y-4">
                          {/* Date & Venue */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3">
                              <CalendarIcon className="w-5 h-5 text-gray-400" />
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {formattedDate}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {formattedTime}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <LocationIcon className="w-5 h-5 text-gray-400" />
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {reservation.venue}
                                </div>
                                {reservation.address && (
                                  <div className="text-sm text-gray-500">
                                    {reservation.address}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Seat Info */}
                          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm text-gray-500">좌석</div>
                                <div className="font-semibold text-gray-900 dark:text-white">
                                  {reservation.seatType}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  좌석번호: {reservation.seatNumber}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">예약일시</div>
                                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                                  {new Date(reservation.reservedAt).toLocaleDateString('ko-KR')}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(reservation.reservedAt).toLocaleTimeString('ko-KR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">결제 금액</span>
                                <span className="text-xl font-bold text-primary-500">
                                  ₩{formatPrice(reservation.totalPrice)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-4 gap-3">
                            <div className="flex flex-wrap gap-2">
                              <Button
                                as={Link}
                                to={`/concerts/${reservation.concertId}`}
                                variant="outline"
                                size="sm"
                                className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 font-medium"
                              >
                                <EyeIcon className="w-4 h-4 mr-2" />
                                공연 상세보기
                              </Button>
                              
                              {isUpcoming && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400 font-medium"
                                >
                                  <DownloadIcon className="w-4 h-4 mr-2" />
                                  티켓 다운로드
                                </Button>
                              )}
                            </div>

                            {canCancel && (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => setDeleteModal({ show: true, reservation })}
                                className="bg-red-500 hover:bg-red-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                              >
                                <TrashIcon className="w-4 h-4 mr-2" />
                                예약 취소
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Cancel Confirmation Modal */}
        <Modal
          show={deleteModal.show}
          onClose={() => setDeleteModal({ show: false, reservation: null })}
          title="🎫 예약 취소 확인"
        >
          <div className="p-6">
            {/* 예약 정보 요약 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                취소할 예약 정보
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">공연명:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {deleteModal.reservation?.concertTitle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">좌석:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {deleteModal.reservation?.seatNumber} ({deleteModal.reservation?.seatType})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">결제 금액:</span>
                  <span className="font-bold text-primary-500">
                    ₩{deleteModal.reservation?.totalPrice?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 경고 메시지 */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-medium text-red-800 dark:text-red-300 mb-1">
                    주의사항
                  </h5>
                  <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                    <li>• 취소된 예약은 복구할 수 없습니다</li>
                    <li>• 환불 처리는 영업일 기준 3-5일 소요됩니다</li>
                    <li>• 공연 당일 취소는 수수료가 발생할 수 있습니다</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 확인 질문 */}
            <div className="text-center mb-6">
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                정말로 이 예약을 취소하시겠습니까?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            
            {/* 버튼 그룹 */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteModal({ show: false, reservation: null })}
                disabled={deleting}
                className="order-2 sm:order-1 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                취소하지 않기
              </Button>
              <Button
                variant="danger"
                onClick={() => handleCancelReservation(deleteModal.reservation)}
                loading={deleting}
                className="order-1 sm:order-2 bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    처리 중...
                  </>
                ) : (
                  <>
                    <TrashIcon className="w-4 h-4 mr-2" />
                    예약 취소하기
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
