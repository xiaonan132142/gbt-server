import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Active } from './active.entity';

@Injectable()
export class ActiveService {
  constructor(
    @InjectRepository(Active)
    private readonly activeRepository: Repository<Active>,
  ) {
  }

  async findTop(): Promise<Active[]> {
    return await this.activeRepository.find({
      order: {
        rank: 'ASC',
      },
      skip: 0,
      take: 10,
    });
  }

  async findOneByUserId(userId: String): Promise<Active> {
    return await this.activeRepository.findOne({
      select: ['userId', 'userName', 'userLogo', 'times', 'rank'],
      where: {
        userId: userId,
      },
    });
  }
}
