import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ServiceCallDAO } from 'src/database/dao/service_call.dao';
import { ServiceCallDto } from './dto/AddCallDto';
import { ServiceTypeDAO } from 'src/database/dao/service_type.dao';
import { CallCostsDAO } from 'src/database/dao/call_costs.dao';
import { ServiceCall } from 'src/database/dao/interface';
import { UpdateCallDto } from './dto/UpdateCall';
import { CallCostDto } from './dto/CallCostDto';

@Injectable()
export class ServiceCallService {
  constructor(
    private readonly serviceCallDAO: ServiceCallDAO,
    private readonly serviceTypeDAO: ServiceTypeDAO,
    private readonly callCostsDAO: CallCostsDAO,
  ) {}

  private async checkIfServiceCallExists(id: number): Promise<boolean> {
    const result = await this.serviceCallDAO.getServiceCall(id);
    if (result.length == 1) {
      return true;
    }
    return false;
  }

  private async updateCallTotalValue(
    id: number,
    value: number,
  ): Promise<boolean> {
    const call = await this.serviceCallDAO.getServiceCall(id);
    if (call.length != 1) {
      throw new NotFoundException(`No call found with id: ${id}`);
    }
    call[0].total_value = call[0].total_value + value;
    await this.serviceCallDAO.updateServiceCall(call[0]);
    return true;
  }

  public async addServiceCall(data: ServiceCallDto): Promise<boolean> {
    const callServiceType = await this.serviceTypeDAO.getServiceType(
      data.service,
    );
    if (callServiceType.length != 1 || !data.client) {
      throw new InternalServerErrorException(`Calls service got invalid data.`);
    }
    const call: ServiceCall = {
      service: data.service,
      total_value: callServiceType[0].value,
      client: data.client,
      technician: data.technician,
      title: data.title,
      description: data.description,
    };
    await this.serviceCallDAO.addServiceCall(call);
    return true;
  }

  public async getAllServiceCalls(): Promise<ServiceCall[]> {
    return await this.serviceCallDAO.getAllServiceCalls();
  }

  public async getServiceCallsByRoleId(id: string): Promise<ServiceCall[]> {
    return await this.serviceCallDAO.getServiceCallsByRoleId(id);
  }

  public async getServiceCall(id: number): Promise<ServiceCall> {
    const result = await this.serviceCallDAO.getServiceCall(id);
    if (result.length != 1) {
      throw new InternalServerErrorException(`Calls service got invalid data.`);
    }
    // Populates ServiceCall.additional_costs using the call id.
    result[0].additional_costs =
      await this.callCostsDAO.getCallCostsByCallId(id);
    // Replaces the service type id with the actual object inside the call.
    const service = await this.serviceTypeDAO.getServiceType(result[0].service);
    result[0].service = service[0];
    return result[0];
  }

  public async updateServiceCall(data: UpdateCallDto): Promise<boolean> {
    if (!data.id) {
      throw new InternalServerErrorException(`Calls service got invalid data.`);
    }
    const getCall = await this.serviceCallDAO.getServiceCall(data.id);
    const call = {
      ...getCall[0],
      title: data.title ?? getCall[0].title,
      description: data.description ?? getCall[0].description,
      status: data.status ?? getCall[0].status,
    };
    await this.serviceCallDAO.updateServiceCall(call);
    return true;
  }

  public async deleteServiceCall(id: number): Promise<boolean> {
    const exists = await this.checkIfServiceCallExists(id);
    if (!exists) {
      throw new NotFoundException(`No call found with id: ${id}`);
    }
    await this.serviceCallDAO.deleteServiceCall(id);
    return true;
  }

  public async addCallCosts(data: CallCostDto): Promise<boolean> {
    const exists = await this.checkIfServiceCallExists(data.service_call);
    if (!exists) {
      throw new BadRequestException(
        `No call found with id: ${data.service_call}`,
      );
    }
    await this.callCostsDAO.addCallCosts(data);
    await this.updateCallTotalValue(data.service_call, data.value);
    return true;
  }

  public async deleteCallCosts(id: number): Promise<boolean> {
    const callCost = await this.callCostsDAO.getCallCostById(id);
    if (callCost.length != 1 || !callCost[0].service_call) {
      throw new InternalServerErrorException(
        `Failed to delete call cost, service received invalid data.`,
      );
    }
    const costResult = await this.callCostsDAO.deleteCallCosts(id);
    const callResult = await this.updateCallTotalValue(
      callCost[0].service_call,
      callCost[0].value * -1,
    );
    return costResult && callResult;
  }
}
