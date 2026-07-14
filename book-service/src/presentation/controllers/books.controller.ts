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

import { ReturnBookUseCase } from '../../application/use-cases/return-book.use-case';
import { BookTitle } from '../../domain/value-objects/book-title.vo';
import { AuthorName } from '../../domain/value-objects/author-name.vo';
import { CreateBookDto } from '../dto/create-book.dto';
import { CreateBookUseCase } from '../../application/use-cases/create-book.use-case';
import { UpdateBookUseCase } from '../../application/use-cases/update-book.use-case';
import { DeleteBookUseCase } from '../../application/use-cases/delete-book.use-case';
import { BorrowBookUseCase } from '../../application/use-cases/borrow-book.use-case';
import { FindBookUseCase } from '../../application/use-cases/find-book.use-case';
import { FindAllBooksUseCase } from '../../application/use-cases/find-all-books.use-case';
import { UpdateBookDto } from '../dto/update-book.dto';
import { BookResponseDto } from '../dto/book-response.dto';

@Controller('books')
export class BooksController {
  constructor(
    private readonly findAllBooksUseCase: FindAllBooksUseCase,

    private readonly findBookUseCase: FindBookUseCase,
    private readonly createBookUseCase: CreateBookUseCase,
    private readonly updateBookUseCase: UpdateBookUseCase,
    private readonly deleteBookUseCase: DeleteBookUseCase,
    private readonly borrowBookUseCase: BorrowBookUseCase,
    private readonly returnBookUseCase: ReturnBookUseCase,
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
  create(@Body() dto: CreateBookDto) {
    return this.createBookUseCase.execute(dto.title, dto.author);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.updateBookUseCase.execute(
      id,
      dto.title ? new BookTitle(dto.title) : undefined,
      dto.author ? new AuthorName(dto.author) : undefined,
      dto.available,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteBookUseCase.execute(id);
  }

  @MessagePattern('get_book')
  async getBook(@Payload() id: string): Promise<BookResponseDto> {
    const book = await this.findBookUseCase.execute(id);

    return {
      id: book.id!.getValue(),
      title: book.title.getValue(),
      author: book.author.getValue(),
      available: book.available,
    };
  }

  @MessagePattern('borrow_book')
  borrowBook(@Payload() id: string) {
    return this.borrowBookUseCase.execute(id);
  }

  @MessagePattern('return_book')
  returnBook(@Payload() id: string) {
    return this.returnBookUseCase.execute(id);
  }
}
