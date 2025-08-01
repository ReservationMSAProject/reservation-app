import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, Badge, LoadingSpinner, Input } from './ui';
import { 
  UserIcon, 
  EmailIcon,
  PhoneIcon,
  CalendarIcon,
  EditIcon,
  SaveIcon,
  XIcon,
  CheckIcon,
  MusicIcon,
  HeartIcon,
  TicketIcon,
  TrophyIcon
} from './ui/Icons';
import { getUserProfile, updateUserProfile } from '../services/api';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      
      // Mock data if API doesn't return data
      const mockUser = data || {
        id: 1,
        name: "김민수",
        email: "minsu.kim@example.com",
        phone: "010-1234-5678",
        dateOfBirth: "1995-06-15",
        joinedAt: "2024-01-15T09:00:00",
        favoriteGenres: ["K-POP", "Pop", "Rock", "Indie"],
        stats: {
          totalReservations: 12,
          upcomingReservations: 3,
          favoriteArtists: 8,
          totalSpent: 1500000
        },
        recentActivity: [
          {
            type: "reservation",
            title: "IU 콘서트 예약 완료",
            date: "2024-08-20T14:30:00",
            icon: TicketIcon
          },
          {
            type: "favorite",
            title: "NewJeans를 관심 아티스트에 추가",
            date: "2024-08-18T16:20:00",
            icon: HeartIcon
          },
          {
            type: "review",
            title: "BTS 콘서트 리뷰 작성",
            date: "2024-08-15T20:45:00",
            icon: MusicIcon
          }
        ]
      };
      
      setUser(mockUser);
      setEditForm({
        name: mockUser.name,
        email: mockUser.email,
        phone: mockUser.phone,
        dateOfBirth: mockUser.dateOfBirth
      });
    } catch (err) {
      setError('프로필 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setError(null);
    setSuccess(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const updatedUser = await updateUserProfile(editForm);
      setUser({ ...user, ...updatedUser });
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || '프로필 업데이트에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <Button onClick={fetchUserProfile}>다시 시도</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 p-4">
              <div className="flex items-center space-x-3">
                <CheckIcon className="w-6 h-6 text-green-500" />
                <span className="text-green-800 dark:text-green-300 font-medium">
                  프로필이 성공적으로 업데이트되었습니다!
                </span>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            내 프로필
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            개인 정보를 관리하고 음악 활동을 확인하세요
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    개인 정보
                  </h2>
                  {!editing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEdit}
                    >
                      <EditIcon className="w-4 h-4 mr-2" />
                      수정
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        <XIcon className="w-4 h-4 mr-2" />
                        취소
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSave}
                        loading={saving}
                      >
                        <SaveIcon className="w-4 h-4 mr-2" />
                        저장
                      </Button>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                      <UserIcon className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        회원가입: {formatDate(user.joinedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Profile Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        이름
                      </label>
                      {editing ? (
                        <Input
                          value={editForm.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          icon={UserIcon}
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <UserIcon className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">{user.name}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        이메일
                      </label>
                      {editing ? (
                        <Input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          icon={EmailIcon}
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <EmailIcon className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">{user.email}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        전화번호
                      </label>
                      {editing ? (
                        <Input
                          value={editForm.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          icon={PhoneIcon}
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <PhoneIcon className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">{user.phone}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        생년월일
                      </label>
                      {editing ? (
                        <Input
                          type="date"
                          value={editForm.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          icon={CalendarIcon}
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <CalendarIcon className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">
                            {formatDate(user.dateOfBirth)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Music Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  선호 장르
                </h2>
                <div className="flex flex-wrap gap-2">
                  {user.favoriteGenres.map((genre, index) => (
                    <Badge
                      key={index}
                      variant="primary"
                      className="text-sm px-3 py-1"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  최근 활동
                </h2>
                <div className="space-y-4">
                  {user.recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDateTime(activity.date)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar - Stats */}
          <div className="space-y-6">
            {/* User Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  나의 통계
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TicketIcon className="w-5 h-5 text-primary-500" />
                      <span className="text-gray-600 dark:text-gray-300">총 예약</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {user.stats.totalReservations}회
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-5 h-5 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-300">예정 공연</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {user.stats.upcomingReservations}개
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <HeartIcon className="w-5 h-5 text-red-500" />
                      <span className="text-gray-600 dark:text-gray-300">관심 아티스트</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {user.stats.favoriteArtists}명
                    </span>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrophyIcon className="w-5 h-5 text-yellow-500" />
                        <span className="text-gray-600 dark:text-gray-300">총 지출</span>
                      </div>
                      <span className="font-bold text-primary-500">
                        ₩{formatPrice(user.stats.totalSpent)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Achievement Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border-primary-200 dark:border-primary-800">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrophyIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    음악 애호가
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    10회 이상 콘서트를 관람한 진정한 음악 사랑가입니다!
                  </p>
                  <Badge variant="primary">
                    달성 완료
                  </Badge>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
