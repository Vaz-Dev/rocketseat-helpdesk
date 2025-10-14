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
} from '@nestjs/common';
import { LoginDto } from './dto/LoginDto';
import { AuthService } from './auth.service';
import { User } from 'src/database/dao/interface';

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async Login(@Body() data: LoginDto) {
    const token = await this.authService.login(data);
    return token;
  }
}
