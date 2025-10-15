import {
  Controller,
  Get,
  Res,
  Body,
  Post,
  Delete,
  Put,
  Req,
  HttpStatus,
  Param,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/LoginDto';
import type { Response } from 'express';
import { AuthInterceptor, AuthService } from './auth.service';
import { User } from 'src/database/dao/interface';
import type { ExtendedRequest } from 'src/types/extended-request.interface';

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async Login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(data);
    res
      .cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 30 * 60 * 1000,
      })
      .status(HttpStatus.ACCEPTED)
      .json({ message: 'Login successful' });
  }

  @Get()
  AuthToken(@Req() req: ExtendedRequest) {
    if (req.auth) {
      return { auth: req.auth, user: req.user };
    } else {
      throw new NotFoundException(
        'AuthToken cookie not found, try POST /login',
      );
    }
  }
}
