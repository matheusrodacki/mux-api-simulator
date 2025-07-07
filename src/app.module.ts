import { Module } from '@nestjs/common';
import { MuxController } from './controllers/mux.controller';
import { DataService } from './services/data.service';

@Module({
  imports: [],
  controllers: [MuxController],
  providers: [DataService],
})
export class AppModule {}
