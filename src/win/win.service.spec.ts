import { Test, TestingModule } from '@nestjs/testing';
import { WinService } from './win.service';

describe('WinService', () => {
  let service: WinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WinService],
    }).compile();

    service = module.get<WinService>(WinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
