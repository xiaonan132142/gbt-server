import { Controller, Get, Param } from '@nestjs/common';
import { PredictService } from './predict.service';
import { Predict } from './predict.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiUseTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUseTags('predict')
@Controller('predict')
export class PredictController {
  constructor(private readonly predictService: PredictService) {
  }

  @Get()
  findAll(): Promise<Predict[]> {
    return this.predictService.findAll();
  }

  @Get(':id')
  findOneByUserId(@Param('id') id: number): Promise<Predict> {
    return this.predictService.findOneById(+id);
  }
}
