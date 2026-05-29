import request from '@/utils/request'
import { appConfig } from '@/config'
import { mockResolve } from '@/mock'
import { mockProfileStats } from '@/mock/data'

export function fetchProfileStats() {
  if (appConfig.useMock) {
    return mockResolve(mockProfileStats)
  }

  return request.get('/profile/stats')
}

