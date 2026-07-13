import { Inject, Injectable } from '@nestjs/common';

import { Book } from '../../domain/entities/book.entity';
import type { BookRepository } from '../../domain/repositories/book.repository';
import { BOOK_REPOSITORY } from '../../domain/repositories/repository.tokens';

@Injectable()
export class CreateBookUseCase {
  constructor(
    @Inject(BOOK_REPOSITORY)
    private readonly repository: BookRepository,
  ) {}

  async execute(title: string, author: string) {
    const book = new Book(null, title, author, true);

    return this.repository.save(book);
  }
}
