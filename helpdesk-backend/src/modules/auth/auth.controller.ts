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
  Patch,
} from '@nestjs/common';
import { LoginDto } from './dto/LoginDto';
import type { Response } from 'express';
import { AuthService, Roles } from './auth.service';
import type { ExtendedRequest } from 'src/types/extended-request.interface';
import { UserService } from '../user/user.service';
import { UserUpdateDto } from '../user/dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() data: LoginDto, @Res() res: Response) {
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

  @Get('check')
  check(@Req() req: ExtendedRequest, @Res() res: Response) {
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

  @Patch('logout')
  async logout(@Req() req: ExtendedRequest, @Res() res: Response) {
    if (!req.auth) {
      throw new NotAcceptableException(
        'Cookie token not found, client not logged in',
      );
    } else {
      const currentTime = Math.floor(Date.now() / 1000);
      const userUpdate: UserUpdateDto = {
        id: req.user?.user_id,
        last_logout: currentTime,
      };
      await this.userService.updateUser(userUpdate);
      res.clearCookie('token').status(HttpStatus.ACCEPTED).json({
        message: `Client successfully logged out from all devices.`,
      });
    }
  }
}
