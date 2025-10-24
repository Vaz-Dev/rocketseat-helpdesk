import { Test, TestingModule } from '@nestjs/testing';
import { ServiceCallService } from './service_call.service';

describe('ServiceCallService', () => {
  let service: ServiceCallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceCallService],
    }).compile();

    service = module.get<ServiceCallService>(ServiceCallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
