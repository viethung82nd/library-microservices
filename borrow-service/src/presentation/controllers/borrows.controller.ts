import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CreateBorrowDto } from '../dto/create-borrow.dto';
import { BorrowBookUseCase } from '../../application/use-cases/borrow-book.use-case';
import { ReturnBookUseCase } from '../../application/use-cases/return-book.use-case';

@Controller('borrow')
export class BorrowsController {
  constructor(
    private readonly borrowBookUseCase: BorrowBookUseCase,
    private readonly returnBookUseCase: ReturnBookUseCase,
  ) {}

  @Post()
  borrow(@Body() dto: CreateBorrowDto) {
    return this.borrowBookUseCase.execute(dto.userId, dto.bookId);
  }

  @Patch(':id/return')
  returnBook(@Param('id') id: string) {
    return this.returnBookUseCase.execute(id);
  }
}
