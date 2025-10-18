/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, UseGuards } from '@nestjs/common'
import { CurrentUser } from '../../common/decorators/current-user.decorator.js'
import { UsersService } from './users.service.js'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js'

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getProfile(@CurrentUser() user: any) {
    const { password: _, ...userData } = user.user
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return userData
  }
}
