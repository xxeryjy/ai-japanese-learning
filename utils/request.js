import axios from 'axios'
import mpAdapter from 'axios-miniprogram-adapter'
import { appConfig } from '@/config'
import { STORAGE_KEYS, getStorage, removeStorage } from '@/utils/storage'

const service = axios.create({
  baseURL: appConfig.baseURL,
  timeout: appConfig.requestTimeout,
  headers: {
    'Content-Type': 'application/json'
  }
})

// #ifdef MP-WEIXIN
service.defaults.adapter = mpAdapter
// #endif

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

service.interceptors.response.use(
  (response) => {
    const responseData = response.data
    if (responseData && typeof responseData === 'object' && 'code' in responseData) {
      if (responseData.code === 0) {
        return responseData.data
      }

      uni.showToast({
        title: responseData.message || '请求失败',
        icon: 'none'
      })

      return Promise.reject(responseData)
    }

    return responseData
  },
  (error) => {
    const status = error?.response?.status

    if (status === 401) {
      removeStorage(STORAGE_KEYS.TOKEN)
      uni.showToast({
        title: '登录状态已失效，请重新登录',
        icon: 'none'
      })
      uni.reLaunch({
        url: '/pages/login/index'
      })
    } else {
      uni.showToast({
        title: error?.message || '网络开小差了',
        icon: 'none'
      })
    }

    return Promise.reject(error)
  }
)

const request = {
  get(url, params = {}, config = {}) {
    return service({
      url,
      method: 'GET',
      params,
      ...config
    })
  },
  post(url, data = {}, config = {}) {
    return service({
      url,
      method: 'POST',
      data,
      ...config
    })
  },
  put(url, data = {}, config = {}) {
    return service({
      url,
      method: 'PUT',
      data,
      ...config
    })
  }
}

export default request

