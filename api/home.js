import request from '@/utils/request'
import { appConfig } from '@/config'
import { mockResolve } from '@/mock'
import { mockDashboard } from '@/mock/data'

export function fetchHomeDashboard() {
  if (appConfig.useMock) {
    return mockResolve(mockDashboard)
  }

  return request.get('/home/dashboard')
}

