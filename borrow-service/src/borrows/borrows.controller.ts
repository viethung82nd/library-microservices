import { Body, Controller, Post } from '@nestjs/common';
import { BorrowsService } from './borrows.service';

@Controller('borrow')
export class BorrowsController {
  constructor(private readonly borrowsService: BorrowsService) {}

  @Post()
  borrow(@Body() body: any) {
    return this.borrowsService.borrow(body.userId, body.bookId);
  }
}
