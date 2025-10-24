import { Module } from '@nestjs/common';
import { ServiceCallController } from './service_call.controller';
import { ServiceCallService } from './service_call.service';

@Module({
  controllers: [ServiceCallController],
  providers: [ServiceCallService]
})
export class ServiceCallModule {}
