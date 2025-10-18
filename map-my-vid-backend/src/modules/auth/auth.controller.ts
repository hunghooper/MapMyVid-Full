import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { LoginDto, RegisterDto } from './dto/auth.dto.js'
import { LocalAuthGuard } from './guards/local-auth.guard.js'

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login(@Request() req, @Body() loginDto: LoginDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.authService.login(req.user)
  }
}
