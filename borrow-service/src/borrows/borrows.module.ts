import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BorrowsController } from './borrows.controller';
import { BorrowsService } from './borrows.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Borrow, BorrowSchema } from './borrow.schema';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'notification_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4001,
        },
      },

      {
        name: 'BOOK_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4002,
        },
      },

      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'notification_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    MongooseModule.forRoot('mongodb://localhost:27017/library'),

    MongooseModule.forFeature([
      {
        name: Borrow.name,
        schema: BorrowSchema,
      },
    ]),
  ],
  controllers: [BorrowsController],
  providers: [BorrowsService],
})
export class BorrowsModule {}
