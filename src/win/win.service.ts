import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Win } from './win.entity';

@Injectable()
export class WinService {
  constructor(
    @InjectRepository(Win)
    private readonly winRepository: Repository<Win>,
  ) {
  }

  async findTop(): Promise<Win[]> {
    return await this.winRepository.find({
      order: {
        rank: 'ASC',
      },
      skip: 0,
      take: 10,
    });
  }

  async findOneByUserId(userId: String): Promise<Win> {
    return await this.winRepository.findOne({
      select: ['userId', 'userName', 'userLogo', 'predictTimes', 'winTimes', 'winRatio', 'rank'],
      where: {
        userId: userId,
      },
    });
  }
}
