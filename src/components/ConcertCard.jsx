import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Badge } from './ui';
import { 
  HeartIcon, 
  CalendarIcon, 
  LocationIcon, 
  StarIcon,
  TicketIcon,
  PlayIcon 
} from './ui/Icons';

export default function ConcertCard({ concert, onReserve, onLike, className = '' }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike?.(concert.id, !isLiked);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleString('ko-KR', { month: 'short' }),
      day: date.getDate(),
      weekday: date.toLocaleString('ko-KR', { weekday: 'short' })
    };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const { month, day, weekday } = formatDate(concert.date);

  return (
    <motion.div
      className={`group ${className}`}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card 
        className="overflow-hidden h-full bg-white dark:bg-gray-800 transition-all duration-500 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-lg hover:shadow-xl"
        hover={false}
      >
        {/* Image Section */}
        <div className="relative overflow-hidden">
          <motion.div
            className="aspect-[4/3] bg-gradient-to-br from-primary-500/20 to-accent-500/20 relative"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.6 }}
          >
            {concert.image ? (
              <>
                <img 
                  src={concert.image} 
                  alt={concert.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-accent-500">
                <TicketIcon className="w-16 h-16 text-white" />
              </div>
            )}

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              {/* Top Row - Status & Like */}
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  {concert.status === 'upcoming' && (
                    <Badge variant="primary" className="bg-blue-500 text-white">
                      예정
                    </Badge>
                  )}
                  {concert.status === 'selling' && (
                    <Badge variant="success" className="bg-green-500 text-white">
                      판매중
                    </Badge>
                  )}
                  {concert.status === 'soldout' && (
                    <Badge variant="danger" className="bg-red-500 text-white">
                      매진
                    </Badge>
                  )}
                  {concert.isHot && (
                    <Badge variant="secondary" className="bg-orange-500 text-white">
                      🔥 인기
                    </Badge>
                  )}
                </div>

                <motion.button
                  onClick={handleLike}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/70 hover:scale-110 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <HeartIcon 
                    className={`w-5 h-5 transition-all duration-300 ${
                      isLiked 
                        ? 'text-red-500 fill-current' 
                        : 'text-white hover:text-red-400'
                    }`}
                    filled={isLiked}
                  />
                </motion.button>
              </div>

              {/* Bottom Row - Play Button (on hover) */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex justify-center"
                  >
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-white/90 text-gray-900 hover:bg-white border-none"
                    >
                      <PlayIcon className="w-4 h-4 mr-2" />
                      미리보기
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Date Badge */}
          <div className="flex items-center mb-4">
            <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center bg-primary-500 text-white rounded-lg px-3 py-2">
                <CalendarIcon className="w-4 h-4 mr-2 text-white" />
                <span className="font-medium text-white">
                  {month} {day}일 ({weekday})
                </span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {concert.title}
          </h3>

          {/* Artist */}
          <p className="text-gray-700 dark:text-gray-200 font-semibold mb-3 text-lg">
            {concert.artist}
          </p>

          {/* Location */}
          <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
            <LocationIcon className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{concert.venue}</span>
          </div>

          {/* Rating */}
          {concert.rating && (
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(concert.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                    filled={i < Math.floor(concert.rating)}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {concert.rating} ({concert.reviewCount || 0}개 리뷰)
                </span>
              </div>
            </div>
          )}

          {/* Price & Reserve Button */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ₩{formatPrice(concert.price)}
              </div>
              {concert.originalPrice && concert.originalPrice > concert.price && (
                <div className="text-sm text-gray-600 dark:text-gray-400 line-through font-medium">
                  ₩{formatPrice(concert.originalPrice)}
                </div>
              )}
            </div>

            <Button
              variant={concert.status === 'soldout' ? 'outline' : 'primary'}
              size="sm"
              disabled={concert.status === 'soldout'}
              onClick={() => onReserve?.(concert)}
              className="ripple"
            >
              {concert.status === 'soldout' ? '매진' : '예약하기'}
            </Button>
          </div>

          {/* Tags */}
          {concert.tags && concert.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {concert.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 text-xs font-semibold bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {concert.tags.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{concert.tags.length - 3}개 더
                </span>
              )}
            </div>
          )}
        </div>

        {/* Hover Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  );
}
