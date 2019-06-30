import { Body, Controller, Get, Param } from '@nestjs/common';
import { ActiveService } from './active.service';
import { Active } from './active.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiUseTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUseTags('active')
@Controller('active')
export class ActiveController {
  constructor(private readonly activeService: ActiveService) {
  }

  @Get()
  findTop(): Promise<Active[]> {
    return this.activeService.findTop();
  }

  @Get(':userId')
  findOneByUserId(@Param('userId') userId: string): Promise<Active> {
    return this.activeService.findOneByUserId(userId);
  }
}
