import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BorrowsModule } from './borrows/borrows.module';

@Module({
  imports: [BorrowsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
