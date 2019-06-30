import { Test, TestingModule } from '@nestjs/testing';
import { WinController } from './win.controller';

describe('Win Controller', () => {
  let controller: WinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WinController],
    }).compile();

    controller = module.get<WinController>(WinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
