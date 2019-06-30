import { Test, TestingModule } from '@nestjs/testing';
import { ActiveService } from './active.service';

describe('ActiveService', () => {
  let service: ActiveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActiveService],
    }).compile();

    service = module.get<ActiveService>(ActiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
