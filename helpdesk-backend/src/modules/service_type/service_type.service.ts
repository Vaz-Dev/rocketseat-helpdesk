import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceTypeDAO } from 'src/database/dao/service_type.dao';
import { ServiceTypeDTO } from './dto/ServiceTypeDto';
import { ServiceType } from 'src/database/dao/interface';

@Injectable()
export class ServiceTypeService {
  constructor(private readonly serviceTypeDAO: ServiceTypeDAO) {}

  async addServiceType(data: ServiceTypeDTO): Promise<boolean> {
    const serviceType: ServiceType = {
      name: data.name,
      value: data.value,
    };
    return await this.serviceTypeDAO.addServiceType(serviceType);
  }

  async getAllServiceTypes(): Promise<ServiceType[]> {
    return await this.serviceTypeDAO.getAllServiceTypes();
  }

  async getServiceType(id: number): Promise<ServiceType> {
    const [result] = await this.serviceTypeDAO.getServiceType(id);
    if (result) {
      return result;
    } else {
      throw new NotFoundException(`No service type with id: ${id}`);
    }
  }

  private async checkIfServiceTypeExists(id: number): Promise<void> {
    const result = await this.serviceTypeDAO.getServiceType(id);
    if (result.length != 1) {
      throw new NotFoundException(`No service type with id: ${id}`);
    }
  }

  async updateServiceType(data: ServiceTypeDTO, id: number) {
    const serviceTypeOld: ServiceType = await this.getServiceType(id);
    const serviceTypeNew: ServiceType = {
      id: serviceTypeOld.id,
      name: data.name ? data.name : serviceTypeOld.name,
      value: data.value ? data.value : serviceTypeOld.value,
      deleted: data.deleted ? data.deleted : serviceTypeOld.deleted,
    };
    return await this.serviceTypeDAO.updateServiceType(serviceTypeNew);
  }

  async deleteServiceType(id: number) {
    await this.checkIfServiceTypeExists(id);
    return this.serviceTypeDAO.deleteServiceType(id);
  }
}
