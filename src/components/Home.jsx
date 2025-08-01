import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui';
import { MusicIcon, StarIcon, CalendarIcon, LocationIcon } from './ui/Icons';

export default function Home() {
  const navigate = useNavigate();

  const featuredStats = [
    { icon: MusicIcon, value: '1,000+', label: '진행된 콘서트' },
    { icon: StarIcon, value: '50,000+', label: '만족한 고객' },
    { icon: CalendarIcon, value: '365일', label: '연중무휴 서비스' },
    { icon: LocationIcon, value: '100+', label: '전국 공연장' }
  ];

  const upcomingConcerts = [
    {
      id: 1,
      title: "IU 2024 콘서트 'HEREH WORLD TOUR'",
      artist: "아이유 (IU)",
      date: "2024-09-15",
      venue: "잠실 종합운동장",
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "BTS 'Yet To Come' in Seoul",
      artist: "BTS",
      date: "2024-10-08",
      venue: "서울월드컵경기장",
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      title: "NewJeans Get Up Concert",
      artist: "NewJeans",
      date: "2024-11-20",
      venue: "KSPO DOME",
      image: "/api/placeholder/300/200"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 dark:from-primary-700 dark:via-primary-800 dark:to-accent-700" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="block">음악과 함께하는</span>
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                특별한 순간
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              전 세계 최고의 아티스트들과 함께하는 잊을 수 없는 공연을 경험하세요
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="px-8 py-4 text-lg font-semibold bg-white text-primary-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
              onClick={() => navigate('/concerts')}
            >
              🎵 콘서트 둘러보기
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold border-white text-white hover:bg-white hover:text-primary-600 transform hover:scale-105 transition-all duration-300"
              onClick={() => navigate('/login')}
            >
              지금 시작하기
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-dark-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              신뢰할 수 있는 플랫폼
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              수많은 고객들이 선택한 콘서트 예약 서비스
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {featuredStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900 dark:to-accent-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Concerts */}
      <section className="py-20 bg-gray-50 dark:bg-dark-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🔥 HOT 콘서트
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              지금 가장 인기 있는 공연들을 만나보세요
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {upcomingConcerts.map((concert, index) => (
              <motion.div
                key={concert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                onClick={() => navigate(`/concerts/${concert.id}`)}
              >
                <div className="aspect-video bg-gradient-to-br from-primary-400 to-accent-400 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <MusicIcon className="w-12 h-12 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {concert.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {concert.artist}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{concert.date}</span>
                  <span>{concert.venue}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button
              size="lg"
              className="px-8 py-3"
              onClick={() => navigate('/concerts')}
            >
              모든 콘서트 보기
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-700 dark:to-accent-700">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              지금 바로 시작하세요!
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              원하는 콘서트를 쉽고 빠르게 예약하고, 특별한 경험을 만들어보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="px-8 py-4 text-lg font-semibold bg-white text-primary-600 hover:bg-gray-100"
                onClick={() => navigate('/register')}
              >
                회원가입하기
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold border-white text-white hover:bg-white hover:text-primary-600"
                onClick={() => navigate('/concerts')}
              >
                콘서트 둘러보기
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
