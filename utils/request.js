import axios from 'axios'
import { appConfig } from '@/config'
import { STORAGE_KEYS, getStorage, removeStorage } from '@/utils/storage'

const service = axios.create({
  baseURL: appConfig.baseURL,
  timeout: appConfig.requestTimeout,
  headers: {
    'Content-Type': 'application/json'
  }
})

service.interceptors.request.use(
  (config) => {
    const token = getStorage(STORAGE_KEYS.TOKEN, '')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

function showErrorToast(message) {
  uni.showToast({
    title: message || 'Network error',
    icon: 'none'
  })
}

function handleUnauthorized(message) {
  removeStorage(STORAGE_KEYS.TOKEN)
  uni.showToast({
    title: message || 'Session expired, please login again',
    icon: 'none'
  })
  uni.reLaunch({
    url: '/pages/login/index'
  })
}

function normalizeResponseData(responseData) {
  if (responseData && typeof responseData === 'object' && 'code' in responseData) {
    if (responseData.code === 0) {
      return responseData.data
    }

    showErrorToast(responseData.message || 'Request failed')
    return Promise.reject(responseData)
  }

  return responseData
}

service.interceptors.response.use(
  (response) => normalizeResponseData(response.data),
  (error) => {
    const status = error?.response?.status
    const responseDetail = error?.response?.data?.detail
    const message = responseDetail || error?.message || 'Network error'

    if (status === 401) {
      handleUnauthorized(message)
    } else {
      showErrorToast(message)
    }

    return Promise.reject(error)
  }
)

function buildUrl(url, params = {}) {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')

  if (!query) {
    return `${appConfig.baseURL}${url}`
  }

  return `${appConfig.baseURL}${url}?${query}`
}

function miniProgramRequest(method, url, data = {}, config = {}) {
  const token = getStorage(STORAGE_KEYS.TOKEN, '')
  const headers = {
    'Content-Type': 'application/json',
    ...(config.headers || {})
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const requestUrl = method === 'GET' ? buildUrl(url, data) : `${appConfig.baseURL}${url}`

  return new Promise((resolve, reject) => {
    uni.request({
      url: requestUrl,
      method,
      header: headers,
      data: method === 'GET' ? undefined : data,
      success: (response) => {
        const { statusCode, data: responseData } = response

        if (statusCode === 401) {
          handleUnauthorized(responseData?.detail)
          reject(response)
          return
        }

        if (statusCode >= 200 && statusCode < 300) {
          Promise.resolve(normalizeResponseData(responseData)).then(resolve).catch(reject)
          return
        }

        const message = responseData?.detail || responseData?.message || `Request failed: ${statusCode}`
        showErrorToast(message)
        reject(response)
      },
      fail: (error) => {
        showErrorToast(error?.errMsg || 'Network error')
        reject(error)
      }
    })
  })
}

const request = {
  get(url, params = {}, config = {}) {
    // #ifdef MP-WEIXIN
    return miniProgramRequest('GET', url, params, config)
    // #endif

    // #ifndef MP-WEIXIN
    return service({
      url,
      method: 'GET',
      params,
      ...config
    })
    // #endif
  },
  post(url, data = {}, config = {}) {
    // #ifdef MP-WEIXIN
    return miniProgramRequest('POST', url, data, config)
    // #endif

    // #ifndef MP-WEIXIN
    return service({
      url,
      method: 'POST',
      data,
      ...config
    })
    // #endif
  },
  put(url, data = {}, config = {}) {
    // #ifdef MP-WEIXIN
    return miniProgramRequest('PUT', url, data, config)
    // #endif

    // #ifndef MP-WEIXIN
    return service({
      url,
      method: 'PUT',
      data,
      ...config
    })
    // #endif
  }
}

export default request
