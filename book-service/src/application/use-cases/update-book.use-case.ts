import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { BookRepository } from '../../domain/repositories/book.repository';
import { BOOK_REPOSITORY } from '../../domain/repositories/repository.tokens';
import { AuthorName } from '../../domain/value-objects/author-name.vo';
import { BookTitle } from '../../domain/value-objects/book-title.vo';

@Injectable()
export class UpdateBookUseCase {
  constructor(
    @Inject(BOOK_REPOSITORY)
    private readonly repository: BookRepository,
  ) {}

  async execute(
    id: string,
    title?: BookTitle,
    author?: AuthorName,
    available?: boolean,
  ) {
    const book = await this.repository.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (title !== undefined) {
      book.rename(title);
    }

    if (author !== undefined) {
      book.changeAuthor(author);
    }

    if (available !== undefined) {
      if (available && !book.available) {
        book.returnBook();
      }

      if (!available && book.available) {
        book.borrow();
      }
    }

    return this.repository.update(book);
  }
}
