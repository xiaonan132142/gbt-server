import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Predict } from './predict.entity';
import { Active } from '../active/active.entity';

@Injectable()
export class PredictService {
  constructor(
    @InjectRepository(Predict)
    private readonly predictRepository: Repository<Predict>,
  ) {
  }

  async findAll(): Promise<Predict[]> {
    return await this.predictRepository.find();
  }


  async findOneById(id: Number): Promise<Predict> {
    return await this.predictRepository.findOne({
      select: ['id', 'userId', 'userName', 'userLogo', 'predictDate', 'predictResult', 'actualResult', 'predictValue', 'actualValue', 'isFinished'],
      where: {
        id: id,
      },
    });
  }
}
