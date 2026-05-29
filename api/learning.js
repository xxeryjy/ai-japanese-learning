import request from '@/utils/request'
import { appConfig } from '@/config'
import { mockResolve } from '@/mock'
import { mockCheckinOverview, mockKanaGroups, mockVocabularyList } from '@/mock/data'

export function fetchKanaGroups() {
  if (appConfig.useMock) {
    return mockResolve(mockKanaGroups)
  }

  return request.get('/learning/kana')
}

export function fetchVocabularyList(params = {}) {
  if (appConfig.useMock) {
    const { level = 'ALL' } = params
    const list = level === 'ALL'
      ? mockVocabularyList
      : mockVocabularyList.filter((item) => item.jlpt === level)

    return mockResolve(list)
  }

  return request.get('/learning/vocabulary', params)
}

export function fetchCheckinOverview() {
  if (appConfig.useMock) {
    return mockResolve(mockCheckinOverview)
  }

  return request.get('/learning/checkin')
}

export function signToday() {
  if (appConfig.useMock) {
    return mockResolve({
      signedToday: true,
      streakDays: mockCheckinOverview.streakDays + 1
    })
  }

  return request.post('/learning/checkin/sign')
}

