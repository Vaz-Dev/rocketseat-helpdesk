import { Injectable, Logger } from '@nestjs/common';
import { UserDAO } from 'src/database/dao/user.dao';
import argon2 from 'argon2';
import { AdminDto } from './dto/AdminDto';
import { User } from 'src/database/dao/interface';
import { randomUUID } from 'node:crypto';

@Injectable()
export class UserService {
  constructor(
    private readonly userDAO: UserDAO,
    private readonly logger: Logger,
  ) {}
  public async addAdmin(data: AdminDto): Promise<boolean> {
    const passwordHash = await argon2.hash(data.password);
    const admin: User = {
      name: data.name,
      email: data.email,
      password: passwordHash,
      user_id: randomUUID(),
      role_id: randomUUID(),
      role: 'admin',
    };
    return await this.userDAO.addAdmin(admin);
  }
}
