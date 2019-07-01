import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './chat.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiUseTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUseTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {
  }

  @Get()
  findLatest(): Promise<Object[]> {
    let promise = this.chatService.findLatest();
    let data = promise.then(list => {
      return list.map(l => {
        return {
          userId: l.userId,
          userName: l.userName,
          avatar: l.userLogo,
          words: l.content,
        };
      });
    });
    return data;
  }
}
