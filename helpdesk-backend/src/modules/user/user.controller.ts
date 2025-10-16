import {
  BadRequestException,
  Controller,
  Body,
  Res,
  Post,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { AdminDto } from './dto/AdminDto';
import type { Response } from 'express';
import { Roles } from '../auth/auth.service';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('admin')
  @Post('admin')
  async AddAdmin(@Body() data: AdminDto, @Res() res: Response) {
    if (!data.email || !data.name || !data.password) {
      throw new BadRequestException(
        'Invalid body, create user of role "admin" with body: JSON = {email: ?, password: ?, name: ?}',
      );
    }
    const result = await this.userService.addAdmin(data);
    if (!result) {
      throw new InternalServerErrorException(
        `Something went wrong, admin '${data.name}' not added.`,
      );
    }
    res.status(HttpStatus.CREATED).json({
      message: 'User successfully added to database.',
      email: data.email,
      role: 'admin',
    });
  }
}
