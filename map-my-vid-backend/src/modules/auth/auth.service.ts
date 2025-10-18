/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service.js'
import { RegisterDto } from './dto/auth.dto.js'
import { ERROR_MESSAGES } from '../../common/constants/error-messages.js'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    if (!email || !password) {
      throw new BadRequestException(ERROR_MESSAGES.AUTH.EMAIL_PASSWORD_REQUIRED)
    }

    const user = await this.usersService.findByEmail(email)
    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS)
    }

    if (!user.isActive) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.ACCOUNT_DEACTIVATED)
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS)
    }

    const { password: _, ...result } = user
    return result
  }

  login(user: any) {
    if (!user || !user.id || !user.email) {
      throw new BadRequestException(ERROR_MESSAGES.AUTH.INVALID_USER_DATA)
    }

    const payload = { email: user.email, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    }
  }

  async register(registerDto: RegisterDto) {
    if (!registerDto.email || !registerDto.password) {
      throw new BadRequestException(ERROR_MESSAGES.AUTH.EMAIL_PASSWORD_REQUIRED)
    }

    if (registerDto.password.length < 6) {
      throw new BadRequestException(ERROR_MESSAGES.AUTH.PASSWORD_TOO_SHORT)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(registerDto.email)) {
      throw new BadRequestException(ERROR_MESSAGES.AUTH.INVALID_EMAIL_FORMAT)
    }

    const existingUser = await this.usersService.findByEmail(registerDto.email)
    if (existingUser) {
      throw new ConflictException(ERROR_MESSAGES.AUTH.EMAIL_ALREADY_EXISTS)
    }

    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10)

      const user = await this.usersService.create({
        ...registerDto,
        password: hashedPassword
      })

      const { password: _, ...result } = user
      return this.login(result)
    } catch (error) {
      throw new BadRequestException(ERROR_MESSAGES.AUTH.FAILED_CREATE_USER)
    }
  }
}
