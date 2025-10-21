import { Module } from '@nestjs/common';
import { ServiceTypeController } from './service_type.controller';
import { ServiceTypeService } from './service_type.service';
import { ServiceTypeDAO } from 'src/database/dao/service_type.dao';

@Module({
  controllers: [ServiceTypeController],
  providers: [ServiceTypeService, ServiceTypeDAO],
})
export class ServiceTypeModule {}
