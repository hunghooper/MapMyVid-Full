import { RawAuthResponse } from '@/types/utils.type'
import axios, { AxiosInstance } from 'axios'
import path from '../constants/path'
import { clearLS, getAccessTokenFromLS, setAccessTokenToLS, setProfileToLS } from './auth'

class Http {
  instance: AxiosInstance
  private access_token: string
  constructor() {
    this.access_token = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL: `http://localhost:${import.meta.env.VITE_BACKEND_PORT}/api`,
      timeout: 100000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        const token = getAccessTokenFromLS()
        if (token && config.headers) {
          config.headers.authorization = `Bearer ${token}`
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use((response) => {
      const { url } = response.config
      const responseData = response.data as RawAuthResponse
      if (url === path.login) {
        this.access_token = responseData.access_token
        setAccessTokenToLS(this.access_token)
        setProfileToLS(responseData.user)
      } else if (url === path.logout) {
        this.access_token = ''
        clearLS()
      }
      return response
    })
  }
}
const http = new Http().instance
export default http
