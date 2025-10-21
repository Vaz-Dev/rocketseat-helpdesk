import { Module } from '@nestjs/common';
import { AuthGuard, AuthService, jwtOptions } from './auth.service';
import { AuthController } from './auth.controller';
import { UserDAO } from 'src/database/dao/user.dao';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    AuthService,
    UserDAO,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  imports: [JwtModule.register(jwtOptions)],
})
export class AuthModule {}
