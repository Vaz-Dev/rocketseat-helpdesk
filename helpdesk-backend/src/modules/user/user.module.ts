import { Logger, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDAO } from 'src/database/dao/user.dao';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService, UserDAO, Logger],
})
export class UserModule {}
