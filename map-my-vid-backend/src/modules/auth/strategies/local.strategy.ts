/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from '../auth.service.js'

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({ usernameField: 'email' })
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }
    return user
  }
}
