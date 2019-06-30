import { Module } from '@nestjs/common';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PredictModule } from './predict/predict.module';
import { ChatModule } from './chat/chat.module';
import { ActiveModule } from './active/active.module';
import { WinModule } from './win/win.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'Bingying722',
    database: 'gbt',
    entities: [join(__dirname, '**/**.entity{.ts,.js}')],
    synchronize: true,
  }),
    PredictModule,
    ChatModule,
    ActiveModule,
    WinModule]
})
export class AppModule {
}
