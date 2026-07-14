import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';

import { BorrowsController } from './presentation/controllers/borrows.controller';

import { BorrowBookUseCase } from './application/use-cases/borrow-book.use-case';
import { ReturnBookUseCase } from './application/use-cases/return-book.use-case';
import { MongoBorrowRepository } from './infrastructure/repositories/mongo-borrow.repository';
import { Borrow, BorrowSchema } from './infrastructure/database/borrow.schema';

import { BORROW_REPOSITORY } from './domain/repositories/repository.tokens';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Borrow.name,
        schema: BorrowSchema,
      },
    ]),

    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 4001,
        },
      },
      {
        name: 'BOOK_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
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
  ],

  controllers: [BorrowsController],

  providers: [
    BorrowBookUseCase,
    ReturnBookUseCase,
    MongoBorrowRepository,

    {
      provide: BORROW_REPOSITORY,
      useExisting: MongoBorrowRepository,
    },
  ],

  exports: [BorrowBookUseCase],
})
export class BorrowsModule {}
