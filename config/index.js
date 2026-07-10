export const appConfig = Object.freeze({
  appName: 'AI日语学习',
  baseURL: 'https://example.com/api',
  requestTimeout: 15000,
  useMock: true,
  mockDelay: 260,
  useSocketChat: true,
  chatSocketURL: 'ws://127.0.0.1:8000/ws/chat',
  chatStreamIdleMs: 800,
  chatSocketDebug: true
})
