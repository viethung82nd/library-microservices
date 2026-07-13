import { Inject, Injectable } from '@nestjs/common';

import type { BookRepository } from '../../domain/repositories/book.repository';
import { BOOK_REPOSITORY } from '../../domain/repositories/repository.tokens';

@Injectable()
export class FindAllBooksUseCase {
  constructor(
    @Inject(BOOK_REPOSITORY)
    private readonly repository: BookRepository,
  ) {}

  execute() {
    return this.repository.findAll();
  }
}
