import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './chat.entity';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {
  }

  @Get()
  findLatest(): Promise<Chat[]> {
    return this.chatService.findLatest();
  }
}
