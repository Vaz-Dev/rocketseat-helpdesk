import { Logger, Module } from '@nestjs/common';
import { AuthGuard, AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserDAO } from 'src/database/dao/user.dao';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    AuthService,
    Logger,
    UserDAO,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
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
