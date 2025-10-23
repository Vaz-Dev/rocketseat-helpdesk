import {
  Controller,
  Get,
  Body,
  Res,
  Post,
  Req,
  HttpStatus,
  NotAcceptableException,
  BadRequestException,
} from '@nestjs/common';
import { LoginDto } from './dto/LoginDto';
import type { Response } from 'express';
import { AuthService, Roles } from './auth.service';
import type { ExtendedRequest } from 'src/types/extended-request.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async Login(@Body() data: LoginDto, @Res() res: Response) {
    if (!data.email || !data.password) {
      throw new BadRequestException(
        'Invalid body, login with body: JSON = {email: ?, password: ?}',
      );
    }
    const token = await this.authService.login(data);
    res
      .cookie('token', token, this.authService.cookieOptions)
      .status(HttpStatus.ACCEPTED)
      .json({ message: 'Login successful, new cookie token sent to client.' });
  }

  @Roles('client', 'technician', 'admin')
  @Get('check')
  Check(@Req() req: ExtendedRequest, @Res() res: Response) {
    if (req.auth && req.user?.email) {
      res.status(HttpStatus.ACCEPTED).json({
        message: `Cookie token successfully verified`,
        name: req.user?.name,
        role: req.user?.role,
        minutes_to_expire: (req.auth.exp - Date.now() / 1000) / 60,
      });
    } else {
      throw new NotAcceptableException(
        'Cookie token not found, try POST /auth/login',
      );
    }
  }

  @Get('logout')
  Logout(@Req() req: ExtendedRequest, @Res() res: Response) {
    if (!req.auth) {
      throw new NotAcceptableException(
        'Cookie token not found, client not logged in',
      );
    } else {
      res.clearCookie('token').status(HttpStatus.ACCEPTED).json({
        message: `Cookie token successfully removed, client logged out.`,
      });
    }
  }
}
