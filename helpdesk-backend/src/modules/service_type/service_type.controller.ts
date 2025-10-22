import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Res,
  Get,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { Roles } from '../auth/auth.service';
import { ServiceTypeService } from './service_type.service';
import { ServiceTypeDTO } from './dto/ServiceTypeDto';
import type { Response } from 'express';

@Controller('service-type')
export class ServiceTypeController {
  constructor(private readonly serviceTypeService: ServiceTypeService) {}

  @Post()
  @Roles('admin')
  async addServiceType(@Body() data: ServiceTypeDTO, @Res() res: Response) {
    if (
      data.name &&
      data.value &&
      typeof data.name == 'string' &&
      typeof data.value == 'number'
    ) {
      const result = await this.serviceTypeService.addServiceType(data);
      if (result) {
        res.status(HttpStatus.CREATED).json({
          message: `Service type '${data.name}' successfully created`,
        });
      } else {
        throw new InternalServerErrorException(
          'Something went wrong while trying to create new service type',
        );
      }
    } else {
      throw new BadRequestException(
        'Invalid body, create a service type with body: JSON {name = ?, value = ?}',
      );
    }
  }

  @Get()
  @Roles('client', 'admin', 'technician')
  async getServiceTypes(@Query('id') id: number) {
    if (!id) {
      const result = await this.serviceTypeService.getAllServiceTypes();

      if (result) {
        return result;
      } else {
        throw new InternalServerErrorException(
          'Something went wrong while trying to get all service types',
        );
      }
    } else {
      const result = await this.serviceTypeService.getServiceType(id);

      if (result) {
        return result;
      } else {
        throw new InternalServerErrorException(
          'Something went wrong while trying to get all service types',
        );
      }
    }
  }

  @Put(':id')
  @Roles('admin')
  async updateServiceType(
    @Body() data: ServiceTypeDTO,
    @Param() param: any,
    @Res() res: Response,
  ) {
    if (
      !param.id ||
      !data.name ||
      typeof !data.name != 'string' ||
      !data.value ||
      typeof !data.value != 'number'
    ) {
      const result = await this.serviceTypeService.updateServiceType(
        data,
        param.id,
      );
      if (result) {
        res
          .status(HttpStatus.ACCEPTED)
          .json({ message: 'Service type updated successfully' });
      } else {
        throw new InternalServerErrorException(
          'Something went wrong while trying to update service type',
        );
      }
    } else {
      throw new BadRequestException(
        'Invalid body, update a service type with body: JSON {name = ?, value = ?}. with route PUT /:id',
      );
    }
  }

  @Delete(':id')
  @Roles('admin')
  async deleteServiceType(@Param() param: any, @Res() res: Response) {
    if (!param.id) {
      throw new BadRequestException('This route requires an parameter /:id');
    }
    const result = await this.serviceTypeService.deleteServiceType(param.id);
    if (result) {
      res
        .status(HttpStatus.ACCEPTED)
        .json({ message: 'Service type deleted successfully' });
    } else {
      throw new InternalServerErrorException(
        'Something went wrong while trying to delete service type',
      );
    }
  }
}
