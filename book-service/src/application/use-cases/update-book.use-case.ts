import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { BookRepository } from '../../domain/repositories/book.repository';
import { BOOK_REPOSITORY } from '../../domain/repositories/repository.tokens';

@Injectable()
export class UpdateBookUseCase {
  constructor(
    @Inject(BOOK_REPOSITORY)
    private readonly repository: BookRepository,
  ) {}

  async execute(id: string, title: string, author: string, available: boolean) {
    const book = await this.repository.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    book.rename(title);

    book.changeAuthor(author);

    if (available && !book.available) {
      book.returnBook();
    }

    if (!available && book.available) {
      book.borrow();
    }

    return this.repository.update(book);
  }
}
