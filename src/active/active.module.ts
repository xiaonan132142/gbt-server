import { Module } from '@nestjs/common';
import { ActiveController } from './active.controller';
import { ActiveService } from './active.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Active } from './active.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Active])],
  controllers: [ActiveController],
  providers: [ActiveService],
})
export class ActiveModule {
}
