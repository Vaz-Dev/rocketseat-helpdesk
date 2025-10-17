import {
  BadRequestException,
  Controller,
  Body,
  Req,
  Res,
  Put,
  Post,
  HttpStatus,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { AdminDto, ClientDto, TechnicianDto, UserUpdateDto } from './dto';
import type { Response } from 'express';
import { Roles } from '../auth/auth.service';
import { UserService } from './user.service';
import type { ExtendedRequest } from 'src/types/extended-request.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('admin') // Only admins can create accounts with the role 'admin'.
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

  @Roles() // Anyone can create accounts with the role 'client'.
  @Post('client')
  async AddClient(@Body() data: ClientDto, @Res() res: Response) {
    if (!data.email || !data.name || !data.password) {
      throw new BadRequestException(
        'Invalid body, create user of role "client" with body: JSON = {email: ?, password: ?, name: ?}',
      );
    }
    const result = await this.userService.addClient(data);
    if (!result) {
      throw new InternalServerErrorException(
        `Something went wrong, client '${data.name}' not added.`,
      );
    }
    res.status(HttpStatus.CREATED).json({
      message: 'User successfully added to database.',
      email: data.email,
      role: 'client',
    });
  }

  @Roles('admin') // Only admins can create accounts with the role 'technician'.
  @Post('technician')
  async AddTechnician(@Body() data: TechnicianDto, @Res() res: Response) {
    if (!data.email || !data.name || !data.password || !data.working_hours) {
      throw new BadRequestException(
        'Invalid body, create user of role "technician" with body: JSON = {email: ?, password: ?, name: ?, working_hours: ?}',
      );
    }
    const result = await this.userService.addTechnician(data);
    if (!result) {
      throw new InternalServerErrorException(
        `Something went wrong, technician '${data.name}' not added.`,
      );
    }
    res.status(HttpStatus.CREATED).json({
      message: 'User successfully added to database.',
      email: data.email,
      role: 'technician',
    });
  }

  @Roles('client', 'technician', 'admin') // Any user can update their own account.
  @Put()
  async UpdateOwnAccount(
    @Body() data: UserUpdateDto,
    @Req() req: ExtendedRequest,
    @Res() res: Response,
  ) {
    if (!data.name && !data.password && !data.pfp && !data.working_hours) {
      throw new BadRequestException(
        'Invalid body, update your own account with body: JSON = {name?: ?, password?: ?, pfp?: ?, working_hours?: ?} (at least one)',
      );
    }
    data.id = req.user.user_id;
    await this.userService.updateUser(data);
    res.status(HttpStatus.ACCEPTED).json({
      message: 'User account info successfully updated.',
    });
  }

  @Roles('admin') // Only admins are allowed to update other user's accounts.
  @Put(':id')
  async UpdateOtherAccount(
    // THIS FUNCTION WAS NOT TESTED YET
    @Body() data: UserUpdateDto,
    @Res() res: Response,
    @Param() id: string,
  ) {
    if (
      !id ||
      (!data.name && !data.password && !data.pfp && !data.working_hours)
    ) {
      throw new BadRequestException(
        'Invalid body, update your another account with body: JSON = {name?: ?, password?: ?, pfp?: ?, working_hours?: ?} (at least one)',
      );
    }
    data.id = id;
    await this.userService.updateUser(data);
    res.status(HttpStatus.ACCEPTED).json({
      message: 'User account info successfully updated.',
    });
  }
}
