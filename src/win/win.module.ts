import { Module } from '@nestjs/common';
import { WinController } from './win.controller';
import { WinService } from './win.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Win } from '../win/win.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Win])],
  controllers: [WinController],
  providers: [WinService]
})
export class WinModule {}
