import { User } from './user.type'

export interface ErrorResponse<Data> {
  message: string
  data?: Data
}

export interface SuccessResponse<Data> {
  message: string
  data: Data
}

export type RawAuthResponse = {
  access_token: string
  user: User
}
