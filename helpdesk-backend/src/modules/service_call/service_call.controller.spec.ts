import { Test, TestingModule } from '@nestjs/testing';
import { ServiceCallController } from './service_call.controller';

describe('ServiceCallController', () => {
  let controller: ServiceCallController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceCallController],
    }).compile();

    controller = module.get<ServiceCallController>(ServiceCallController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
