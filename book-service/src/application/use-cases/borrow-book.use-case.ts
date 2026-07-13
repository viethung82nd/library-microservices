import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type { BookRepository } from '../../domain/repositories/book.repository';
import { BOOK_REPOSITORY } from '../../domain/repositories/repository.tokens';

@Injectable()
export class BorrowBookUseCase {
  constructor(
    @Inject(BOOK_REPOSITORY)
    private readonly repository: BookRepository,
  ) {}

  async execute(id: string) {
    const book = await this.repository.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (!book.available) {
      throw new BadRequestException('Book already borrowed');
    }

    try {
      book.borrow();
    } catch {
      throw new BadRequestException('Book already borrowed');
    }

    return this.repository.update(book);
  }
}
