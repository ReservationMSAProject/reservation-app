import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConcertDetail } from '../services/api';

const ConcertDetail = () => {
  const { concertId: rawConcertId } = useParams();
  const navigate = useNavigate();

  // concertId를 안전하게 파싱
  const concertId = parseInt(rawConcertId) || rawConcertId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [concert, setConcert] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const loadConcert = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getConcertDetail(concertId);

        if (response.success && response.data) {
          setConcert(response.data);
          setSeats(response.data.seats || []);
        } else {
          setError('콘서트 정보를 불러올 수 없습니다.');
        }
      } catch (error) {
        console.error('콘서트 로딩 오류:', error);
        setError(error.response?.data?.message || '콘서트 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (concertId) {
      loadConcert();
    }
  }, [concertId]);

  // 좌석 선택/해제 함수
  const handleSeatSelect = (seat) => {
    if (!seat.available) return; // 예약 불가능한 좌석은 선택 불가

    setSelectedSeats(prev => {
      const isSelected = prev.find(s => s.id === seat.id);
      if (isSelected) {
        // 이미 선택된 좌석이면 해제
        return prev.filter(s => s.id !== seat.id);
      } else {
        // 최대 4개까지만 선택 가능
        if (prev.length >= 4) {
          alert('최대 4개의 좌석까지만 선택할 수 있습니다.');
          return prev;
        }
        // 새로운 좌석 선택
        return [...prev, seat];
      }
    });
  };

  // 선택된 좌석으로 예약하기
  const handleReservationWithSeats = () => {
    if (selectedSeats.length === 0) {
      alert('좌석을 선택해주세요.');
      return;
    }

    // 선택된 좌석 정보를 state로 전달
    navigate(`/reservations/create/${concertId}`, {
      state: {
        selectedSeats: selectedSeats,
        concert: concert
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">콘서트 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || (!loading && !concert)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-xl mb-4">
            {error || '콘서트를 찾을 수 없습니다.'}
          </div>
          <button
            onClick={() => navigate('/concerts')}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            콘서트 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {concert?.name || '콘서트 제목'}
            </h1>
            <div className="text-xl md:text-2xl font-medium mb-6 text-purple-200">
              {concert?.venue?.name || '공연장'}
            </div>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-lg p-3">
                <span className="text-purple-400">📅</span>
                <div>
                  <div className="font-medium">
                    {concert.date ? new Date(concert.date).toLocaleDateString('ko-KR') : '날짜 미정'}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-lg p-3">
                <span className="text-purple-400">📍</span>
                <div>
                  <div className="font-medium">{concert?.venue?.name || '공연장 미정'}</div>
                  <div className="text-sm text-purple-200">{concert?.venue?.address}</div>
                </div>
              </div>
            </div>
            <div className="text-white text-sm bg-white/20 backdrop-blur-md rounded-lg p-3">
              ⬇️ 아래에서 좌석을 선택한 후 예약해주세요
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                공연 소개
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                {concert?.name}에서 펼쳐지는 특별한 공연입니다. {concert?.venue?.name}에서 만나보세요.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    공연 시간
                  </h4>
                  <p className="text-gray-600">
                    약 3시간 (인터미션 포함)
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    관람 연령
                  </h4>
                  <p className="text-gray-600">
                    만 7세 이상 입장 가능
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                좌석 정보
              </h3>

              {/* 좌석 상태 범례 */}
              <div className="flex justify-center gap-3 mb-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                  <span className="text-gray-600">예약 가능</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                  <span className="text-gray-600">선택됨</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                  <span className="text-gray-600">예약 완료</span>
                </div>
              </div>

              {/* 선택된 좌석 정보 */}
              {selectedSeats.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm font-medium text-blue-900 mb-2">
                    선택된 좌석 ({selectedSeats.length}개)
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedSeats.map(seat => (
                      <span key={seat.id} className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                        {seat.seatNumber}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm font-bold text-blue-900 mt-2">
                    총 금액: ₩{selectedSeats.reduce((sum, seat) => sum + seat.price, 0).toLocaleString()}
                  </div>
                </div>
              )}

              {/* 좌석 등급별 그룹화 */}
              {seats.length > 0 ? (
                <div className="space-y-4">
                  {/* 좌석을 등급별로 그룹화 */}
                  {Object.entries(
                    seats.reduce((acc, seat) => {
                      const key = `${seat.grade}-${seat.section}`;
                      if (!acc[key]) {
                        acc[key] = {
                          grade: seat.grade,
                          section: seat.section,
                          price: seat.price,
                          seats: []
                        };
                      }
                      acc[key].seats.push(seat);
                      return acc;
                    }, {})
                  ).map(([key, group]) => (
                    <div key={key} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <div className="font-medium text-gray-900">
                            {group.section}석 ({group.grade}등급)
                          </div>
                          <div className="text-sm text-gray-500">
                            {group.seats.filter(s => s.available).length}석 예약 가능
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            ₩{group.price.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* 좌석 번호 표시 */}
                      <div className="grid grid-cols-5 gap-2">
                        {group.seats.map((seat) => {
                          const isSelected = selectedSeats.find(s => s.id === seat.id);
                          return (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatSelect(seat)}
                              disabled={!seat.available}
                              className={`text-xs p-2 rounded text-center transition-all duration-200 ${!seat.available
                                ? 'bg-red-100 text-red-800 border border-red-300 cursor-not-allowed'
                                : isSelected
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300 shadow-md transform scale-105'
                                  : 'bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 hover:shadow-sm cursor-pointer'
                                }`}
                            >
                              {seat.seatNumber}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4">
                  좌석 정보가 없습니다.
                </div>
              )}

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleReservationWithSeats}
                  disabled={selectedSeats.length === 0}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${selectedSeats.length > 0
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  🎫 선택한 좌석으로 예약하기 ({selectedSeats.length}개)
                </button>
                
                {selectedSeats.length === 0 && (
                  <p className="text-sm text-gray-500 text-center mt-2">
                    예약하려는 좌석을 선택해주세요
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConcertDetail;
