import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BorrowsModule } from './borrows.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/library'),
    BorrowsModule,
  ],
})
export class AppModule {}
