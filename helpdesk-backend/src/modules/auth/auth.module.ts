import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserDAO } from 'src/database/dao/user.dao';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService, Logger, UserDAO],
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: 'segredo_muito_secreto',
      signOptions: { expiresIn: '30m' },
    }),
  ],
})
export class AuthModule {}
