import { Logger, Module } from '@nestjs/common';
import { AuthInterceptor, AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserDAO } from 'src/database/dao/user.dao';
import { JwtModule } from '@nestjs/jwt';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    AuthService,
    Logger,
    UserDAO,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
    },
  ],
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: 'segredo_muito_secreto',
      signOptions: { expiresIn: '30m' },
    }),
  ],
})
export class AuthModule {}
