import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {
  }

  async findAll(): Promise<Chat[]> {
    return await this.chatRepository.find();
  }

  async findLatest(): Promise<Chat[]> {
    return await this.chatRepository.find({
      order: {
        createdAt: 'ASC',
      },
      skip: 0,
      take: 10,
    });
  }
}
