import { Test, TestingModule } from '@nestjs/testing';
import { PredictController } from './predict.controller';

describe('Predict Controller', () => {
  let controller: PredictController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PredictController],
    }).compile();

    controller = module.get<PredictController>(PredictController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
