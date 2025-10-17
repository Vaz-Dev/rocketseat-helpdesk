import {
  Injectable,
  Logger,
  ExecutionContext,
  NotAcceptableException,
  CanActivate,
  SetMetadata,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { UserDAO } from 'src/database/dao/user.dao';
import { LoginDto as LoginDto } from './dto/LoginDto';
import { User } from 'src/database/dao/interface';
import argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthService {
  constructor(
    private readonly userDAO: UserDAO,
    private readonly jwt: JwtService,
  ) {}

  public async login(data: LoginDto) {
    const user: User[] | null = await this.userDAO.getUserByEmail(data.email);
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
      const useHash = true;
      return useHash
        ? argon2.verify(savedPassword, tryPassword)
        : (await savedPassword) == tryPassword;
    }
  }
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwt: JwtService,
    private readonly userDAO: UserDAO,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tokenCookie = request.cookies?.['token'];
    const payload = this.jwt.decode(tokenCookie);

    if (tokenCookie) {
      const user = await this.userDAO.getExtendedUserById(payload.id);
      request.auth = payload;
      request.user = user[0];
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const user = request.user;

    if (!requiredRoles || requiredRoles.length === 0 || user?.role == 'admin') {
      return true;
    }
    if (!user?.role) {
      throw new UnauthorizedException(
        'Client is missing authentication for guarded route.',
      );
    }
    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException(
        'Client has insufficient permission for guarded route.',
      );
    }

    return true;
  }
}
