import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AdminService } from './admin.service.js'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js'
import { Roles } from '../../common/decorators/roles.decorator.js'
import { RolesGuard } from '../../common/guards/roles.guard.js'
import { UserRole } from '@prisma/client'
import { Delete } from '@nestjs/common'

@ApiTags('admin')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  listUsers(@Query('page') page = '1', @Query('pageSize') pageSize = '20') {
    const pageNumber = parseInt(page) || 1
    const take = parseInt(pageSize) || 20
    const skip = (pageNumber - 1) * take
    return this.adminService.listUsers({ skip, take })
  }

  @Patch('users/:id/role')
  @Roles(UserRole.SUPER_ADMIN)
  updateUserRole(@Param('id') id: string, @Body('role') role: UserRole) {
    return this.adminService.updateUserRole(id, role)
  }

  @Patch('users/:id/active')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  setUserActive(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.adminService.setUserActive(id, isActive)
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  getSystemStats() {
    return this.adminService.getSystemStats()
  }

  @Delete('users/:id')
  @Roles(UserRole.SUPER_ADMIN)
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id)
  }
}

