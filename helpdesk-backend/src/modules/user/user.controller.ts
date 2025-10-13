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
} from '@nestjs/common';
import { UserLoginDto } from './dto/UserLoginDto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // user login service here
}
