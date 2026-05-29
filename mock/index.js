import { appConfig } from '@/config'

function clone(data) {
  return JSON.parse(JSON.stringify(data))
}

export function mockResolve(data, delay = appConfig.mockDelay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(clone(data))
    }, delay)
  })
}

