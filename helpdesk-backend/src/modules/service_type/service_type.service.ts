import { Injectable } from '@nestjs/common';
import { ServiceTypeDAO } from 'src/database/dao/service_type.dao';

@Injectable()
export class ServiceTypeService {
  constructor(private readonly serviceTypeDAO: ServiceTypeDAO) {}
}
