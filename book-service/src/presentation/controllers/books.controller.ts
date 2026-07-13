import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CreateBookUseCase } from '../../application/use-cases/create-book.use-case';
import { UpdateBookUseCase } from '../../application/use-cases/update-book.use-case';
import { DeleteBookUseCase } from '../../application/use-cases/delete-book.use-case';
import { BorrowBookUseCase } from '../../application/use-cases/borrow-book.use-case';
import { FindBookUseCase } from '../../application/use-cases/find-book.use-case';
import { FindAllBooksUseCase } from '../../application/use-cases/find-all-books.use-case';

@Controller('books')
export class BooksController {
  constructor(
    private readonly findAllBooksUseCase: FindAllBooksUseCase,

    private readonly findBookUseCase: FindBookUseCase,
    private readonly createBookUseCase: CreateBookUseCase,
    private readonly updateBookUseCase: UpdateBookUseCase,
    private readonly deleteBookUseCase: DeleteBookUseCase,
    private readonly borrowBookUseCase: BorrowBookUseCase,
  ) {}

  @Get()
  findAll() {
    return this.findAllBooksUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findBookUseCase.execute(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.createBookUseCase.execute(body.title, body.author);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.updateBookUseCase.execute(
      id,
      body.title,
      body.author,
      body.available,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteBookUseCase.execute(id);
  }

  @MessagePattern('get_book')
  getBook(@Payload() id: string) {
    return this.findBookUseCase.execute(id);
  }

  @MessagePattern('borrow_book')
  borrowBook(@Payload() id: string) {
    return this.borrowBookUseCase.execute(id);
  }
}
