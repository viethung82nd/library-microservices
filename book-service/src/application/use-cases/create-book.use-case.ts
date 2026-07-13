import { Inject, Injectable } from '@nestjs/common';
import { BookTitle } from '../../domain/value-objects/book-title.vo';
import { Book } from '../../domain/entities/book.entity';
import type { BookRepository } from '../../domain/repositories/book.repository';
import { BOOK_REPOSITORY } from '../../domain/repositories/repository.tokens';
import { AuthorName } from '../../domain/value-objects/author-name.vo';

@Injectable()
export class CreateBookUseCase {
  constructor(
    @Inject(BOOK_REPOSITORY)
    private readonly repository: BookRepository,
  ) {}

  async execute(title: string, author: string) {
    const book = new Book(
      null,
      new BookTitle(title),
      new AuthorName(author),
      true,
    );

    return this.repository.save(book);
  }
}
