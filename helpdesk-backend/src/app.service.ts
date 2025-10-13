import { Injectable } from '@nestjs/common';
import { UserDAO } from './database/dao/user.dao';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
