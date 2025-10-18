import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UsersModule } from '../users/users.module.js'
import { AuthService } from './auth.service.js'
import { LocalStrategy } from './strategies/local.strategy.js'
import { JwtStrategy } from './strategies/jwt.strategy.js'
import { AuthController } from './auth.controller.js'

@Module({
  imports: [
    PassportModule,
    UsersModule,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        secret: config.get('JWT_SECRET'),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') }
      })
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
