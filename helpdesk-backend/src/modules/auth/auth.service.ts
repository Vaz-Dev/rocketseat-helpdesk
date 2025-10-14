import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDAO } from 'src/database/dao/user.dao';
import { LoginDto as LoginDto } from './dto/LoginDto';
import { User } from 'src/database/dao/interface';
import argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userDAO: UserDAO,
    private readonly logger: Logger,
    private readonly jwt: JwtService,
  ) {}

  public async login(data: LoginDto) {
    const user: User[] | null = await this.userDAO.getUserByEmail(
      data['email'],
    );
    if (verifyUserExists(user)) {
      if (await verifyPassword(user[0].password, data.password)) {
        const payload = { id: user[0].id };
        const token = this.jwt.sign(payload);
        return token;
      } else {
        throw new UnauthorizedException('Invalid password');
      }
    } else {
      throw new NotFoundException('Email does not match with any user');
    }

    function verifyUserExists(user): boolean {
      if (user && user.length == 1) {
        return true;
      } else {
        return false;
      }
    }

    async function verifyPassword(
      savedPassword,
      tryPassword,
    ): Promise<boolean> {
      //return await argon2.verify(savedPassword, tryPassword);
      return (await savedPassword) == tryPassword;
    }
  }
}
