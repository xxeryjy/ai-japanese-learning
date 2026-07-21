import request from '@/utils/request'
import { appConfig } from '@/config'
import { mockResolve } from '@/mock'
import { mockUserProfile } from '@/mock/data'

const DEFAULT_AVATAR = 'https://dummyimage.com/120x120/f7d8c9/ffffff&text=AI'

function normalizeProfile(user = {}) {
  const currentLevel = user.japanese_level || 'JLPT N5'
  const targetLevel = user.target_level || 'JLPT N4'

  return {
    id: user.id || '',
    email: user.email || '',
    username: user.username || '',
    nickName: user.nickname || user.username || user.email || 'Japanese Learner',
    avatarUrl: user.avatar || DEFAULT_AVATAR,
    bio: `Current ${currentLevel}, target ${targetLevel}`,
    level: currentLevel,
    targetLevel
  }
}

function normalizeAuthPayload(payload = {}) {
  return {
    token: payload.token,
    profile: normalizeProfile(payload.user)
  }
}

export function loginByEmail(payload) {
  if (appConfig.useMock) {
    return mockResolve({
      token: `mock-token-${Date.now()}`,
      profile: {
        ...mockUserProfile,
        nickName: payload?.email || mockUserProfile.nickName
      }
    })
  }

  return request.post('/auth/login', payload).then(normalizeAuthPayload)
}

export function sendRegisterCode(payload) {
  console.log('sendRegisterCode', payload)
  if (appConfig.useMock) {
    return mockResolve({
      message: '验证码已发送'
    })
  }

  return request.post('/auth/register/code', payload)
}

export function registerByEmail(payload) {
  if (appConfig.useMock) {
    return mockResolve({
      token: `mock-token-${Date.now()}`,
      profile: {
        ...mockUserProfile,
        nickName: payload?.nickname || payload?.email || mockUserProfile.nickName
      }
    })
  }

  return request.post('/auth/register', payload).then(normalizeAuthPayload)
}

export function fetchUserProfile() {
  if (appConfig.useMock) {
    return mockResolve(mockUserProfile)
  }

  return request.get('/user/me').then((response) => normalizeProfile(response.user))
}
