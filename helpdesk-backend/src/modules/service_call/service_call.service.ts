import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ServiceCallDAO } from 'src/database/dao/service_call.dao';
import { addServiceCallDto } from './dto/AddCallDto';
import { ServiceTypeDAO } from 'src/database/dao/service_type.dao';
import { CallCostsDAO } from 'src/database/dao/call_costs.dao';
import { ServiceCall } from 'src/database/dao/interface';
import { UpdateCallDto } from './dto/UpdateCall';
import { CallCostDto } from './dto/CallCostDto';
import { UserDAO } from 'src/database/dao/user.dao';
import { ExtendedCallDto } from './dto/ExtendedCallDto';

@Injectable()
export class ServiceCallService {
  constructor(
    private readonly serviceCallDAO: ServiceCallDAO,
    private readonly serviceTypeDAO: ServiceTypeDAO,
    private readonly callCostsDAO: CallCostsDAO,
    private readonly userDAO: UserDAO,
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
    const [call] = await this.serviceCallDAO.getServiceCall(id);
    if (!call) {
      throw new NotFoundException(`No call found with id: ${id}`);
    }
    call.total_value = call.total_value + value;
    await this.serviceCallDAO.updateServiceCall(call);
    return true;
  }

  public async addServiceCall(data: addServiceCallDto): Promise<boolean> {
    const [callServiceType] = await this.serviceTypeDAO.getServiceType(
      data.service,
    );
    if (!callServiceType || !data.client) {
      throw new InternalServerErrorException(`Calls service got invalid data.`);
    }
    if (callServiceType.deleted == 'true') {
      throw new BadRequestException(
        `Cannot create a call with a soft deleted service type, those remain for legacy compatibility only`,
      );
    }
    const [client] = await this.userDAO.getUserByRoleId(data.client);
    const [technician] = await this.userDAO.getUserByRoleId(data.technician);
    if (!client || !technician) {
      throw new BadRequestException(
        `Call service's add method couldn't validate the related client/technician`,
      );
    }
    const call: ServiceCall = {
      service: data.service,
      total_value: callServiceType.value,
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

  public async getServiceCall(id: number): Promise<ExtendedCallDto> {
    const [result] = await this.serviceCallDAO.getServiceCall(id);

    // Populates ServiceCall.additional_costs using the call id.
    const additional_costs = await this.callCostsDAO.getCallCostsByCallId(id);
    // Replaces the service type id with the actual object inside the call.
    const [service] = await this.serviceTypeDAO.getServiceType(result.service);
    // Populates ServiceCall.client using his/her role_id.
    const [client] = await this.userDAO.getUserByRoleId(result.client);
    delete client.password;
    // Populates ServiceCall.technician using his/her role_id.
    const [technician] = await this.userDAO.getUserByRoleId(result.technician);
    delete technician.password;
    if (
      !result ||
      !result.id ||
      !result.description ||
      !result.status ||
      !result.created_at ||
      !result.updated_at
    ) {
      throw new InternalServerErrorException(`Calls service got invalid data`);
    }
    const call: ExtendedCallDto = {
      title: result.title,
      description: result.description,
      total_value: result.total_value,
      status: result.status,
      id: result.id,
      created_at: result.created_at,
      updated_at: result.updated_at,
      service: service,
      client: client,
      technician: technician,
      additional_costs: additional_costs,
    };
    return call;
  }

  public async updateServiceCall(data: UpdateCallDto): Promise<boolean> {
    if (!data.id) {
      throw new InternalServerErrorException(`Calls service got invalid data.`);
    }
    const [getCall] = await this.serviceCallDAO.getServiceCall(data.id);
    if (!getCall.id) {
      throw new NotFoundException(`Service call not found, unable to update.`);
    }
    const call = {
      ...getCall,
      title: data.title ?? getCall.title,
      description: data.description ?? getCall.description,
      status: data.status ?? getCall.status,
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
    if (!data.service_call) {
      throw new BadRequestException(`Missing call id to add cost to.`);
    }
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

  public async getCallbyCostId(id: number): Promise<ExtendedCallDto> {
    const [callCost] = await this.callCostsDAO.getCallCostById(id);
    if (!callCost || !callCost.service_call) {
      throw new InternalServerErrorException(
        `Failed to find call cost, service received invalid data.`,
      );
    }
    return await this.getServiceCall(callCost.service_call);
  }

  public async deleteCallCosts(id: number): Promise<boolean> {
    const [callCost] = await this.callCostsDAO.getCallCostById(id);
    if (!callCost || !callCost.service_call) {
      throw new InternalServerErrorException(
        `Failed to find call cost, service received invalid data.`,
      );
    }
    const costResult = await this.callCostsDAO.deleteCallCosts(id);
    const callResult = await this.updateCallTotalValue(
      callCost.service_call,
      callCost.value * -1,
    );
    return costResult && callResult;
  }
}
