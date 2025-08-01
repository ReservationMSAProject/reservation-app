import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ConcertCard from './ConcertCard';
import HeroSection from './HeroSection';
import { Button, LoadingSpinner, Input } from './ui';
import { SearchIcon, CalendarIcon, LocationIcon, StarIcon } from './ui/Icons';
import { getAllConcerts } from '../services/api';

export default function ConcertList() {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterBy, setFilterBy] = useState('all');
  const [filteredConcerts, setFilteredConcerts] = useState([]);
  const navigate = useNavigate();

  // 콘서트 제목에서 아티스트 이름 추출
  const extractArtistFromTitle = (title) => {
    if (title.includes('BTS')) return 'BTS';
    if (title.includes('아이유') || title.includes('IU')) return '아이유 (IU)';
    if (title.includes('뉴진스') || title.includes('NewJeans')) return 'NewJeans';
    if (title.includes('블랙핑크') || title.includes('BLACKPINK')) return 'BLACKPINK';
    if (title.includes('장덕철')) return '장덕철';
    if (title.includes('검정치마')) return '검정치마';
    if (title.includes('Coldplay')) return 'Coldplay';
    
    // 기본적으로 첫 번째 단어를 아티스트로 추출
    const words = title.split(' ');
    return words[0] || '미정';
  };

  // 제목을 기반으로 태그 생성
  const generateTagsFromTitle = (title) => {
    const tags = [];
    
    if (title.includes('BTS') || title.includes('아이유') || title.includes('뉴진스') || title.includes('NewJeans')) {
      tags.push('K-POP');
    }
    if (title.includes('월드투어') || title.includes('투어')) {
      tags.push('월드투어');
    }
    if (title.includes('콘서트')) {
      tags.push('라이브');
    }
    if (title.includes('1st') || title.includes('첫')) {
      tags.push('데뷔');
    }
    if (title.includes('골든') || title.includes('스페셜')) {
      tags.push('스페셜');
    }
    
    // 기본 태그가 없으면 '인기' 추가
    if (tags.length === 0) {
      tags.push('인기');
    }
    
    return tags;
  };

  useEffect(() => {
    fetchConcerts();
  }, []);

  useEffect(() => {
    filterAndSortConcerts();
  }, [concerts, searchTerm, sortBy, filterBy]);

  const fetchConcerts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllConcerts();
      
      // 다양한 응답 구조 처리
      let apiData = [];
      
      // 가능한 모든 응답 구조 확인
      if (response?.data?.data && Array.isArray(response.data.data)) {
        apiData = response.data.data;
      } else if (response?.data?.concerts && Array.isArray(response.data.concerts)) {
        apiData = response.data.concerts;
      } else if (response?.data && Array.isArray(response.data)) {
        apiData = response.data;
      } else if (response?.concerts && Array.isArray(response.concerts)) {
        apiData = response.concerts;
      } else if (Array.isArray(response)) {
        apiData = response;
      } else if (response?.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        // 단일 객체인 경우 배열로 변환
        apiData = [response.data];
      } else if (response && typeof response === 'object' && !Array.isArray(response) && response.id) {
        // 응답 자체가 단일 콘서트 객체인 경우
        apiData = [response];
      }
      
      // 백엔드 데이터가 있는 경우 변환
      if (apiData.length > 0) {
        const transformedConcerts = apiData.map((concert, index) => {
          // 날짜 처리
          let formattedDate = "2025-08-01";
          if (concert.date) {
            try {
              const dateObj = new Date(concert.date);
              if (!isNaN(dateObj.getTime())) {
                formattedDate = dateObj.toISOString().split('T')[0];
              }
            } catch (e) {
              console.warn('날짜 파싱 오류:', concert.date, e);
            }
          }
          
          // 가격 처리
          const basePrice = parseInt(concert.price) || 120000;
          
          const transformedConcert = {
            id: concert.id || `temp-${index + 1}`,
            title: concert.name || concert.title || `콘서트 ${index + 1}`,
            artist: extractArtistFromTitle(concert.name || concert.title || ''),
            date: formattedDate,
            venue: typeof concert.venue === 'object' ? 
                   (concert.venue?.name || concert.venue?.location || '미정') : 
                   (concert.venue || "미정"),
            address: typeof concert.venue === 'object' ? 
                     (concert.venue?.address || '') : '',
            price: basePrice,
            originalPrice: Math.floor(basePrice * 1.25),
            status: concert.status || "selling",
            rating: concert.rating || (4.5 + Math.random() * 0.5),
            reviewCount: concert.reviewCount || Math.floor(Math.random() * 500) + 50,
            tags: generateTagsFromTitle(concert.name || concert.title || ''),
            isHot: concert.isHot !== undefined ? concert.isHot : Math.random() > 0.5,
            image: concert.image || "/api/placeholder/400/300",
            description: concert.description || ""
          };
          
          return transformedConcert;
        });
        
        setConcerts(transformedConcerts);
      } else {
        setConcerts([]);
      }
      
    } catch (err) {
      console.error('콘서트 데이터 로딩 오류:', err);
      setError('콘서트 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortConcerts = () => {
    let filtered = concerts.filter(concert => {
      const matchesSearch = concert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          concert.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          concert.venue.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterBy === 'all' || 
                          (filterBy === 'selling' && concert.status === 'selling') ||
                          (filterBy === 'upcoming' && concert.status === 'upcoming') ||
                          (filterBy === 'hot' && concert.isHot);
      
      return matchesSearch && matchesFilter;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredConcerts(filtered);
  };

  const handleReserve = (concert) => {
    navigate(`/concerts/${concert.id}`);
  };

  const handleLike = (concertId, liked) => {
    // Handle like functionality
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
        <HeroSection />
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center min-h-64">
            <LoadingSpinner size="xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
        <HeroSection />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">{error}</div>
            <Button onClick={fetchConcerts}>다시 시도</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      <HeroSection />
      
      {/* Concert List Section */}
      <section className="container mx-auto px-4 py-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🎵 인기 콘서트
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            국내외 최고의 아티스트들과 함께하는 특별한 공연을 만나보세요
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/30 dark:border-gray-700/30 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <motion.div 
                className="md:col-span-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="콘서트, 아티스트, 장소 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                  />
                </div>
              </motion.div>

              {/* Filter */}
              <motion.select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 text-gray-900 dark:text-white"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <option value="all">전체</option>
                <option value="selling">판매중</option>
                <option value="upcoming">예정</option>
                <option value="hot">인기</option>
              </motion.select>

              {/* Sort */}
              <motion.select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 text-gray-900 dark:text-white"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <option value="date">날짜순</option>
                <option value="price-low">가격 낮은순</option>
                <option value="price-high">가격 높은순</option>
                <option value="rating">평점순</option>
                <option value="name">이름순</option>
              </motion.select>
            </div>

            {/* Results Count */}
            <motion.div 
              className="mt-4 text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              총 <span className="font-semibold text-primary-500">{filteredConcerts.length}</span>개의 콘서트
            </motion.div>
          </div>
        </motion.div>

        {/* Concert Grid */}
        <AnimatePresence mode="popLayout">
          {filteredConcerts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredConcerts.map((concert, index) => (
                <motion.div 
                  key={concert.id} 
                  className="w-full"
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.03,
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 overflow-hidden hover:shadow-2xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-500 group">
                    {/* 이미지 영역 */}
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-purple-500/80 via-pink-500/80 to-violet-600/80 backdrop-blur-sm overflow-hidden">
                      {/* 배경 애니메이션 */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-violet-700/20"
                        animate={{
                          background: [
                            "linear-gradient(to bottom right, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2), rgba(124, 58, 237, 0.2))",
                            "linear-gradient(to bottom right, rgba(236, 72, 153, 0.2), rgba(124, 58, 237, 0.2), rgba(168, 85, 247, 0.2))",
                            "linear-gradient(to bottom right, rgba(124, 58, 237, 0.2), rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))"
                          ]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />
                      
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div 
                          className="text-white/90 text-6xl"
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                          }}
                        >
                          🎵
                        </motion.div>
                      </motion.div>
                      
                      {/* 상태 배지 */}
                      <motion.div 
                        className="absolute top-4 left-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        {concert.status === 'selling' && (
                          <motion.span 
                            className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold border border-white/20"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            판매중
                          </motion.span>
                        )}
                        {concert.isHot && (
                          <motion.span 
                            className="bg-orange-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold ml-2 border border-white/20"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            animate={{ 
                              boxShadow: [
                                "0 0 0 0 rgba(249, 115, 22, 0.7)",
                                "0 0 0 10px rgba(249, 115, 22, 0)",
                                "0 0 0 0 rgba(249, 115, 22, 0)"
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            🔥 인기
                          </motion.span>
                        )}
                      </motion.div>
                      
                      {/* 좋아요 버튼 */}
                      <motion.div 
                        className="absolute top-4 right-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <motion.button 
                          className="bg-black/30 hover:bg-black/50 backdrop-blur-sm p-2 rounded-full transition-all border border-white/20"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <motion.span 
                            className="text-white text-xl"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                          >
                            ♡
                          </motion.span>
                        </motion.button>
                      </motion.div>
                    </div>
                    
                    {/* 콘텐츠 영역 */}
                    <motion.div 
                      className="p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      {/* 날짜 */}
                      <motion.div 
                        className="mb-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <motion.span 
                          className="bg-purple-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium border border-white/20"
                          whileHover={{ scale: 1.05 }}
                        >
                          📅 {new Date(concert.date).toLocaleDateString('ko-KR')}
                        </motion.span>
                      </motion.div>
                      
                      {/* 제목 */}
                      <motion.h3 
                        className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        {concert.title}
                      </motion.h3>
                      
                      {/* 아티스트 */}
                      <motion.p 
                        className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        {concert.artist}
                      </motion.p>
                      
                      {/* 장소 */}
                      <motion.p 
                        className="text-gray-600 dark:text-gray-300 mb-4 flex items-center"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <motion.span 
                          className="mr-2"
                          animate={{ 
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                          }}
                        >
                          📍
                        </motion.span>
                        {concert.venue}
                      </motion.p>
                      
                      {/* 평점 */}
                      <motion.div 
                        className="flex items-center mb-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                      >
                        <motion.div 
                          className="flex text-yellow-400"
                          whileHover={{ scale: 1.1 }}
                        >
                          {'★'.repeat(Math.floor(concert.rating))}
                          {'☆'.repeat(5 - Math.floor(concert.rating))}
                        </motion.div>
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                          {concert.rating} ({concert.reviewCount}개 리뷰)
                        </span>
                      </motion.div>
                      
                      {/* 가격 및 예약 버튼 */}
                      <motion.div 
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <div>
                          <motion.div 
                            className="text-2xl font-bold text-gray-900 dark:text-white"
                            whileHover={{ scale: 1.05, color: "#7c3aed" }}
                          >
                            ₩{concert.price.toLocaleString()}
                          </motion.div>
                          {concert.originalPrice && concert.originalPrice > concert.price && (
                            <motion.div 
                              className="text-sm text-gray-500 line-through"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.9 + index * 0.1 }}
                            >
                              ₩{concert.originalPrice.toLocaleString()}
                            </motion.div>
                          )}
                        </div>
                        
                        <motion.button 
                          onClick={() => handleReserve(concert)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20"
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 10px 25px rgba(168, 85, 247, 0.3)"
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          예약하기
                        </motion.button>
                      </motion.div>
                      
                      {/* 태그 */}
                      <motion.div 
                        className="flex flex-wrap gap-2 mt-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 + index * 0.1 }}
                      >
                        {concert.tags?.slice(0, 3).map((tag, tagIndex) => (
                          <motion.span
                            key={tagIndex}
                            className="bg-gray-200/80 dark:bg-gray-600/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-semibold border border-white/20"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.1 + index * 0.1 + tagIndex * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            #{tag}
                          </motion.span>
                        ))}
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 text-6xl mb-4">🎭</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                검색 결과가 없습니다
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                다른 검색어나 필터를 시도해보세요
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More Button (if needed) */}
        {filteredConcerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center mt-12"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-2 border-purple-300 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300"
              >
                더 많은 콘서트 보기
              </Button>
            </motion.div>
          </motion.div>
        )}
      </section>
    </div>
  );
}
