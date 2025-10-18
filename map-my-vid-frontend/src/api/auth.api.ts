import { RawAuthResponse } from '@/types/utils.type'
import path from 'constants/path'
import http from 'utils/http'

const authApi = {
  loginAccount(body: { email: string; password: string }) {
    return http.post<RawAuthResponse>(path.login, body)
  },
  logoutAccount() {
    return http.post(path.logout)
  }
}

export default authApi
