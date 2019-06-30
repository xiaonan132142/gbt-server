import { Controller, Get, Param } from '@nestjs/common';
import { WinService } from './win.service';
import { Win } from './win.entity';
import { Active } from '../active/active.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiUseTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUseTags('win')
@Controller('win')
export class WinController {
  constructor(private readonly winService: WinService) {
  }

  @Get()
  findTop(): Promise<Win[]> {
    return this.winService.findTop();
  }

  @Get(':userId')
  findOneByUserId(@Param('userId') userId: string): Promise<Win> {
    return this.winService.findOneByUserId(userId);
  }
}
