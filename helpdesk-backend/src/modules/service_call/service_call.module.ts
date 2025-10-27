import { Module } from '@nestjs/common';
import { ServiceCallController } from './service_call.controller';
import { ServiceCallService } from './service_call.service';
import { ServiceCallDAO } from 'src/database/dao/service_call.dao';
import { UserDAO } from 'src/database/dao/user.dao';
import { CallCostsDAO } from 'src/database/dao/call_costs.dao';
import { ServiceTypeDAO } from 'src/database/dao/service_type.dao';

@Module({
  controllers: [ServiceCallController],
  providers: [
    ServiceCallService,
    ServiceCallDAO,
    UserDAO,
    CallCostsDAO,
    ServiceTypeDAO,
  ],
})
export class ServiceCallModule {}
