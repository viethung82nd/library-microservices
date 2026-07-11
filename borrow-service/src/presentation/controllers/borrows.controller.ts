import { Body, Controller, Post } from '@nestjs/common';
import { CreateBorrowDto } from '../dto/create-borrow.dto';
import { BorrowBookUseCase } from '../../application/use-cases/borrow-book.use-case';

@Controller('borrow')
export class BorrowsController {
  constructor(private readonly borrowBookUseCase: BorrowBookUseCase) {}

  @Post()
  borrow(@Body() dto: CreateBorrowDto) {
    return this.borrowBookUseCase.execute(dto.userId, dto.bookId);
  }
}
