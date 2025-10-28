import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ServiceCallService } from './service_call.service';
import { Roles } from '../auth/auth.service';
import type { Response } from 'express';
import { CallCostDto } from './dto/CallCostDto';
import { addServiceCallDto } from './dto/AddCallDto';
import type { ExtendedRequest } from 'src/types/extended-request.interface';
import { UpdateCallDto } from './dto/UpdateCall';

@Controller('service/call')
export class ServiceCallController {
  constructor(private readonly callService: ServiceCallService) {}

  @Roles('technician', 'admin')
  @Post('/cost/:id')
  async addCallCost(
    @Res() res: Response,
    @Body() data: CallCostDto,
    @Param() param: { id: string },
  ) {
    if (!data || !data.name || !data.value || !param.id) {
      throw new BadRequestException(
        `Invalid body, to add a call cost use POST /service/cost/:id = JSON { name = ?, value = ? }`,
      );
    }
    const callCost: CallCostDto = {
      name: data.name,
      value: data.value,
      service_call: Number(param.id),
    };
    const result = await this.callService.addCallCosts(callCost);
    if (result) {
      res
        .status(HttpStatus.CREATED)
        .json({ message: `Added call cost '${data.name}' successfully.` });
    } else {
      throw new InternalServerErrorException(
        `Something went wrong when trying to add call cost '${data.name}'`,
      );
    }
  }

  @Roles('technician', 'admin')
  @Delete('/cost/:id')
  // TODO: needs to deny other technicians access, only allow the one who is assigned to the call
  async deleteCallCost(
    @Res() res: Response,
    @Param() param: { id: string },
    @Req() req: ExtendedRequest,
  ) {
    const call = await this.callService.getCallbyCostId(Number(param.id));
    if (
      req.user?.role != 'admin' &&
      req.user?.role_id != call.technician.role_id
    ) {
      throw new ForbiddenException(
        'Your account is not allowed to modify this call',
      );
    }
    const result = await this.callService.deleteCallCosts(Number(param.id));
    if (result) {
      res.status(HttpStatus.ACCEPTED).json({
        message: `Removed call cost with id '${param.id}' successfully.`,
      });
    } else {
      throw new InternalServerErrorException(
        `Something went wrong when trying to remove call cost with id '${param.id}'`,
      );
    }
  }

  @Roles('client', 'admin')
  @Post()
  async addServiceCall(
    @Res() res: Response,
    @Body() data: addServiceCallDto,
    @Req() req: ExtendedRequest,
    @Query('client_id') client_id: string,
  ) {
    if (
      !data ||
      !data.description ||
      !data.service ||
      !data.technician ||
      !data.title
    ) {
      throw new BadRequestException(
        `Invalid body, to add a call cost use POST /service/call = JSON { title = ?, description = ?, service = ?, technician = ? }`,
      );
    }
    if (req.user?.role == 'client' && req.user?.role_id) {
      client_id = req.user?.role_id;
    } else if (req.user?.role != 'admin' || !client_id) {
      throw new BadRequestException(
        'Admins using this route need to use query param of a client-id (role_id)',
      );
    }
    const serviceCall: addServiceCallDto = {
      ...data,
      client: client_id,
    };
    const result = await this.callService.addServiceCall(serviceCall);
    if (result) {
      res
        .status(HttpStatus.CREATED)
        .json({ message: `Created call '${data.title}' successfully.` });
    } else {
      throw new InternalServerErrorException(
        `Something went wrong when trying to create call '${data.title}'`,
      );
    }
  }

  @Roles('admin', 'client', 'technician')
  @Get()
  async getAllServiceCalls(@Req() req: ExtendedRequest) {
    if (req.user?.role == 'admin') {
      return await this.callService.getAllServiceCalls();
    } else if (req.user?.role_id) {
      return await this.callService.getServiceCallsByRoleId(req.user?.role_id);
    } else {
      throw new ForbiddenException(
        `Something went wrong with authentication while trying to get service calls list, user not found`,
      );
    }
  }

  @Roles('admin', 'client', 'technician')
  @Get('/:id')
  async getServiceCallById(
    @Req() req: ExtendedRequest,
    @Param() param: { id: string },
  ) {
    if (!param.id) {
      throw new BadRequestException(
        `No id sent, to get a call use GET /service/call/:id with the id of the call you wish to get`,
      );
    }
    const result = await this.callService.getServiceCall(Number(param.id));
    if (
      result.client.role_id != req.user?.role_id &&
      result.technician.role_id != req.user?.role_id &&
      req.user?.role != 'admin'
    ) {
      throw new ForbiddenException(
        `Users can only get call information relevant to their account.`,
      );
    }
    return result;
  }

  @Roles('admin', 'client', 'technician')
  @Put('/:id')
  async updateServiceCall(
    @Req() req: ExtendedRequest,
    @Param() param: { id: number },
    @Body() data: UpdateCallDto,
    @Res() res: Response,
  ) {
    if (!param.id) {
      throw new BadRequestException(
        `No id sent, to update a call use PUT /service/call/:id with the id of the call you wish to update`,
      );
    }
    if (!data.status && !data.description && !data.title) {
      throw new BadRequestException(
        `Invalid body, to update a call use PUT /service/call/:id = JSON { title = ?, description = ?, status = ? } ( at least one )`,
      );
    }
    console.log(data.status);
    if (
      !(
        data.status == undefined ||
        data.status == 'open' ||
        data.status == 'closed' ||
        data.status == 'in_progress'
      )
    ) {
      throw new BadRequestException(
        `Invalid data: Call status needs to be either 'open', 'closed' or 'in_progress'`,
      );
    }
    const serviceCall: UpdateCallDto = {
      id: param.id,
      description: data.description,
      title: data.title,
      status: data.status,
    };
    if (req.user?.role != 'admin') {
      const targetCall = await this.callService.getServiceCall(param.id);
      if (
        req.user?.role_id != targetCall.client.role_id &&
        req.user?.role_id != targetCall.technician.role_id
      ) {
        throw new ForbiddenException(
          `User missing permission to update this call, not admin or someone related to this call.`,
        );
      }
    }
    const result = await this.callService.updateServiceCall(serviceCall);
    if (result) {
      res.json({
        message: `Service call with id: '${param.id}' updated successfully`,
      });
    } else {
      throw new InternalServerErrorException(
        `Something went wrong while trying to update call with id '${param.id}'`,
      );
    }
  }

  @Roles('admin', 'client')
  @Delete('/:id')
  async deleteServiceCall(
    @Req() req: ExtendedRequest,
    @Param() param: { id: number },
    @Res() res: Response,
  ) {
    if (req.user?.role != 'admin') {
      const targetCall = await this.callService.getServiceCall(param.id);
      if (req.user?.role_id != targetCall.client.role_id) {
        throw new ForbiddenException(
          `User missing permission to delete this call, not admin or client who created this call.`,
        );
      }
    }
    const result = await this.callService.deleteServiceCall(param.id);
    if (result) {
      res.json({
        message: `Service call with id: '${param.id}' deleted successfully`,
      });
    } else {
      throw new InternalServerErrorException(
        `Something went wrong while trying to delete call with id '${param.id}'`,
      );
    }
  }
}
