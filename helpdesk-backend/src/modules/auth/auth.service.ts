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
import { LoginDto } from './dto/LoginDto';
import { User } from 'src/database/dao/interface';
import argon2 from 'argon2';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { CookieOptions, Response } from 'express';
import { ExtendedRequest } from 'src/types/extended-request.interface';
import { randomUUID } from 'node:crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  public readonly tokenMaxAgeMinutes: number;
  public readonly useHash: boolean;
  public readonly jwtSecret: string;
  public readonly cookieOptions: CookieOptions;
  public readonly jwtSignOptions: JwtSignOptions;

  constructor(
    private readonly userDAO: UserDAO,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {
    this.tokenMaxAgeMinutes =
      this.config.get<number>('TOKEN_MAX_AGE_MINUTES') ?? 30;
    this.useHash = this.config.get<boolean>('USE_HASH') ?? true;
    this.jwtSecret = this.config.get<string>('JWT_SECRET') ?? randomUUID();
    this.cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: this.tokenMaxAgeMinutes * 60 * 1000,
    };
    this.jwtSignOptions = {
      secret: this.jwtSecret,
      expiresIn: this.tokenMaxAgeMinutes * 60,
    };
  }

  private async verifyPassword(savedPassword, tryPassword): Promise<boolean> {
    return this.useHash
      ? argon2.verify(savedPassword, tryPassword)
      : (await savedPassword) == tryPassword;
  }

  private verifyUserExists(user): boolean {
    if (user && user.length == 1) {
      return true;
    } else {
      return false;
    }
  }

  public async login(data: LoginDto) {
    const user: User[] | null = await this.userDAO.getUserByEmail(data.email);
    if (this.verifyUserExists(user)) {
      if (await this.verifyPassword(user[0].password, data.password)) {
        const payload = { id: user[0].user_id };
        const token = this.jwt.sign(payload, this.jwtSignOptions);
        return token;
      } else {
        throw new NotAcceptableException('Invalid password');
      }
    } else {
      throw new NotAcceptableException('Email does not match with any user');
    }
  }
}

// This creates the @Roles decorator, used in controllers for role authorization.
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly refreshTokenOnEveryAuth: boolean;
  constructor(
    private reflector: Reflector,
    private readonly jwt: JwtService,
    private readonly userDAO: UserDAO,
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    this.refreshTokenOnEveryAuth =
      this.config.get<boolean>('TOKEN_REFRESH_ON_EVERY_AUTH') ?? true;
    if (typeof this.refreshTokenOnEveryAuth == 'string') {
      if (this.refreshTokenOnEveryAuth == 'true') {
        this.refreshTokenOnEveryAuth = true;
      } else if (this.refreshTokenOnEveryAuth == 'false') {
        this.refreshTokenOnEveryAuth = false;
      }
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: ExtendedRequest = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    let tokenCookie = request.cookies?.['token'];
    let payload: any = this.jwt.decode(tokenCookie);

    // This gets the @Roles defined in the controller for that route.
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    // Case the route has no required roles.
    if (!requiredRoles || requiredRoles.length === 0) {
      try {
        // If client has a token, get its info to the request if valid anyway.
        this.jwt.verify(tokenCookie, { secret: this.authService.jwtSecret });
        payload = this.jwt.decode(tokenCookie);
        const user = await this.userDAO.getUserById(payload.id);
        request.auth = payload;
        request.user = user[0];
        // If token and info are all valid, also refreshes the token duration (by generating a new one)
        payload = { id: request.user.user_id };
        tokenCookie = this.jwt.sign(payload, this.authService.jwtSignOptions);
        response.cookie('token', tokenCookie, this.authService.cookieOptions);
      } catch {
        return true;
      }
      return true;
    }
    try {
      // Verify the token
      this.jwt.verify(tokenCookie, { secret: this.authService.jwtSecret });
    } catch {
      response.clearCookie('token');
      throw new UnauthorizedException(
        "Client's token refused, either expired on invalid",
      );
    }
    if (tokenCookie) {
      // Get client's info and add to the request.
      const user = await this.userDAO.getUserById(payload.id);
      request.auth = payload;
      request.user = user[0];
    }
    if (!request.user?.role) {
      // Check if the client has any role at all.
      throw new UnauthorizedException(
        'Client is missing authentication for guarded route.',
      );
    }
    const hasRole = requiredRoles.includes(request.user.role);
    if (!hasRole) {
      // Check if the client has the required role for this route.
      throw new ForbiddenException(
        'Client has insufficient permission for guarded route.',
      );
    } else if (this.refreshTokenOnEveryAuth) {
      payload = { id: request.user.user_id };
      const token = this.jwt.sign(payload, this.authService.jwtSignOptions);
      response.cookie('token', token, this.authService.cookieOptions);
    }

    return true;
  }
}
