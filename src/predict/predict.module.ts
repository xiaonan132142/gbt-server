import { Module } from '@nestjs/common';
import { PredictController } from './predict.controller';
import { PredictService } from './predict.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Predict } from './predict.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Predict])],
  controllers: [PredictController],
  providers: [PredictService]
})
export class PredictModule {}
