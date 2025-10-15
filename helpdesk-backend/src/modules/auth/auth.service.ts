import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  NotAcceptableException,
} from '@nestjs/common';
import { UserDAO } from 'src/database/dao/user.dao';
import { LoginDto as LoginDto } from './dto/LoginDto';
import { User } from 'src/database/dao/interface';
import argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

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
        const payload = { id: user[0].user_id };
        const token = this.jwt.sign(payload);
        return token;
      } else {
        throw new NotAcceptableException('Invalid password');
      }
    } else {
      throw new NotAcceptableException('Email does not match with any user');
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

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(
    private readonly jwt: JwtService,
    private readonly userDAO: UserDAO,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const tokenCookie = request.cookies?.['token'];
    const payload = this.jwt.decode(tokenCookie);

    if (tokenCookie) {
      const user = await this.userDAO.getExtendedUserById(payload.user_id);
      request.auth = payload;
      request.user = user[0];
    }

    return next.handle();
  }
}
