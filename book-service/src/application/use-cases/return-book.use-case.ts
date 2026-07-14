import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { BOOK_REPOSITORY } from '../../domain/repositories/repository.tokens';
import type { BookRepository } from '../../domain/repositories/book.repository';

@Injectable()
export class ReturnBookUseCase {
  constructor(
    @Inject(BOOK_REPOSITORY)
    private readonly repository: BookRepository,
  ) {}

  async execute(id: string) {
    const book = await this.repository.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    book.returnBook();

    return this.repository.update(book);
  }
}
