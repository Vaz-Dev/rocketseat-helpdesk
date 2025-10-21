import {
  Injectable,
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
import { JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { CookieOptions, Response } from 'express';
import { ExtendedRequest } from 'src/types/extended-request.interface';

// Configurations for auth service and guard.
const useHash = true;
const refreshTokenOnEveryAuth = true;
export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
  maxAge: 30 * 60 * 1000,
};
export const jwtOptions: JwtModuleOptions = {
  secret: 'segredo_muito_secreto',
  signOptions: { expiresIn: '30m' },
};

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
    const request: ExtendedRequest = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    const tokenCookie = request.cookies?.['token'];
    let payload = this.jwt.decode(tokenCookie);

    if (tokenCookie) {
      const user = await this.userDAO.getUserById(payload.id);
      request.auth = payload;
      request.user = user[0];
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const user = request.user;

    if (!requiredRoles || requiredRoles.length === 0) {
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
    } else if (refreshTokenOnEveryAuth) {
      payload = { id: request.user.user_id };
      const token = this.jwt.sign(payload);
      response.cookie('token', token, cookieOptions);
    }

    return true;
  }
}
