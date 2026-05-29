import request from '@/utils/request'
import { appConfig } from '@/config'
import { mockResolve } from '@/mock'
import { mockUserProfile } from '@/mock/data'

export function loginByWechat(payload) {
  if (appConfig.useMock) {
    return mockResolve({
      token: `mock-token-${Date.now()}`,
      profile: {
        ...mockUserProfile,
        nickName: payload?.nickName || mockUserProfile.nickName,
        avatarUrl: payload?.avatarUrl || mockUserProfile.avatarUrl
      }
    })
  }

  return request.post('/auth/wechat-login', payload)
}

export function fetchUserProfile() {
  if (appConfig.useMock) {
    return mockResolve(mockUserProfile)
  }

  return request.get('/user/profile')
}

