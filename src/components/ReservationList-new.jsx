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
  FilterIcon,
  SearchIcon,
  CheckIcon
} from './ui/Icons';
import { getUserReservations, deleteReservation } from '../services/api';

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
      const data = await getUserReservations();
      
      // Mock data if API doesn't return data
      const mockReservations = data.length > 0 ? data : [
        {
          id: 1,
          concertId: 1,
          concertTitle: "IU 2024 콘서트 'HEREH WORLD TOUR'",
          artist: "아이유 (IU)",
          venue: "잠실 종합운동장 주경기장",
          date: "2024-09-15T19:00:00",
          seatType: "VIP석",
          quantity: 2,
          totalPrice: 360000,
          status: "confirmed",
          reservedAt: "2024-08-15T10:30:00",
          qrCode: "QR12345678"
        },
        {
          id: 2,
          concertId: 2,
          concertTitle: "BTS World Tour",
          artist: "BTS",
          venue: "서울 월드컵경기장",
          date: "2024-08-20T19:30:00",
          seatType: "R석",
          quantity: 1,
          totalPrice: 150000,
          status: "past",
          reservedAt: "2024-07-10T14:20:00",
          qrCode: "QR87654321"
        },
        {
          id: 3,
          concertId: 3,
          concertTitle: "NewJeans Super Shy Tour",
          artist: "NewJeans",
          venue: "고척 스카이돔",
          date: "2024-10-12T18:00:00",
          seatType: "S석",
          quantity: 3,
          totalPrice: 390000,
          status: "confirmed",
          reservedAt: "2024-08-20T16:45:00",
          qrCode: "QR11223344"
        }
      ];
      
      setReservations(mockReservations);
    } catch (err) {
      setError('예약 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReservation = async (reservation) => {
    setDeleting(true);
    try {
      await deleteReservation(reservation.id);
      setReservations(prev => prev.filter(r => r.id !== reservation.id));
      setDeleteModal({ show: false, reservation: null });
    } catch (err) {
      setError('예약 취소에 실패했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
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
                         reservation.artist.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    const now = new Date();
    const concertDate = new Date(reservation.date);
    
    switch (filter) {
      case 'upcoming':
        return concertDate > now && reservation.status === 'confirmed';
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
    upcoming: reservations.filter(r => new Date(r.date) > new Date() && r.status === 'confirmed').length,
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
                const isUpcoming = new Date(reservation.date) > new Date() && reservation.status === 'confirmed';
                
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
                          <Badge variant={getStatusColor(reservation.status)}>
                            {getStatusText(reservation.status)}
                          </Badge>
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
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">수량</div>
                                <div className="font-semibold text-gray-900 dark:text-white">
                                  {reservation.quantity}매
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">총 결제 금액</span>
                                <span className="text-xl font-bold text-primary-500">
                                  ₩{formatPrice(reservation.totalPrice)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex justify-between items-center pt-4">
                            <div className="flex space-x-2">
                              <Button
                                as={Link}
                                to={`/concerts/${reservation.concertId}`}
                                variant="outline"
                                size="sm"
                              >
                                <EyeIcon className="w-4 h-4 mr-2" />
                                상세보기
                              </Button>
                              
                              {isUpcoming && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                >
                                  <DownloadIcon className="w-4 h-4 mr-2" />
                                  티켓 다운로드
                                </Button>
                              )}
                            </div>

                            {isUpcoming && (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => setDeleteModal({ show: true, reservation })}
                              >
                                <TrashIcon className="w-4 h-4 mr-2" />
                                취소
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

        {/* Delete Confirmation Modal */}
        <Modal
          show={deleteModal.show}
          onClose={() => setDeleteModal({ show: false, reservation: null })}
          title="예약 취소"
        >
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              <strong>{deleteModal.reservation?.concertTitle}</strong> 예약을 정말 취소하시겠습니까?
              <br />
              <span className="text-sm text-red-500">취소된 예약은 복구할 수 없습니다.</span>
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setDeleteModal({ show: false, reservation: null })}
                disabled={deleting}
              >
                돌아가기
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteReservation(deleteModal.reservation)}
                loading={deleting}
              >
                예약 취소
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
