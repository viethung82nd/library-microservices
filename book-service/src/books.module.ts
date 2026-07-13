import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BooksController } from './presentation/controllers/books.controller';
import { FindAllBooksUseCase } from './application/use-cases/find-all-books.use-case';
import { FindBookUseCase } from './application/use-cases/find-book.use-case';
import { BOOK_REPOSITORY } from './domain/repositories/repository.tokens';
import { MongoBookRepository } from './infrastructure/repositories/mongo-book.repository';
import { Book, BookSchema } from './infrastructure/database/books.schema';
import { BorrowBookUseCase } from './application/use-cases/borrow-book.use-case';
import { DeleteBookUseCase } from './application/use-cases/delete-book.use-case';
import { UpdateBookUseCase } from './application/use-cases/update-book.use-case';
import { CreateBookUseCase } from './application/use-cases/create-book.use-case';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Book.name,
        schema: BookSchema,
      },
    ]),
  ],

  controllers: [BooksController],

  providers: [
    MongoBookRepository,

    {
      provide: BOOK_REPOSITORY,
      useExisting: MongoBookRepository,
    },
    FindAllBooksUseCase,
    FindBookUseCase,
    CreateBookUseCase,
    UpdateBookUseCase,
    DeleteBookUseCase,
    BorrowBookUseCase,
  ],
})
export class BooksModule {}
