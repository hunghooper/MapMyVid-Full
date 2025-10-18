import { AuthResponse } from '@/types/auth.type'
import { RawAuthResponse } from '@/types/utils.type'
import { AxiosError, isAxiosError } from 'axios'
import HttpStatusCode from '../constants/httpStatusCode.enum'

export function isAxiosUnprocessableEntity<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export const transformAuthResponse = (raw: RawAuthResponse): AuthResponse => ({
  message: 'Login successful',
  data: {
    access_token: raw.access_token,
    user: raw.user
  }
})
